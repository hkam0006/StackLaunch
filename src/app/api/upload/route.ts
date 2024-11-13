import { db } from "@/server/db"
import simpleGit from "simple-git"
import {getAllFilePaths, deleteFiles, deleteDirectories, downloadAndExtractRepo, clearDirectory} from "@/lib/file"
import { S3 } from 'aws-sdk';
import uploadFile from "@/lib/aws";
import { auth } from "@clerk/nextjs/server";
import sendToRabbitMQ from "@/lib/message_queue";
import path from "path";

const s3 = new S3({
  accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.CLOUDFLARE_ACCESS_KEY_SECRET as string,
  endpoint: process.env.CLOUDFLARE_ENDPOINT as string
})

export const POST = async (req: Request) => {
  const data = await req.json()

  const domainName = data.domainName
  if (!domainName){
    return new Response("Domain name not given", {status: 400})
  }

  // Check if domain already exists
  const domainAlreadyExists = await db.domain.findFirst({
    where: {
      domainName: {
        equals: domainName
      }
    }
  })

  if (domainAlreadyExists){
    return new Response("Domain name already exists, Try another one", {status: 400})
  }
  
  // Check of repo url is given
  const repoUrl = data.repoUrl
  if (!repoUrl){
    return new Response("Repository URL not found", {status: 400})
  }
  
  let outputDir: string;

  // Clone github repo
  try {
    outputDir = await downloadAndExtractRepo(repoUrl)
  } catch (err) {
    console.error(err)
    return new Response(`Failed to clone repository ${err}`, {status: 400})
  }

  const filePaths: string[] = []

  // Get all file paths
  try {
    if (!outputDir){
      return new Response(`Failed to clone repository`, {status: 400})
    }
    getAllFilePaths(outputDir, filePaths)
  } catch (err) {
    return new Response(`Error occurred while retrieving file paths, ${err}`, {status: 400})
  }

  try {
    filePaths.forEach(async (localFilePath) => {
      await uploadFile(
        s3,
        localFilePath
      )
    })
    deleteFiles(filePaths)
    clearDirectory(outputDir)
  } catch (err) {
    return new Response(`Error occurred while uploading files, ${err}`, {status: 400})
  }

  // Send job to queue
  try {
    sendToRabbitMQ(
      "build_queue",
      domainName
    )
  } catch (err) {
    return new Response(`Error occurred while submitting job to queue ${err}`, {status: 400})
  }

  const {userId} = await auth()
  const currentDate = new Date()
  await db.domain.create({
    data: {
      domainName: domainName,
      userId: userId as string,
      createdAt: currentDate,
      lastUpdatedAt: currentDate,
    }
  })

  const responseData = JSON.stringify({
    message: "Repository successfully uploaded to object store",
    domainName: domainName
  })

  return new Response(responseData, {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}