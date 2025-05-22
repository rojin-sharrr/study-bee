"use client";

import React, { use } from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CourseService } from "@/services";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const CreateCourse = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const createCourseHandler = async () => {
    try {
      console.log(`Making a create Course req from frontend page`)
      const data = await CourseService.createCourse({ name, description });

      if (data.error) {
        toast.error(`Error while creating the course: ${error}`);
        setError('Error while creating the course');
      } else {
        toast.success('Course created successfully!');
        setName("");
        setDescription("");
        router.push("/");
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      setError(error.errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Toaster />
      <Card className="w-96 text-center justify-center">
        <CardHeader>
          <CardTitle>Create a Course</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            type="text"
            value={name}
            placeholder="Course Name"
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Course Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button onClick={createCourseHandler}>Create Course</Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground text-center"></div>
          <Button variant="outline" className="w-full" asChild>
            <a href="/">← Go Back</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateCourse;
