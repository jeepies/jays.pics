import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { LogType } from "@prisma/client";

import { prisma } from "./database.server";

const {
  STORAGE_ACCESS_KEY,
  STORAGE_SECRET,
  STORAGE_REGION,
  STORAGE_BUCKET,
  R2_ACCESS_KEY,
  R2_SECRET,
  R2_REGION,
  R2_BUCKET,
  R2_ENDPOINT,
  STORAGE_BACKEND, // 's3' or 'r2', default to 's3'
} = process.env;

if (
  !(
    (STORAGE_ACCESS_KEY &&
      STORAGE_SECRET &&
      STORAGE_REGION &&
      STORAGE_BUCKET) ||
    (R2_ACCESS_KEY && R2_SECRET && R2_REGION && R2_BUCKET && R2_ENDPOINT)
  )
) {
  throw new Error(`Storage is missing required configuration.`);
}

const S3 =
  STORAGE_ACCESS_KEY && STORAGE_SECRET && STORAGE_REGION && STORAGE_BUCKET
    ? new S3Client({
        credentials: {
          secretAccessKey: STORAGE_SECRET,
          accessKeyId: STORAGE_ACCESS_KEY,
        },
        region: STORAGE_REGION,
      })
    : null;

const R2 =
  R2_ACCESS_KEY && R2_SECRET && R2_REGION && R2_BUCKET && R2_ENDPOINT
    ? new S3Client({
        credentials: {
          secretAccessKey: R2_SECRET,
          accessKeyId: R2_ACCESS_KEY,
        },
        region: R2_REGION,
        endpoint: R2_ENDPOINT,
        forcePathStyle: true,
      })
    : null;

function getClient(
  storage: "s3" | "r2" = (STORAGE_BACKEND as "s3" | "r2") || "s3",
) {
  if (storage === "r2") {
    if (!R2) throw new Error("R2 client not configured");
    return { client: R2, bucket: R2_BUCKET };
  }
  if (!S3) throw new Error("S3 client not configured");
  return { client: S3, bucket: STORAGE_BUCKET };
}

export async function uploadToS3(
  file: File,
  filename: string,
  storage: "s3" | "r2" = (STORAGE_BACKEND as "s3" | "r2") || "s3",
) {
  const { client, bucket } = getClient(storage);
  try {
    const upload = new Upload({
      client,
      leavePartsOnError: false,
      params: {
        Bucket: bucket,
        Key: filename,
        Body: file.stream(),
      },
    });
    const res = await upload.done();
    return res;
  } catch (err) {
    await prisma.log.create({
      data: {
        message: `Storage (${storage}) failed with err ` + err,
        type: LogType.ERROR,
      },
    });
  }
}

export async function get(
  key: string,
  storage: "s3" | "r2" = (STORAGE_BACKEND as "s3" | "r2") || "s3",
) {
  const { bucket } = getClient(storage);
  let url;
  if (storage === "r2") {
    url = `${R2_ENDPOINT}/${bucket}/${key}`;
  } else {
    url = `https://s3.${STORAGE_REGION}.amazonaws.com/${bucket}/${key}`;
  }
  const res = await fetch(url);
  return await res.blob();
}

export async function del(
  key: string,
  storage: "s3" | "r2" = (STORAGE_BACKEND as "s3" | "r2") || "s3",
) {
  const { client, bucket } = getClient(storage);
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
