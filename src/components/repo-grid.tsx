import React from "react";
import { BadgePlus } from "lucide-react";
import { Command, CommandInput } from "@/components/ui/command";
import { Button } from "./ui/button";

import RepoCard from "@/components/repo-card"

const RepoGrid = () => {
  return (
    <>
      <div className="mb-2 flex space-x-4">
        <Command>
          <CommandInput placeholder="Search for repositories..." />
        </Command>
        <Button className="h-100">
          <BadgePlus />
          New
        </Button>
      </div>

      <div className="grid gap-2 md:grid-cols-3 sm:grid-cols-2">
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
