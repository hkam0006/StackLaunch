import { db } from "@/server/db"
import simpleGit from "simple-git"
import {getAllFilePaths, deleteFiles, downloadAndExtractRepoToS3, clearDirectory, } from "@/lib/file"
import { S3 } from 'aws-sdk';
import uploadFile from "@/lib/aws";
import { auth } from "@clerk/nextjs/server";
import sendToRabbitMQ from "@/lib/message_queue";
import path from "path";

const s3 = new S3({
  accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.CLOUDFLARE_ACCESS_KEY_SECRET as string,
  endpoint: process.env.CLOUDFLARE_ENDPOINT as string,
  region: "apac"
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
    await downloadAndExtractRepoToS3(repoUrl, domainName, s3)
  } catch (err) {
    console.error(err)
    return new Response(`Failed to clone repository ${err}`, {status: 400})
  }

  // Send job to queue
  try {
    await sendToRabbitMQ(
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