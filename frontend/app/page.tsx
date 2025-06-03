"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { CourseService, AuthService } from "@/services";
import { ICourseModel } from "@/interfaces/ICourse";
import {
  Plus,
  LogOut,
  BookOpen,
  Book,
  RefreshCw,
  AlertCircle,
  Trash2,
} from "lucide-react";

export default function Courses() {
  const [courses, setCourses] = useState<ICourseModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const courses = await CourseService.getAllCourses();
      if (!courses.data) {
        throw new Error(courses.message);
      } else {
        setCourses(courses.data);
      }
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load courses";
      setError(errorMessage);
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const createCourse = async () => {
    router.push("/createcourse");
  };

  const logoutHandler = () => {
    AuthService.logout();
    router.push("/login");
  };

  const deleteHandler = async (courseId: string) => {
    try {
      await CourseService.deleteCourseById(courseId);
      await fetchCourses(); // Refetch courses after deletion
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete course";
      setError(errorMessage);
      console.error("Error deleting course:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-12 w-12 animate-spin text-gray-400" />
          <p className="text-gray-600 font-medium">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center p-8 rounded-2xl bg-white shadow-lg max-w-sm">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <div className="text-red-500 font-medium mb-6">{error}</div>
          <Button
            onClick={() => window.location.reload()}
            className="rounded-full px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-all duration-200 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent flex items-center gap-3">
          My Courses
        </h1>
        <div className="flex gap-4">
          <Button
            onClick={createCourse}
            className="rounded-full px-6 py-2 bg-black hover:bg-gray-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Course
          </Button>
          <Button
            onClick={logoutHandler}
            className="rounded-full px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 border border-gray-200 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-6" />
          <div className="text-gray-400 text-lg mb-4">No courses found</div>
          <p className="text-gray-500 mb-6">
            Start learning by enrolling in a course!
          </p>
          <Button
            onClick={createCourse}
            className="rounded-full px-6 py-2 bg-black hover:bg-gray-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <Plus className="h-4 w-4" />
            Create Your First Course
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 relative h-[200px]"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 hover:bg-red-50 hover:text-red-600"
                onClick={() => deleteHandler(course.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Book className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  {course.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6 line-clamp-2 min-h-[2.5rem] overflow-hidden text-ellipsis">
                  {course.description}
                </p>
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/course/${course.id}`)}
                    className="rounded-full px-6 py-2 border-gray-200 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    View Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
