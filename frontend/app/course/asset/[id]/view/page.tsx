"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const ViewPage = () => {
  const params = useParams();
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdfData = async () => {
      try {
        const assetId = params.id as string;
        const courseId = params.courseId as string;
        const response = await fetch(`http://localhost:8000/api/asset/${assetId}/view?courseId=${courseId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch PDF data');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setFilename(`document-${assetId}.pdf`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while loading the PDF');
      }
    };

    fetchPdfData();
  }, [params.id, params.courseId]);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = filename || "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!pdfUrl) return <div className="p-4">Loading...</div>;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center p-4 bg-gray-100">
        <h1 className="text-xl font-semibold">{filename}</h1>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Download PDF
        </button>
      </div>
      <div className="flex-1">
        <object data={pdfUrl} type="application/pdf" className="w-full h-full">
          <p>
            Unable to display PDF file.{" "}
            <a href={pdfUrl} download={filename}>
              Download
            </a>{" "}
            instead.
          </p>
        </object>
      </div>
    </div>
  );
};

export default ViewPage;
