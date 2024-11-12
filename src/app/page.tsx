import React from "react";
import RepoGrid from "@/components/repo-grid"
import Navbar from "@/components/nav-bar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-2">
        <RepoGrid />
      </div>
    </>
  );
}
