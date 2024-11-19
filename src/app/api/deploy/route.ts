import { downloadS3Folder } from "@/lib/aws";
import { buildProject } from "@/lib/build";
import { S3 } from "aws-sdk";

export const POST = async (req: Request) => {
  const data = await req.json()

  const id = data.id
  if (!id){
    return new Response("ID not given", {status: 400})
  }
  try {
    await downloadS3Folder(`stacklaunch/output/${id}/`)
  } catch (err) {
    return new Response("Error downloading folder", {status: 400})
  }

  try {
    await buildProject(id)
  } catch (err){
    return new Response("Error building project", {status: 400})
  }

  return new Response("Project built", {status: 200})
}