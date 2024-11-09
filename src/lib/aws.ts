import { S3 } from 'aws-sdk';
import * as fs from 'fs';

export default async function uploadFile (
  s3Client: S3,
  filePath: string, 
) {
  const fileContent = fs.readFileSync(filePath)
  const response = await s3Client.upload({
    Body: fileContent,
    Bucket: "stacklaunch",
    Key: filePath
  }).promise()
}