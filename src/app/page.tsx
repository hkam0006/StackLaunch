"use client";
import axios from "axios";
import React, { useState } from "react";
import Navbar from "@/components/nav-bar";
import RepoGrid from "@/components/repo-grid"

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [domainName, setDomainName] = useState("");

  const handleUploadRepo = async () => {
    await axios.post("http://localhost:3000/api/upload", {
      repoUrl: repoUrl,
      domainName: domainName,
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-2">
        <RepoGrid />
      </div>
    </>
  );
}
