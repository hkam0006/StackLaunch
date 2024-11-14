import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import unzipper from 'unzipper';

export async function downloadAndExtractRepo(repoUrl: string) {
  const url = `${repoUrl}/archive/refs/heads/main.zip`;
  const zipPath = path.join("/tmp", "repo.zip") // Vercel allows temporary storage in the /tmp directory

  if (!fs.existsSync('/tmp')) {
    fs.mkdirSync('/tmp');
  }

  // Download the ZIP file
  const response = await fetch(url);
  const data = await response.arrayBuffer()
  const bufferData = Buffer.from(data)
  fs.writeFileSync(zipPath, bufferData)
  
  // Extract the ZIP file
  fs.createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: "/tmp"}))
    .on('close', () => {
      console.log('Repository downloaded and extracted');
    });
  return "/tmp"
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