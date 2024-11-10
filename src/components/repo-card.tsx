import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const RepoCardItem = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Repo Name</CardTitle>
        <CardDescription>www.repoulr.com</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-3">
        <Button>Edit</Button>
        <Button variant="destructive">Delete</Button>
      </CardFooter>
    </Card>
  );
};

export default RepoCardItem;
