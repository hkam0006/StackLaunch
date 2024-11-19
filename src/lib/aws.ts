import { S3 } from 'aws-sdk';
import * as fs from 'fs';
import path from 'path';

export async function uploadFile (
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

export async function downloadS3Folder(prefix: string) {
  const s3Client = new S3({
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.CLOUDFLARE_ACCESS_KEY_SECRET as string,
    endpoint: process.env.DOWNLOAD_ENDPOINT as string
  })
  try {
    const result = await s3Client
      .listObjectsV2({
        Bucket: 'stacklaunch',
        Prefix: prefix,
      })
      .promise();
    
    console.log(result)

    if (!result.Contents || result.Contents.length === 0) {
      console.log('No files found in the specified prefix.');
      return;
    }

    const allPromises = result.Contents.map(async ({ Key }) => {
      if (!Key) return; // Skip undefined keys (e.g., "folder objects")

      const outputPath = path.join(process.env.WORK_DIR as string, Key);
      const dirName = path.dirname(outputPath);

      // Ensure the directory exists
      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
      }

      // Create a write stream and handle the download
      const outputFile = fs.createWriteStream(outputPath);
      return new Promise<void>((resolve, reject) => {
        s3Client
          .getObject({
            Bucket: 'stacklaunch',
            Key,
          })
          .createReadStream()
          .on('error', (err) => {
            console.error(`Failed to download ${Key}:`, err);
            reject(err); // Reject the promise on error
          })
          .pipe(outputFile)
          .on('finish', () => {
            console.log(`Downloaded ${Key} to ${outputPath}`);
            resolve();
          });
      });
    });

    // Wait for all files to download
    await Promise.all(allPromises);
    console.log('All files downloaded successfully.');
  } catch (error) {
    console.error('Error downloading S3 folder:', error);
    throw error;
  }
}
