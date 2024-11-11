import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { EllipsisVerticalIcon, FolderGit } from "lucide-react";

const RepoCardItem = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Repo Name</CardTitle>
          <Button variant="outline" size="icon">
            <EllipsisVerticalIcon />
          </Button>
        </div>
        <CardDescription>
          <Button className="p-0" variant='link'>
            www.repourl.com
          </Button>
          <br />
          Last updated: Date
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default RepoCardItem;
