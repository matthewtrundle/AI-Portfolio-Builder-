"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import OnboardingForm from "@/components/OnboardingForm";
import PreviewPortfolio from "@/components/PreviewPortfolio";
import DeploymentGuide from "@/components/DeploymentGuide";
import { Sparkles, Code2, Rocket } from "lucide-react";

export default function AppPage() {
  const [step, setStep] = useState<"onboarding" | "preview" | "deploy">("onboarding");
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [generatedCode, setGeneratedCode] = useState<string>("");

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

        {/* Main Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {step === "onboarding" && (
            <OnboardingForm onSubmit={handleDataSubmit} />
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