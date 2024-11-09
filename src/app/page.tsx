'use client'
import axios from "axios"
import React, { useState } from "react"

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('')
  const [domainName, setDomainName] = useState('')

  const handleUploadRepo =  async () => {
    await axios.post(
      'http://localhost:3000/api/upload',
      {
        repoUrl: repoUrl,
        domainName: domainName
      }
    )
  }

  return (
    <div>
      <h1>StackLaunch</h1>
      <label>
        Repo URL: <input
          type="text" 
          value={repoUrl} 
          onChange={(e) => setRepoUrl(e.target.value)}
          className="bg-gray-500"
        />
      </label>
      <br />
      <label>
        Domain Name: <input 
          type="text" 
          value={domainName} 
          onChange={(e) => setDomainName(e.target.value)}
          className="bg-gray-500"
        />
      </label>
      <button onClick={() => handleUploadRepo()} >Upload file</button>
    </div>
  )
}
