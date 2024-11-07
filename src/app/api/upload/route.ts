import simpleGit from "simple-git"

export const POST = async (req: Request) => {
  const data = await req.json()
  const id = "test_id"
  
  const repoUrl = data.repoUrl
  if (!repoUrl){
    return new Response("Repository URL not found", {status: 400})
  }
  try {
    await simpleGit().clone(repoUrl, `./output/${"test_id"}`)
  } catch (err) {
    console.error(err)
    return new Response("Repository clone failed", {status: 400})
  }
  return new Response("Repository successfully deployed", {status: 200})
}