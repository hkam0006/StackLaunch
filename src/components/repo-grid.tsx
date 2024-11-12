"use client";

import React, { useState } from "react";
import { BadgePlus, Grid2X2, List } from "lucide-react";
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

function NewRepoDialog() {
  const [domainName, setDomainName] = useState("")
  const [repoUrl, setRepoUrl] = useState("")

  function clearForm(){
    setRepoUrl("")
    setDomainName("")
  }

  const handleUploadRepo = async () => {
    await axios.post("https://stacklaunch.vercel.app/api/upload", {
      repoUrl: repoUrl,
      domainName: domainName,
    });
  };

  return (
    <Dialog onOpenChange={() => clearForm()}>
      <DialogTrigger asChild>
        <Button className="h-100">
          <BadgePlus />
          New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add new repository</DialogTitle>
          <DialogDescription>
            Deploy a new repository
          </DialogDescription>
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
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => handleUploadRepo()}>Add</Button>
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
