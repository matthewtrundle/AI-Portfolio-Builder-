"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  ChevronLeft,
  Copy,
  Check,
  ExternalLink,
  Github,
  Globe,
  Terminal,
  FileCode,
  Sparkles,
} from "lucide-react";

interface DeploymentGuideProps {
  portfolioData: any;
  generatedCode: string;
  onBack: () => void;
}

interface DeploymentStep {
  id: string;
  title: string;
  description: string;
  commands?: string[];
  link?: string;
  action?: string;
  vars?: string[];
  note?: string;
}

export default function DeploymentGuide({
  portfolioData,
  generatedCode,
  onBack,
}: DeploymentGuideProps) {
  const [copiedSteps, setCopiedSteps] = useState<{ [key: string]: boolean }>({});
  const [deploymentMethod, setDeploymentMethod] = useState<"vercel" | "manual">("vercel");

  const copyToClipboard = (text: string, stepId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSteps({ ...copiedSteps, [stepId]: true });
    setTimeout(() => {
      setCopiedSteps({ ...copiedSteps, [stepId]: false });
    }, 2000);
  };

  const deploymentSteps: Record<string, DeploymentStep[]> = {
    vercel: [
      {
        id: "github",
        title: "Push to GitHub",
        description: "First, create a new GitHub repository and push your code",
        commands: [
          "git init",
          "git add .",
          'git commit -m "Initial portfolio commit"',
          "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git",
          "git push -u origin main",
        ],
      },
      {
        id: "vercel-import",
        title: "Import to Vercel",
        description: "Connect your GitHub repo to Vercel for automatic deployments",
        link: "https://vercel.com/new",
        action: "Go to Vercel",
      },
      {
        id: "env",
        title: "Configure Environment Variables",
        description: "Add your OpenRouter API key in Vercel dashboard",
        vars: ["OPENROUTER_API_KEY=your_api_key_here"],
      },
      {
        id: "domain",
        title: "Custom Domain (Optional)",
        description: "Add your custom domain in Vercel settings",
        note: "Your site will be live at your-project.vercel.app immediately",
      },
    ],
    manual: [
      {
        id: "download",
        title: "Download Project Files",
        description: "Get the complete project code",
        action: "Download ZIP",
      },
      {
        id: "install",
        title: "Install Dependencies",
        description: "Navigate to project folder and install packages",
        commands: ["cd ai-portfolio", "npm install"],
      },
      {
        id: "env-local",
        title: "Set Up Environment",
        description: "Create .env.local file with your API key",
        commands: ["cp .env.example .env.local", "# Add your OPENROUTER_API_KEY"],
      },
      {
        id: "dev",
        title: "Run Locally",
        description: "Start the development server",
        commands: ["npm run dev", "# Open http://localhost:3000"],
      },
      {
        id: "build",
        title: "Build for Production",
        description: "Create optimized production build",
        commands: ["npm run build", "npm run start"],
      },
    ],
  };

  const currentSteps = deploymentSteps[deploymentMethod];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Preview
        </button>
        <div className="flex items-center gap-2 text-green-600">
          <Rocket className="w-5 h-5" />
          <span className="font-medium">Ready to Deploy!</span>
        </div>
      </div>

      {/* Deployment Method Selector */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Choose Your Deployment Method</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setDeploymentMethod("vercel")}
            className={`p-6 rounded-lg border-2 transition-all ${
              deploymentMethod === "vercel"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-8 h-8 text-blue-600" />
              <h3 className="text-lg font-semibold">Deploy to Vercel</h3>
            </div>
            <p className="text-gray-600 text-left">
              Recommended: One-click deploy with automatic updates from GitHub
            </p>
          </button>

          <button
            onClick={() => setDeploymentMethod("manual")}
            className={`p-6 rounded-lg border-2 transition-all ${
              deploymentMethod === "manual"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <Terminal className="w-8 h-8 text-gray-700" />
              <h3 className="text-lg font-semibold">Manual Setup</h3>
            </div>
            <p className="text-gray-600 text-left">
              Download and run locally or deploy to your own hosting
            </p>
          </button>
        </div>
      </div>

      {/* Deployment Steps */}
      <div className="space-y-6">
        {currentSteps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold">{index + 1}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>

                {step.commands && (
                  <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                    {step.commands.map((cmd, cmdIndex) => (
                      <div key={cmdIndex} className="flex items-center justify-between">
                        <span className="text-gray-300">{cmd}</span>
                        <button
                          onClick={() => copyToClipboard(cmd, `${step.id}-${cmdIndex}`)}
                          className="ml-4 text-gray-500 hover:text-white"
                        >
                          {copiedSteps[`${step.id}-${cmdIndex}`] ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {step.vars && (
                  <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
                    {step.vars.map((varStr, varIndex) => (
                      <div key={varIndex} className="flex items-center justify-between">
                        <span className="text-gray-700">{varStr}</span>
                        <button
                          onClick={() =>
                            copyToClipboard(varStr, `${step.id}-var-${varIndex}`)
                          }
                          className="ml-4 text-gray-500 hover:text-gray-700"
                        >
                          {copiedSteps[`${step.id}-var-${varIndex}`] ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {step.link && (
                  <a
                    href={step.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {step.action}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {step.action && !step.link && (
                  <button className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {step.action}
                  </button>
                )}

                {step.note && (
                  <p className="mt-3 text-sm text-gray-500 italic">{step.note}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Success Message */}
      <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <Sparkles className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              You're Almost There!
            </h3>
            <p className="text-green-800">
              Once deployed, your portfolio will be live and ready to share with
              potential employers. The AI-powered content we generated is optimized for
              both human readers and search engines.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <a
                href="https://github.com/matthewrundle/ai-portfolio-builder"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-green-700 hover:text-green-900"
              >
                <Github className="w-5 h-5" />
                Star on GitHub
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-green-700 hover:text-green-900"
              >
                <FileCode className="w-5 h-5" />
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}