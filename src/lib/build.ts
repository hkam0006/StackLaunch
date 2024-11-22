import { spawn, exec } from "child_process";
import path from "path";

export function buildProject(id: string){
  return new Promise((resolve) => {
    const child = exec(`cd ${path.join(process.env.WORK_DIR as string, id)} && npm install && npm run build`)

    child.stdout?.on('data', (data) => {
      console.log('stdout: ', data)
    })

    child.stderr?.on('data', (data) => {
      console.log('stderr: ', data)
      throw data
    })

    child.on('close', () => {
      resolve("")
    })
  })
}