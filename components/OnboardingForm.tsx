"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Briefcase,
  Target,
  Trophy,
  Code2,
  Sparkles,
  Plus,
  Trash2,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

// Form schema
const portfolioSchema = z.object({
  // Basic Information
  name: z.string().min(2, "Name is required"),
  title: z.string().min(2, "Professional title is required"),
  email: z.string().email("Valid email required"),
  location: z.string().min(2, "Location is required"),
  linkedin: z.string().url("Valid LinkedIn URL required").optional().or(z.literal("")),
  github: z.string().optional(),
  headshot: z.string().optional(),
  
  // Professional Summary
  currentRole: z.string().min(10, "Please describe your current role"),
  yearsExperience: z.string(),
  keyAchievement: z.string().min(10, "Please share a key achievement"),
  
  // Experience
  experiences: z.array(z.object({
    company: z.string(),
    role: z.string(),
    duration: z.string(),
    achievements: z.array(z.string()),
  })).min(1, "Add at least one experience"),
  
  // Projects
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    impact: z.string(),
    link: z.string().optional(),
  })).optional(),
  
  // Skills
  technicalSkills: z.array(z.string()).min(3, "Add at least 3 technical skills"),
  
  // Target Role
  targetRoles: z.array(z.string()).min(1, "Add at least one target role"),
  uniqueValue: z.string().min(20, "What makes you unique?"),
});

type PortfolioFormData = z.infer<typeof portfolioSchema>;

interface OnboardingFormProps {
  onSubmit: (data: PortfolioFormData & {
    generatedContent?: string;
    generatedCode?: string;
    url?: string;
    pin?: string;
    slug?: string;
  }) => void;
  initialData?: Partial<PortfolioFormData>;
}

