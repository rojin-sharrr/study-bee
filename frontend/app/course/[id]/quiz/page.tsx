"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AssetService, QuizService } from "@/services";
import { IAssetModel } from "@/interfaces/IAsset";
import {
  FileText,
  ArrowLeft,
  Check,
  Loader2,
  CloudLightning,
} from "lucide-react";
import { toast } from "sonner";

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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const QuizPage = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;


  const [loading, setLoading] = useState(true);
  const [allAssets, setAllAssets] = useState<IAssetModel[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [quizName, setQuizName] = useState("");
  const [showNameDialog, setShowNameDialog] = useState(false);

  const toggleAssetSelection = (assetId: string) => {
    setSelectedAssets((prev) =>
      prev.includes(assetId)
        ? prev.filter((id) => id !== assetId)
        : [...prev, assetId]
    );
  };

  const selectAllAssets = () => {
    setSelectedAssets(allAssets.map((asset) => asset.id));
  };

  const deselectAllAssets = () => {
    setSelectedAssets([]);
  };

  const handleCreateQuiz = async () => {
    if (selectedAssets.length === 0) {
      toast.error("Please select at least one asset");
      return;
    }

    setShowNameDialog(true);
  };

  const handleConfirmCreateQuiz = async () => {
    if (!quizName.trim()) {
      toast.error("Please enter a quiz name");
      return;
    }

    setShowNameDialog(false);

    try {
      setLoading(true);
      console.log(`passing courseId from frontend page: ${courseId}`)
      const quizId = await QuizService.createQuizFromAssetIds(selectedAssets, quizName, courseId);
      router.push(`/course/${courseId}/quiz/${quizId}`);
    } catch (error) {
      toast.error("Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAssets = async () => {
    try {
      setLoading(true);
      const response = await AssetService.getAllAssets(courseId);
      if (response.error) {
        toast.error(response.message);
      } else {
        setAllAssets(response.data || []);
      }
    } catch (error) {
      toast.error("Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchAllAssets();
    }
  }, [courseId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {loading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-black" />
              <p className="text-sm text-gray-600">Creating quiz...</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          className="mb-6 hover:bg-slate-100 transition-colors group"
          onClick={() => router.push(`/course/${courseId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Course
        </Button>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Course Assets</CardTitle>
                <CardDescription>
                  Select assets to create a quiz from
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllAssets}
                  className="rounded-full"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deselectAllAssets}
                  className="rounded-full"
                >
                  Deselect All
                </Button>
                <Button
                  onClick={handleCreateQuiz}
                  className="rounded-full px-6 py-2 bg-black hover:bg-gray-800 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
                  disabled={selectedAssets.length === 0}
                >
                  Create Quiz ({selectedAssets.length})
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : allAssets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No assets available for this course.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {allAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                      selectedAssets.includes(asset.id)
                        ? "border-black bg-gray-50"
                        : "border-gray-100 hover:shadow-md"
                    }`}
                    onClick={() => toggleAssetSelection(asset.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                          selectedAssets.includes(asset.id)
                            ? "bg-black"
                            : "bg-gray-100"
                        }`}
                      >
                        {selectedAssets.includes(asset.id) ? (
                          <Check className="h-6 w-6 text-white" />
                        ) : (
                          <FileText className="h-6 w-6 text-gray-600" />
                        )}
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
                    <Badge
                      variant="outline"
                      className={
                        selectedAssets.includes(asset.id) ? "border-black" : ""
                      }
                    >
                      {selectedAssets.includes(asset.id)
                        ? "Selected"
                        : "Click to select"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Name Your Quiz</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter quiz name"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmCreateQuiz}>
              Create Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizPage;
