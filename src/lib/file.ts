import * as fs from 'fs';
import * as path from 'path';

export default function getAllFilePaths(
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