export default function OnboardingForm({ onSubmit, initialData }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  
  console.log("OnboardingForm received initialData:", initialData);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      name: initialData?.name || "",
      title: initialData?.title || "",
      email: initialData?.email || "",
      location: initialData?.location || "",
      linkedin: initialData?.linkedin || "",
      github: initialData?.github || "",
      headshot: initialData?.headshot || "",
      currentRole: initialData?.currentRole || "",
      yearsExperience: initialData?.yearsExperience || "",
      keyAchievement: initialData?.keyAchievement || "",
      experiences: initialData?.experiences?.length ? initialData.experiences : [{ company: "", role: "", duration: "", achievements: [""] }],
      projects: initialData?.projects || [],
      technicalSkills: initialData?.technicalSkills || [],
      targetRoles: initialData?.targetRoles || [],
      uniqueValue: initialData?.uniqueValue || "",
    },
  });

  const steps = [
    { title: "Basic Information", icon: User },
    { title: "Professional Summary", icon: Briefcase },
    { title: "Experience", icon: Trophy },
    { title: "Projects & Skills", icon: Code2 },
    { title: "Target & Goals", icon: Target },
  ];

  const onFormSubmit = async (data: PortfolioFormData) => {
    setIsGenerating(true);
    try {
      // Call the AI generation API
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate portfolio");
      }

      const result = await response.json();
      await onSubmit({ 
        ...data, 
        generatedContent: result.content, 
        generatedCode: result.code,
        url: result.url,
        pin: result.pin,
        slug: result.slug
      });
    } catch (error) {
      console.error("Generation error:", error);
      alert("Failed to generate portfolio. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Resume Data Notice */}
      {initialData && Object.keys(initialData).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">
                We've pre-filled information from your resume!
              </p>
              <p className="text-sm text-green-700 mt-1">
                Review each section and add any missing details to create your perfect portfolio.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 ${
                index <= currentStep ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <step.icon className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          {/* Step 1: Basic Information */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Let's start with the basics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    {...register("name")}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Matthew Rundle"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Professional Title *
                  </label>
                  <input
                    {...register("title")}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Data Science & AI Leader"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Location *
                  </label>
                  <input
                    {...register("location")}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Austin, TX"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    {...register("linkedin")}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    GitHub Username
                  </label>
                  <input
                    {...register("github")}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="githubusername"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Professional Summary */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Tell us about your experience</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Role & Responsibilities *
                </label>
                <textarea
                  {...register("currentRole")}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your current role, key responsibilities, and the impact you're making..."
                />
                {errors.currentRole && (
                  <p className="text-red-500 text-sm mt-1">{errors.currentRole.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Years of Experience *
                </label>
                <select
                  {...register("yearsExperience")}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select years</option>
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Key Achievement *
                </label>
                <textarea
                  {...register("keyAchievement")}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your proudest professional achievement with metrics (e.g., Led $200M transformation, Built system processing 1M+ requests)"
                />
                {errors.keyAchievement && (
                  <p className="text-red-500 text-sm mt-1">{errors.keyAchievement.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Experience */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Your Professional Experience</h2>
              
              {watch("experiences")?.map((_, index) => (
                <div key={index} className="border rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">Experience #{index + 1}</h3>
                    {watch("experiences").length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const current = getValues("experiences");
                          setValue("experiences", current.filter((_, i) => i !== index));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Company *
                      </label>
                      <input
                        {...register(`experiences.${index}.company`)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Expedia Group"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Role *
                      </label>
                      <input
                        {...register(`experiences.${index}.role`)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Director of Analytics"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Duration *
                      </label>
                      <input
                        {...register(`experiences.${index}.duration`)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Jan 2020 - Present"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Key Achievements
                      </label>
                      {watch(`experiences.${index}.achievements`)?.map((_, achIndex) => (
                        <div key={achIndex} className="flex gap-2 mb-2">
                          <input
                            {...register(`experiences.${index}.achievements.${achIndex}`)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Describe a key achievement with metrics"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const current = getValues(`experiences.${index}.achievements`);
                              setValue(
                                `experiences.${index}.achievements`,
                                current.filter((_, i) => i !== achIndex)
                              );
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const current = getValues(`experiences.${index}.achievements`) || [];
                          setValue(`experiences.${index}.achievements`, [...current, ""]);
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add Achievement
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const current = getValues("experiences");
                  setValue("experiences", [
                    ...current,
                    { company: "", role: "", duration: "", achievements: [""] },
                  ]);
                }}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
              >
                <Plus className="w-5 h-5" />
                Add Another Experience
              </button>
            </div>
          )}

          {/* Step 4: Projects & Skills */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Projects & Technical Skills</h2>
              
              {/* Projects Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4">AI/Data Science Projects</h3>
                {watch("projects")?.map((_, index) => (
                  <div key={index} className="border rounded-lg p-6 space-y-4 mb-4">
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-medium">Project #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const current = getValues("projects") || [];
                          setValue("projects", current.filter((_, i) => i !== index));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Project Name *
                        </label>
                        <input
                          {...register(`projects.${index}.name`)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Multi-Agent AI System"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Description *
                        </label>
                        <textarea
                          {...register(`projects.${index}.description`)}
                          rows={3}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Describe what you built and why"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Technologies Used
                        </label>
                        <input
                          placeholder="Python, TensorFlow, OpenAI, React (comma separated)"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          onChange={(e) => {
                            setValue(
                              `projects.${index}.technologies`,
                              e.target.value.split(",").map((t) => t.trim())
                            );
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Impact/Results *
                        </label>
                        <input
                          {...register(`projects.${index}.impact`)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Improved efficiency by 40%, Processed 1M+ requests"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Project Link (optional)
                        </label>
                        <input
                          {...register(`projects.${index}.link`)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="https://github.com/username/project"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const current = getValues("projects") || [];
                    setValue("projects", [
                      ...current,
                      {
                        name: "",
                        description: "",
                        technologies: [],
                        impact: "",
                        link: "",
                      },
                    ]);
                  }}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
                >
                  <Plus className="w-5 h-5" />
                  Add Project
                </button>
              </div>

              {/* Technical Skills */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Technical Skills</h3>
                <label className="block text-sm font-medium mb-2">
                  List your technical skills (one per line) *
                </label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Python\nMachine Learning\nTensorFlow/PyTorch\nSQL\nData Visualization\nNLP"
                  onChange={(e) => {
                    setValue(
                      "technicalSkills",
                      e.target.value.split("\n").filter((s) => s.trim())
                    );
                  }}
                />
                {errors.technicalSkills && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.technicalSkills.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Target & Goals */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Your Career Goals</h2>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Target Roles</h3>
                <label className="block text-sm font-medium mb-2">
                  What roles are you targeting? (one per line) *
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Senior Data Scientist\nAI/ML Engineering Manager\nDirector of Data Science\nPrincipal ML Engineer"
                  onChange={(e) => {
                    setValue(
                      "targetRoles",
                      e.target.value.split("\n").filter((s) => s.trim())
                    );
                  }}
                />
                {errors.targetRoles && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.targetRoles.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  What makes you unique? *
                </label>
                <textarea
                  {...register("uniqueValue")}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your unique combination of skills, experience, and perspective that sets you apart (e.g., 'Blend of deep technical ML expertise with proven business leadership, having built and scaled data teams that delivered $100M+ impact')"
                />
                {errors.uniqueValue && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.uniqueValue.message}
                  </p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">🎯 Ready to Generate!</h4>
                <p className="text-blue-800">
                  We'll use AI to create a compelling portfolio based on your information.
                  You'll be able to preview and edit everything before deploying.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              className={`px-6 py-2 rounded-lg ${
                currentStep === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              disabled={currentStep === 0}
            >
              Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isGenerating}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Portfolio
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </form>
    </div>
  );
}