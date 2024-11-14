import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import unzipper from 'unzipper';
import { S3 } from 'aws-sdk';

async function uploadToS3(bucketName: string, key: string, body: Buffer, s3: S3) {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: body,
  };
  return s3.upload(params).promise();
}

// Function to download, extract, and upload repository contents to S3
export async function downloadAndExtractRepoToS3(repoUrl: string, bucketName: string, domainName: string, s3: S3) {
  const url = `${repoUrl}/archive/refs/heads/main.zip`;

  // Download the ZIP file
  const response = await fetch(url);
  if (!response.body) {
    throw new Error("Failed to download repository archive.");
  }

  // Stream the ZIP file and extract files directly to S3
  const extractStream = response.body.pipe(unzipper.Parse({ forceStream: true }));

  for await (const entry of extractStream) {
    const fileName = entry.path;

    if (entry.type === 'File') {
      // Read file content as a buffer and upload it to S3
      const fileContent = await entry.buffer();
      const s3Key = `/output/${domainName}/${fileName}`; // S3 path for the file

      try {
        await uploadToS3(bucketName, s3Key, fileContent, s3);
        console.log(`Uploaded ${fileName} to S3 at ${s3Key}`);
      } catch (error) {
        console.error(`Failed to upload ${fileName} to S3:`, error);
      }
    } else {
      // Skip directories
      entry.autodrain();
    }
  }

  console.log('Repository downloaded and uploaded to S3');
}


export function getAllFilePaths(
  dirPath: string,
  arrayOfFiles: string[]
) {
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const filePath = path.join(dirPath, file)
    if (fs.statSync(filePath).isDirectory()){
      getAllFilePaths(filePath, arrayOfFiles)
    } else {
      arrayOfFiles.push(filePath);
    }
  })
  return arrayOfFiles
}

export function deleteFiles(
  filePaths: string[]
){
  for(const filePath of filePaths){
    try {
      fs.rm(filePath, {recursive: true, force: true}, () => {});
    } catch (err) {
      console.error('Error deleting file path')
    }
  }
}

export function deleteDirectories(directories: string[]) {
  for (const dir of directories) {
    try {
      fs.rm(dir, { recursive: true, force: true }, (err) => {
        if (err) throw err
      }); 
      console.log(`Deleted directory: ${dir}`);
    } catch (error) {
      console.error(`Error deleting directory ${dir}:`, error);
    }
  }
}

export function clearDirectory(dirPath: string) {
  const files = fs.readdirSync(dirPath); // Read contents of the directory

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // Recursively delete subdirectories
      fs.rmSync(filePath, { recursive: true, force: true });
    } else {
      // Delete files
      fs.unlinkSync(filePath);
    }
  });
}