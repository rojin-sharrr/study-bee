"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { CourseService, AssetService } from "@/services";
import { useEffect, useState } from "react";
import { ICourseModel } from "@/interfaces/ICourse";
import { IAssetModel } from "@/interfaces/IAsset";
import { toast, Toaster } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  BookOpen,
  ArrowLeft,
  Plus,
  FileText,
} from "lucide-react";

const CoursePage = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<ICourseModel | null>(null);
  const [allAssets, setAllAssets] = useState<IAssetModel[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deleteAssetHandler = async (assetId: string) => {
    try {
      const response = await AssetService.deleteAsset(assetId, courseId);
      await fetchAllAssets();
    } catch (error) {
      toast.error("Failed to delete asset");
      console.log(`Error occurred in deleteAsset`);
    }
  };

  const fetchAllAssets = async () => {
    try {
      setLoading(true);
      const response = await AssetService.getAllAssets(courseId);
      if (response.error) {
        toast.error(response.message);
      } else {
        setAllAssets(response.data);
      }
    } catch (error) {
      toast.error("Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  const viewFileHandler = async (assetId: string, courseId: string) => {
    window.open(`http://localhost:8000/api/asset/${assetId}/view?courseId=${courseId}`);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await CourseService.getCourseById(courseId);

        if (response.error) {
          setError(response.message);
          toast.error(response.message);
        } else {
          setCourse(response.data);
        }
      } catch (err) {
        const errorMessage = "Failed to fetch course";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchAllAssets();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-10 w-40" />
          </div>
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <div className="grid gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 hover:bg-slate-100 transition-colors"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" closeButton />

      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 hover:bg-slate-100 transition-colors group"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Courses
        </Button>

        {/* Course Details Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold">
                  {course?.name}
                </CardTitle>
                <CardDescription className="mt-2 text-lg">
                  {course?.description}
                </CardDescription>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant="outline" className="text-sm">
                  Course ID: {courseId}
                </Badge>
                <div className="flex gap-3">
                  <Button
                    onClick={() => router.push(`/course/${courseId}/quiz`)}
                    className="rounded-full px-6 py-2 bg-black hover:bg-gray-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Take Quiz
                  </Button>
                  <Button
                    onClick={() => router.push(`/course/${courseId}/past-quizzes`)}
                    variant="outline"
                    className="rounded-full px-6 py-2 font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Past Quizzes
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>
                  Created:{" "}
                  {new Date(course?.createdAt || "").toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>
                  Last Updated:{" "}
                  {new Date(course?.updatedAt || "").toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span> {allAssets?.length} assets</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assets Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Course Assets</CardTitle>
              <CardDescription>
                All the learning materials and resources for this course
              </CardDescription>
            </div>
            <Button
              onClick={() => router.push(`/course/${courseId}/upload`)}
              className="rounded-full px-6 py-2 bg-black hover:bg-gray-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Asset
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : allAssets?.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No assets have been added to this course yet.
                </p>
                <Button
                  onClick={() => router.push(`/course/${courseId}/upload`)}
                  className="mt-4 rounded-full px-6 py-2 bg-black hover:bg-gray-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                  Add Your First Asset
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {allAssets?.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {asset.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Added {new Date(asset.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => viewFileHandler(asset.id, courseId)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full text-red-600 hover:text-red-700"
                        onClick={() => deleteAssetHandler(asset.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoursePage;
