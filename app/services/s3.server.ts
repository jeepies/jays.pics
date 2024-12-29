import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { LogType } from "@prisma/client";
import { prisma } from "./database.server";

const {
  STORAGE_PROVIDER,
  STORAGE_ACCESS_KEY,
  STORAGE_SECRET,
  STORAGE_REGION,
  STORAGE_BUCKET,
  CLOUDFLARE_USER_ID,
} = process.env;

if (
  !(STORAGE_ACCESS_KEY && STORAGE_SECRET && STORAGE_BUCKET && STORAGE_PROVIDER)
) {
  throw new Error(`Storage is missing required configuration.`);
}

if (STORAGE_PROVIDER !== "r2" && STORAGE_PROVIDER !== "aws") {
  throw new Error(`Invalid storage provider.`);
}

function getStorageClient() {
  const baseConfig = {
    credentials: {
      accessKeyId: STORAGE_ACCESS_KEY as string,
      secretAccessKey: STORAGE_SECRET as string,
    },
  };

  if (STORAGE_PROVIDER === "r2" && CLOUDFLARE_USER_ID) {
    return new S3Client({
      ...baseConfig,
      endpoint: `https://${CLOUDFLARE_USER_ID}.r2.cloudflarestorage.com`,
      region: STORAGE_REGION || "auto",
    });
  } else {
    if (!STORAGE_REGION) {
      throw new Error("AWS S3 requires STORAGE_REGION to be set");
    }
    return new S3Client({
      ...baseConfig,
      region: STORAGE_REGION,
    });
  }
}

const storageClient = getStorageClient();

export async function upload(file: File, filename: string) {
  try {
    const upload = new Upload({
      client: storageClient,
      leavePartsOnError: false,
      params: {
        Bucket: STORAGE_BUCKET,
        Key: filename,
        Body: file.stream(),
        ContentType: file.type,
      },
    });

    const res = await upload.done();
    return res;
  } catch (err) {
    await prisma.log.create({
      data: {
        message: `Storage upload failed with error: ${err}`,
        type: LogType.ERROR,
      },
    });
    throw err;
  }
}

export async function get(key: string) {
  try {
    let url;
    if (STORAGE_PROVIDER === "r2" && CLOUDFLARE_USER_ID) {
      url = `https://${CLOUDFLARE_USER_ID}.r2.cloudflarestorage.com/${STORAGE_BUCKET}/${key}`;
    } else {
      url = `https://s3.${STORAGE_REGION}.amazonaws.com/${STORAGE_BUCKET}/${key}`;
    }
    console.log(url);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch file: ${res.statusText}`);
    }
    return await res.blob();
  } catch (err) {
    await prisma.log.create({
      data: {
        message: `Storage fetch failed with error: ${err}`,
        type: LogType.ERROR,
      },
    });
    throw err;
  }
}

export async function del(key: string) {
  try {
    await storageClient.send(
      new DeleteObjectCommand({ Bucket: STORAGE_BUCKET, Key: key })
    );
  } catch (err) {
    await prisma.log.create({
      data: {
        message: `Storage deletion failed with error: ${err}`,
        type: LogType.ERROR,
      },
    });
    throw err;
  }
}
