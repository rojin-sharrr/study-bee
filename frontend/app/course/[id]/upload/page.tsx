"use client";
import React, { useState } from 'react';
import { AssetService } from '@/services';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const CreateAsset = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }

    setIsLoading(true);
    try {
      const response = await AssetService.createAnAsset(
        window.location.pathname.split('/')[2], // Get course ID from URL
        file
      );

      if (response.success) {
        toast.success('Asset created successfully!');
        router.push(`/course/${window.location.pathname.split('/')[2]}`);
      } else {
        toast.error(response.message || 'Failed to create asset');
      }
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while creating the asset';
      toast.error(errorMessage);
      console.error('Error creating asset:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6 border border-gray-200">
        <div className="mb-6">
          <button
            onClick={() => router.push(`/course/${window.location.pathname.split('/')[2]}`)}
            className="text-sm flex items-center text-gray-600 hover:text-black"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Course
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black">Upload PDF Asset</h2>
          <p className="mt-2 text-sm text-gray-600">
            Upload a PDF file to create a new asset for this course
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PDF File
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-700 focus-within:outline-none focus-within:ring-offset-2 focus-within:ring"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF up to 10MB</p>
              </div>
            </div>
            {file && (
              <p className="mt-2 text-sm text-gray-500">
                Selected file: {file.name}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !file}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading || !file
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black'
              }`}
            >
              {isLoading ? 'Uploading...' : 'Upload Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAsset;