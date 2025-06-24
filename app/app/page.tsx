"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import OnboardingForm from "@/components/OnboardingForm";
import PreviewPortfolio from "@/components/PreviewPortfolio";
import DeploymentGuide from "@/components/DeploymentGuide";
import ResumeUpload from "@/components/ResumeUpload";
import { Sparkles, Code2, Rocket, Upload, FileText } from "lucide-react";

export default function AppPage() {
  const [step, setStep] = useState<"choice" | "upload" | "onboarding" | "preview" | "deploy">("choice");
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [resumeData, setResumeData] = useState<any>(null);

  const handleDataSubmit = async (data: any) => {
    setPortfolioData(data);
    if (data.generatedCode) {
      setGeneratedCode(data.generatedCode);
    }
    setStep("preview");
  };

  const handleDeploy = () => {
    setStep("deploy");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold">AI Portfolio Builder</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Build your portfolio in minutes
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      {(step !== "choice" && step !== "upload") && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center gap-8">
              <StepIndicator
                icon={Code2}
                label="Input Info"
                active={step === "onboarding"}
                completed={step !== "onboarding"}
              />
              <div className="w-16 h-0.5 bg-gray-300" />
              <StepIndicator
                icon={Sparkles}
                label="AI Generation"
                active={step === "preview"}
                completed={step === "deploy"}
              />
              <div className="w-16 h-0.5 bg-gray-300" />
              <StepIndicator
                icon={Rocket}
                label="Deploy"
                active={step === "deploy"}
                completed={false}
              />
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">

        {/* Main Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {step === "choice" && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">How would you like to start?</h1>
                <p className="text-xl text-gray-600">
                  Choose the method that works best for you
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Resume Upload Option */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep("upload")}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 text-left hover:border-blue-300 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">Quick Start</h3>
                      <p className="text-gray-600 mb-4">
                        Upload your resume and let AI extract your information
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-green-600">
                          <Sparkles className="w-4 h-4" />
                          2 minutes
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">AI-powered</span>
                      </div>
                    </div>
                  </div>
                </motion.button>

                {/* Manual Entry Option */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep("onboarding")}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-8 text-left hover:border-purple-300 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">Custom Build</h3>
                      <p className="text-gray-600 mb-4">
                        Fill out a guided form for maximum customization
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-purple-600">
                          <Code2 className="w-4 h-4" />
                          10 minutes
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">Full control</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              </div>

              <div className="mt-12 text-center">
                <p className="text-sm text-gray-500">
                  Both methods create the same professional AI portfolio
                </p>
              </div>
            </div>
          )}

          {step === "upload" && (
            <ResumeUpload
              onDataExtracted={(data) => {
                setResumeData(data);
                setStep("onboarding");
              }}
              onSkip={() => setStep("onboarding")}
            />
          )}

          {step === "onboarding" && (
            <OnboardingForm 
              onSubmit={handleDataSubmit}
              initialData={resumeData}
            />
          )}
          {step === "preview" && (
            <PreviewPortfolio
              data={portfolioData}
              generatedCode={generatedCode}
              onDeploy={handleDeploy}
              onBack={() => setStep("onboarding")}
            />
          )}
          {step === "deploy" && (
            <DeploymentGuide
              portfolioData={portfolioData}
              generatedCode={generatedCode}
              onBack={() => setStep("preview")}
            />
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>Built with ❤️ by Matthew Rundle</p>
            <p className="mt-1">
              Move beyond traditional resumes with AI-powered portfolios
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function StepIndicator({
  icon: Icon,
  label,
  active,
  completed,
}: {
  icon: any;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          active
            ? "bg-blue-600 text-white"
            : completed
            ? "bg-green-600 text-white"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <span
        className={`text-sm font-medium ${
          active ? "text-blue-600" : completed ? "text-green-600" : "text-gray-600"
        }`}
      >
        {label}
      </span>
    </div>
  );
}