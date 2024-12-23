"use client";

import React, { useState } from "react";
import { BadgePlus, Grid2X2, List, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";

import RepoCard from "@/components/repo-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { RepoDomain } from "@/lib/utils";
import Error from "next/error";

function NewRepoDialog() {
  const [domainName, setDomainName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")

  function clearForm() {
    if (open){
      setRepoUrl("");
      setDomainName("");
    }
    setOpen(!open)
  }

  const handleUploadRepo = async () => {
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/upload`, {
        repoUrl: repoUrl,
        domainName: domainName,
      });
      await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/deploy`, {
        id: domainName
      })
      setOpen(false)
    } catch(err){
      if (axios.isAxiosError(err)) {
        // Handle Axios-specific errors
        setError(err.response?.data || err.message || "An error occurred");
      } else {
        // Handle other unexpected errors
        setError("Unexpected error");
      }
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => clearForm()}>
      <DialogTrigger asChild>
        <Button className="h-100">
          <BadgePlus />
          New
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[500px] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Add new repository</DialogTitle>
          <DialogDescription>Deploy a new repository</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="domain_name" className="text-right">
              Domain Name
            </Label>
            <Input
              id="domain_name"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="repo_url" className="text-right">
              Repo URL
            </Label>
            <Input
              id="repo_url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="col-span-3"
            />
          </div>
          <p className="text-red-600">{error}</p>
        </div>
        <DialogFooter>
          {!loading ? (
            <Button type="submit" onClick={() => handleUploadRepo()}>
              Add
            </Button>
          ) : (
            <Button disabled>
              <Loader2 className="animate-spin" />
              Uploading and deploying repository
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const RepoGrid = () => {
  const [search, setSearch] = useState<string>("");
  const [view, setView] = useState<string>("grid");
  const [repoList, setRepoList] = useState<RepoDomain[]>([]);

  return (
    <>
      <div className="mb-2 flex space-x-2">
        <Input
          placeholder="Search for repositories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select defaultValue="last_updated">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last_updated">Last updated</SelectItem>
            <SelectItem value="last_created">Last created</SelectItem>
          </SelectContent>
        </Select>
        <Tabs defaultValue={view}>
          <TabsList>
            <TabsTrigger onClick={() => setView("grid")} value="grid">
              <Grid2X2 />
            </TabsTrigger>
            <TabsTrigger onClick={() => setView("list")} value="list">
              <List />
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <NewRepoDialog />
      </div>

      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        <RepoCard />
        <RepoCard />
        <RepoCard />
        <RepoCard />
        <RepoCard />
      </div>
    </>
  );
};

export default RepoGrid;
