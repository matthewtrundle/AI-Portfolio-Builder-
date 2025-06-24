"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Code2,
  Download,
  Edit3,
  Rocket,
  ChevronLeft,
  Sparkles,
  Check,
  Copy,
  ExternalLink,
} from "lucide-react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/themes/prism-tomorrow.css";

interface PreviewPortfolioProps {
  data: any;
  generatedCode: string;
  onDeploy: () => void;
  onBack: () => void;
}

export default function PreviewPortfolio({
  data,
  generatedCode,
  onDeploy,
  onBack,
}: PreviewPortfolioProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [isGenerating, setIsGenerating] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const portfolioUrl = data?.url || "";
  const pin = data?.pin || "";

  // Simulate AI generation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isGenerating) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-12 h-12 text-blue-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900">
              AI is generating your portfolio...
            </h2>
            <p className="text-gray-600 text-center max-w-md">
              Our AI is crafting compelling content based on your experience.
              This usually takes 10-30 seconds.
            </p>
            <div className="w-64 bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3 }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Edit
        </button>
        
        {/* Success Message with Link and PIN */}
        {portfolioUrl && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900 mb-3">
                  Your Portfolio is Live!
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Portfolio URL:</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        readOnly
                        value={portfolioUrl}
                        className="flex-1 px-3 py-2 bg-white border rounded-lg text-gray-900"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(portfolioUrl);
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 2000);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                      >
                        {copiedLink ? (
                          <><Check className="w-4 h-4" /> Copied!</>
                        ) : (
                          <><Copy className="w-4 h-4" /> Copy</>  
                        )}
                      </button>
                      <a
                        href={portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Edit PIN:</label>
                    <div className="mt-1">
                      <code className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded font-mono text-lg">
                        {pin}
                      </code>
                      <p className="text-sm text-gray-600 mt-1">
                        Save this PIN! You'll need it to edit or delete your portfolio later.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-6 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === "preview"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-6 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === "code"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              <Code2 className="w-4 h-4" />
              View Code
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "preview" && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Your Portfolio Preview</h3>
                <p className="text-gray-600">
                  This is how your portfolio will look to visitors. You can deploy this
                  directly to Vercel with one click.
                </p>
              </div>

              {/* Mock Portfolio Preview */}
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  src="data:text/html;charset=utf-8,<html><body style='font-family: system-ui; padding: 40px; background: #f8fafc;'><h1 style='color: #1e293b; margin-bottom: 10px;'>" +
                    encodeURIComponent(data.name) +
                    "</h1><p style='color: #64748b; font-size: 20px; margin-bottom: 30px;'>" +
                    encodeURIComponent(data.title) +
                    "</p><div style='background: white; padding: 30px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);'><h2 style='color: #1e293b; margin-bottom: 20px;'>About</h2><p style='color: #475569; line-height: 1.6;'>" +
                    encodeURIComponent(data.currentRole) +
                    "</p><p style='color: #475569; line-height: 1.6; margin-top: 10px;'><strong>Key Achievement:</strong> " +
                    encodeURIComponent(data.keyAchievement) +
                    "</p></div></body></html>"
                  className="w-full h-[600px] bg-white"
                  title="Portfolio Preview"
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    Edit Content
                  </button>
                  <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Code
                  </button>
                </div>
                <button
                  onClick={onDeploy}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium"
                >
                  <Rocket className="w-5 h-5" />
                  Deploy to Vercel
                </button>
              </div>
            </div>
          )}

          {activeTab === "code" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Generated Code</h3>
                  <p className="text-gray-600">
                    This is the complete Next.js application code for your portfolio.
                  </p>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy All
                    </>
                  )}
                </button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Editor
                  value={generatedCode || SAMPLE_CODE}
                  onValueChange={() => {}}
                  highlight={(code) => highlight(code, languages.jsx, "jsx")}
                  padding={20}
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 14,
                    backgroundColor: "#1e1e1e",
                    minHeight: "600px",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const SAMPLE_CODE = `// Generated Portfolio Code
import React from 'react';
import { motion } from 'framer-motion';

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="container mx-auto px-4 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold"
        >
          Your Name
        </motion.h1>
        <p className="text-xl text-gray-600 mt-2">
          Your Professional Title
        </p>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        {/* Your generated content will appear here */}
      </main>
    </div>
  );
}`;