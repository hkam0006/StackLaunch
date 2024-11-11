"use client";

import React, { useState } from "react";
import { BadgePlus, Grid2X2, List } from "lucide-react";
import { Command, CommandInput } from "@/components/ui/command";
import { Button } from "./ui/button";

import RepoCard from "@/components/repo-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "./ui/input";

const RepoGrid = () => {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid")

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
            <TabsTrigger onClick={() => setView("grid")} value="grid"><Grid2X2 /></TabsTrigger>
            <TabsTrigger onClick={() => setView("list")} value="list"><List /></TabsTrigger>
          </TabsList>
        </Tabs>
        <Button className="h-100 ">
          <BadgePlus />
          New
        </Button>
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
