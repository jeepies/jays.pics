import {
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from '@aws-sdk/lib-storage'
import { Readable } from "stream";

const { STORAGE_ACCESS_KEY, STORAGE_SECRET, STORAGE_REGION, STORAGE_BUCKET } =
  process.env;

if (
  !(STORAGE_ACCESS_KEY && STORAGE_SECRET && STORAGE_REGION && STORAGE_BUCKET)
) {
  throw new Error(`Storage is missing required configuration.`);
}

const S3 = new S3Client({
  credentials: {
    secretAccessKey: STORAGE_SECRET,
    accessKeyId: STORAGE_ACCESS_KEY,
  },
  region: STORAGE_REGION
})

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
    })
    
    const res = await upload.done();
    return res;
  } catch(err) {
    console.log(err)
  }
}

export async function get(key: string) {
  const res = await fetch(`https://s3.${STORAGE_REGION}.amazonaws.com/${STORAGE_BUCKET}/${key}`);
  return await res.blob();
}