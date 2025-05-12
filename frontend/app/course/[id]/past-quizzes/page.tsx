"use client";
import React, { useState } from "react";
import QuizService from "@/services/quiz.service";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { IQuizzes } from "@/interfaces/IQuiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 10;

const PastQuizzesPage = () => {
  const router = useRouter();
  const params: { id: string } = useParams();
  const { id: courseId } = params;
  
  const [quizzes, setQuizzes] = useState<IQuizzes[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const getQuizzes = async () => {
    try {
      setLoading(true);
      const response = await QuizService.getAllQuiz(courseId);
      console.log(`The quizzes for the current course ${response}`)
      setQuizzes(response || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuizzes();
  }, [courseId]);

  const totalPages = Math.ceil(quizzes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentQuizzes = quizzes.slice(startIndex, endIndex);

  const handleRetakeQuiz = (quizId: string) => {
    router.push(`/course/${courseId}/quiz/${quizId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-10 w-40" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 hover:bg-slate-100 transition-colors group"
          onClick={() => router.push(`/course/${courseId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Course
        </Button>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Past Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            {quizzes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No quizzes taken yet
              </div>
            ) : (
              <div className="space-y-4">
                {currentQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                      {quiz.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Taken on {new Date(quiz.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Highest Score
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {quiz.highScore || 0}%
                        </p>
                      </div>
                      <Button
                        onClick={() => handleRetakeQuiz(quiz.id)}
                        variant="outline"
                        className="rounded-full gap-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Retake Quiz
                      </Button>
                    </div>
                  </div>
                ))}

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PastQuizzesPage;
