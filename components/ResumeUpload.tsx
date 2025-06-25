"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  Lock,
  Eye,
  ArrowRight,
} from "lucide-react";

interface ResumeUploadProps {
  onDataExtracted: (data: any) => void;
  onSkip: () => void;
}

type ParseStatus = "idle" | "uploading" | "parsing" | "success" | "error" | "partial";

interface ParseProgress {
  stage: string;
  progress: number;
  details?: string;
}

export default function ResumeUpload({ onDataExtracted, onSkip }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [headshot, setHeadshot] = useState<File | null>(null);
  const [headshotPreview, setHeadshotPreview] = useState<string>("");
  const [parseStatus, setParseStatus] = useState<ParseStatus>("idle");
  const [parseProgress, setParseProgress] = useState<ParseProgress>({
    stage: "",
    progress: 0,
  });
  const [extractedData, setExtractedData] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setError("");
      handleFileParse(uploadedFile);
    }
  }, []);

  const onHeadshotDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setHeadshot(uploadedFile);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeadshotPreview(reader.result as string);
      };
      reader.readAsDataURL(uploadedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const {
    getRootProps: getHeadshotRootProps,
    getInputProps: getHeadshotInputProps,
    isDragActive: isHeadshotDragActive,
  } = useDropzone({
    onDrop: onHeadshotDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const handleFileParse = async (file: File) => {
    setParseStatus("uploading");
    setParseProgress({ stage: "Uploading file", progress: 10 });

    const formData = new FormData();
    formData.append("resume", file);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setParseProgress((prev) => {
        if (prev.progress >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return {
          stage: 
            prev.progress < 30 ? "Uploading file" :
            prev.progress < 60 ? "Extracting text" :
            prev.progress < 90 ? "AI parsing content" :
            "Finalizing",
          progress: prev.progress + Math.random() * 15,
        };
      });
    }, 500);

    try {
      setParseStatus("parsing");
      
      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error("Failed to parse resume");
      }

      const data = await response.json();

      if (data.success && data.extractedData) {
        setExtractedData(data.extractedData);
        setParseStatus(data.confidence > 0.8 ? "success" : "partial");
        setParseProgress({ stage: "Complete!", progress: 100 });
        
        // Auto-proceed after showing success
        setTimeout(() => {
          const dataWithHeadshot = {
            ...data.extractedData,
            headshot: headshotPreview,
            headshotFile: headshot
          };
          onDataExtracted(dataWithHeadshot);
        }, 1500);
      } else {
        throw new Error(data.error || "Failed to extract data");
      }
    } catch (error) {
      clearInterval(progressInterval);
      setParseStatus("error");
      setError(error instanceof Error ? error.message : "Failed to parse resume");
      setParseProgress({ stage: "Error", progress: 0 });
    }
  };

  const tryAgain = () => {
    setFile(null);
    setParseStatus("idle");
    setParseProgress({ stage: "", progress: 0 });
    setError("");
    setExtractedData(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {parseStatus === "idle" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-3xl font-bold text-center mb-4">
              Quick Start with Your Resume
            </h2>
            <p className="text-xl text-gray-600 text-center mb-8">
              Upload your resume and let AI extract your information in seconds
            </p>

            <div
              {...getRootProps()}
              className={`
                relative border-2 border-dashed rounded-2xl p-12 text-center
                transition-all duration-300 cursor-pointer
                ${isDragActive 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50"
                }
              `}
            >
              <input {...getInputProps()} />
              
              <div className="space-y-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-10 h-10 text-blue-600" />
                </div>
                
                <div>
                  <p className="text-xl font-semibold text-gray-900 mb-2">
                    {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
                  </p>
                  <p className="text-gray-600">
                    or <span className="text-blue-600 font-medium">browse files</span>
                  </p>
                </div>

                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                  <span>PDF, DOC, DOCX, TXT</span>
                  <span>•</span>
                  <span>Max 10MB</span>
                </div>
              </div>
            </div>

            {/* Headshot Upload Section */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Optional: Add your headshot</h3>
              
              <div className="flex items-start gap-6">
                {/* Headshot Preview */}
                {headshotPreview ? (
                  <div className="relative">
                    <img
                      src={headshotPreview}
                      alt="Headshot preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <button
                      onClick={() => {
                        setHeadshot(null);
                        setHeadshotPreview("");
                      }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div
                    {...getHeadshotRootProps()}
                    className={`
                      w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center
                      transition-all duration-300 cursor-pointer
                      ${isHeadshotDragActive 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/50"
                      }
                    `}
                  >
                    <input {...getHeadshotInputProps()} />
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">
                        {isHeadshotDragActive ? "Drop here" : "Add photo"}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Info text */}
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">
                    Add a professional headshot to personalize your portfolio
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• JPG, PNG, or WebP format</li>
                    <li>• Max 5MB file size</li>
                    <li>• Square images work best</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-8 mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Bank-level encryption</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Lock className="w-4 h-4" />
                <span>Deleted after parsing</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Eye className="w-4 h-4" />
                <span>AI-only processing</span>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={onSkip}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Prefer to start from scratch? →
              </button>
            </div>
          </motion.div>
        )}

        {(parseStatus === "uploading" || parseStatus === "parsing") && (
          <motion.div
            key="parsing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>

            <h3 className="text-2xl font-bold mb-2">
              {parseStatus === "uploading" ? "Uploading your resume..." : "Analyzing with AI..."}
            </h3>
            <p className="text-gray-600 mb-8">
              {parseProgress.stage}
            </p>

            {/* Progress bar */}
            <div className="w-full max-w-md mx-auto mb-8">
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${parseProgress.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {Math.round(parseProgress.progress)}% complete
              </p>
            </div>

            {/* What we're doing */}
            <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
              <h4 className="font-semibold text-blue-900 mb-3">
                What's happening:
              </h4>
              <div className="space-y-2 text-sm text-left">
                <div className="flex items-center gap-2">
                  {parseProgress.progress > 30 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  )}
                  <span className={parseProgress.progress > 30 ? "text-green-700" : "text-gray-700"}>
                    Reading your resume
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {parseProgress.progress > 60 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : parseProgress.progress > 30 ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                  )}
                  <span className={parseProgress.progress > 60 ? "text-green-700" : "text-gray-700"}>
                    Extracting key information
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {parseProgress.progress > 90 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : parseProgress.progress > 60 ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                  )}
                  <span className={parseProgress.progress > 90 ? "text-green-700" : "text-gray-700"}>
                    Optimizing for portfolios
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {parseStatus === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h3 className="text-2xl font-bold mb-2">Resume parsed successfully!</h3>
            <p className="text-gray-600 mb-4">
              We've extracted your information. Taking you to review...
            </p>

            <div className="inline-flex items-center gap-2 text-green-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Redirecting...</span>
            </div>
          </motion.div>
        )}

        {parseStatus === "partial" && (
          <motion.div
            key="partial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-amber-900 mb-2">
                    We extracted what we could!
                  </h3>
                  <p className="text-amber-800 mb-4">
                    Some sections need your review. We'll pre-fill what we found and you can complete the rest.
                  </p>
                  <button
                    onClick={() => {
                      const dataWithHeadshot = {
                        ...extractedData,
                        headshot: headshotPreview,
                        headshotFile: headshot
                      };
                      onDataExtracted(dataWithHeadshot);
                    }}
                    className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2"
                  >
                    Continue to Review
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {parseStatus === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>

            <h3 className="text-2xl font-bold mb-2">Unable to parse resume</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {error || "We couldn't extract information from your resume. This might be due to formatting or file quality."}
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={onSkip}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Fill Manually
              </button>
              <button
                onClick={tryAgain}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Try Another File
              </button>
            </div>

            <details className="mt-8 max-w-md mx-auto text-left">
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                Tips for better results
              </summary>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  Use a PDF created from Word/Google Docs (not scanned)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  Ensure text is selectable in your PDF
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  Use standard resume formatting
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  Keep file size under 10MB
                </li>
              </ul>
            </details>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}