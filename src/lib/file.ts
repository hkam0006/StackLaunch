import * as fs from 'fs';
import * as path from 'path';

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

