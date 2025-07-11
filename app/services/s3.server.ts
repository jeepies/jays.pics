import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { LogType } from "@prisma/client";

import { prisma } from "./database.server";

const {
  STORAGE_ACCESS_KEY,
  STORAGE_SECRET,
  STORAGE_REGION,
  STORAGE_BUCKET,
  STORAGE_PROVIDER,
  STORAGE_ENDPOINT,
  CLOUDFLARE_USER_ID,
} = process.env;

if (
  !(STORAGE_ACCESS_KEY && STORAGE_SECRET && STORAGE_REGION && STORAGE_BUCKET)
) {
  throw new Error(`Storage is missing required configuration.`);
}

const storageProvider = STORAGE_PROVIDER || "aws";

const clientConfig: any = {
  credentials: {
    secretAccessKey: STORAGE_SECRET,
    accessKeyId: STORAGE_ACCESS_KEY,
  },
  region: STORAGE_REGION,
};

if (storageProvider === "r2") {
  if (!STORAGE_ENDPOINT) {
    throw new Error("STORAGE_ENDPOINT is required for R2 provider");
  }
  if (!CLOUDFLARE_USER_ID) {
    throw new Error("CLOUDFLARE_USER_ID is required for R2 provider");
  }
  clientConfig.endpoint = STORAGE_ENDPOINT;
}

const S3 = new S3Client(clientConfig);

export async function uploadToS3(file: File, filename: string) {
  try {
    const upload = new Upload({
      client: S3,
      leavePartsOnError: false,
      params: {
        Bucket: STORAGE_BUCKET,
        Key: filename,
        Body: file.stream(),
      },
    });
    const res = await upload.done();
    return res;
  } catch (err) {
    await prisma.log.create({
      data: {
        message: "Storage upload failed with err " + err,
        type: LogType.ERROR,
      },
    });
  }
}

export async function get(key: string) {
  let url: string;

  if (storageProvider === "r2") {
    url = `https://${CLOUDFLARE_USER_ID}.r2.cloudflarestorage.com`;
  } else {
    url = `https://s3.${STORAGE_REGION}.amazonaws.com/${STORAGE_BUCKET}/${key}`;
  }

  const res = await fetch(url);
  return await res.blob();
}

export async function del(key: string) {
  await S3.send(new DeleteObjectCommand({ Bucket: STORAGE_BUCKET, Key: key }));
}

export function getPublicUrl(key: string): string {
  if (storageProvider === "r2") {
    return `https://pub-${CLOUDFLARE_USER_ID}.r2.dev/${key}`;
  } else {
    return `https://s3.${STORAGE_REGION}.amazonaws.com/${STORAGE_BUCKET}/${key}`;
  }
}
