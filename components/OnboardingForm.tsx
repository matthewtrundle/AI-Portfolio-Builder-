"use client";

import { useState, useEffect } from "react";
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
  AlertCircle,
} from "lucide-react";

// Step-specific schemas for validation
const step0Schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().min(2, "Professional title is required"),
  email: z.string().email("Please enter a valid email address"),
  location: z.string().min(2, "Location is required"),
  linkedin: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal("")),
  github: z.string().optional(),
  headshot: z.string().optional(),
});

const step1Schema = z.object({
  currentRole: z.string().min(10, "Please provide at least 10 characters describing your role"),
  yearsExperience: z.string().min(1, "Please select your years of experience"),
  keyAchievement: z.string().min(10, "Please share a key achievement (min 10 characters)"),
});

const step2Schema = z.object({
  experiences: z.array(z.object({
    company: z.string().min(1, "Company name is required"),
    role: z.string().min(1, "Role is required"),
    duration: z.string().min(1, "Duration is required"),
    achievements: z.array(z.string()),
  })).min(1, "Please add at least one experience"),
});

const step3Schema = z.object({
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    impact: z.string(),
    link: z.string().optional(),
  })).optional(),
  technicalSkills: z.array(z.string()).min(3, "Please add at least 3 technical skills"),
});

const step4Schema = z.object({
  targetRoles: z.array(z.string()).min(1, "Please add at least one target role"),
  uniqueValue: z.string().min(20, "Please provide at least 20 characters about what makes you unique"),
});

// Full form schema
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
  const [stepErrors, setStepErrors] = useState<Record<number, string[]>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  
  console.log("OnboardingForm received initialData:", initialData);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    trigger,
    clearErrors,
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    mode: "onChange",
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
    { title: "Basic Information", icon: User, schema: step0Schema },
    { title: "Professional Summary", icon: Briefcase, schema: step1Schema },
    { title: "Experience", icon: Trophy, schema: step2Schema },
    { title: "Projects & Skills", icon: Code2, schema: step3Schema },
    { title: "Target & Goals", icon: Target, schema: step4Schema },
  ];

  // Validate current step
  const validateCurrentStep = async () => {
    const stepFieldMappings: Record<number, string[]> = {
      0: ['name', 'title', 'email', 'location', 'linkedin', 'github', 'headshot'],
      1: ['currentRole', 'yearsExperience', 'keyAchievement'],
      2: ['experiences'],
      3: ['projects', 'technicalSkills'],
      4: ['targetRoles', 'uniqueValue']
    };

    const fieldsToValidate = stepFieldMappings[currentStep];
    const isValid = await trigger(fieldsToValidate as any);
    
    // Get current step errors
    const currentStepErrors: string[] = [];
    fieldsToValidate.forEach(field => {
      if (errors[field as keyof typeof errors]) {
        currentStepErrors.push(field);
      }
    });
    
    setStepErrors(prev => ({ ...prev, [currentStep]: currentStepErrors }));
    return isValid;
  };

  // Check if current step has all required fields filled
  const isStepComplete = () => {
    const values = getValues();
    
    switch (currentStep) {
      case 0:
        return values.name && values.title && values.email && values.location;
      case 1:
        return values.currentRole && values.yearsExperience && values.keyAchievement;
      case 2:
        return values.experiences?.length > 0 && 
               values.experiences.every(exp => exp.company && exp.role && exp.duration);
      case 3:
        return values.technicalSkills?.length >= 3;
      case 4:
        return values.targetRoles?.length > 0 && values.uniqueValue;
      default:
        return false;
    }
  };

  // Mark field as touched
  const markFieldTouched = (fieldName: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldName));
  };

  // Check if field should show error
  const shouldShowError = (fieldName: string) => {
    return touchedFields.has(fieldName) && errors[fieldName as keyof typeof errors];
  };

  // Get all validation errors for final submission
  const getAllValidationErrors = () => {
    const allErrors: { step: number; field: string; message: string }[] = [];
    
    // Step 0 errors
    if (!getValues('name')) allErrors.push({ step: 0, field: 'name', message: 'Full name is required' });
    if (!getValues('title')) allErrors.push({ step: 0, field: 'title', message: 'Professional title is required' });
    if (!getValues('email')) allErrors.push({ step: 0, field: 'email', message: 'Email is required' });
    if (!getValues('location')) allErrors.push({ step: 0, field: 'location', message: 'Location is required' });
    
    // Step 1 errors
    if (!getValues('currentRole') || getValues('currentRole').length < 10) 
      allErrors.push({ step: 1, field: 'currentRole', message: 'Current role description is required (min 10 characters)' });
    if (!getValues('yearsExperience')) 
      allErrors.push({ step: 1, field: 'yearsExperience', message: 'Years of experience is required' });
    if (!getValues('keyAchievement') || getValues('keyAchievement').length < 10) 
      allErrors.push({ step: 1, field: 'keyAchievement', message: 'Key achievement is required (min 10 characters)' });
    
    // Step 2 errors
    const experiences = getValues('experiences') || [];
    if (experiences.length === 0) {
      allErrors.push({ step: 2, field: 'experiences', message: 'At least one experience is required' });
    } else {
      experiences.forEach((exp, index) => {
        if (!exp.company) allErrors.push({ step: 2, field: `experience-${index}`, message: `Company name is required for experience #${index + 1}` });
        if (!exp.role) allErrors.push({ step: 2, field: `experience-${index}`, message: `Role is required for experience #${index + 1}` });
        if (!exp.duration) allErrors.push({ step: 2, field: `experience-${index}`, message: `Duration is required for experience #${index + 1}` });
      });
    }
    
    // Step 3 errors
    const technicalSkills = getValues('technicalSkills') || [];
    if (technicalSkills.length < 3) {
      allErrors.push({ step: 3, field: 'technicalSkills', message: 'At least 3 technical skills are required' });
    }
    
    // Step 4 errors
    const targetRoles = getValues('targetRoles') || [];
    if (targetRoles.length === 0) {
      allErrors.push({ step: 4, field: 'targetRoles', message: 'At least one target role is required' });
    }
    if (!getValues('uniqueValue') || getValues('uniqueValue').length < 20) {
      allErrors.push({ step: 4, field: 'uniqueValue', message: 'Unique value proposition is required (min 20 characters)' });
    }
    
    return allErrors;
  };

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

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < steps.length - 1) {
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register("name")}
                      onBlur={() => markFieldTouched('name')}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                        shouldShowError('name') ? 'border-red-500' : ''
                      }`}
                      placeholder="Matthew Rundle"
                    />
                    {shouldShowError('name') && (
                      <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                    )}
                  </div>
                  {shouldShowError('name') && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register("title")}
                      onBlur={() => markFieldTouched('title')}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                        shouldShowError('title') ? 'border-red-500' : ''
                      }`}
                      placeholder="Data Science & AI Leader"
                    />
                    {shouldShowError('title') && (
                      <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                    )}
                  </div>
                  {shouldShowError('title') && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.title?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register("email")}
                      type="email"
                      onBlur={() => markFieldTouched('email')}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                        shouldShowError('email') ? 'border-red-500' : ''
                      }`}
                      placeholder="your@email.com"
                    />
                    {shouldShowError('email') && (
                      <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                    )}
                  </div>
                  {shouldShowError('email') && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register("location")}
                      onBlur={() => markFieldTouched('location')}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                        shouldShowError('location') ? 'border-red-500' : ''
                      }`}
                      placeholder="Austin, TX"
                    />
                    {shouldShowError('location') && (
                      <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                    )}
                  </div>
                  {shouldShowError('location') && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.location?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    {...register("linkedin")}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub Username
                  </label>
                  <input
                    {...register("github")}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Role & Responsibilities <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    {...register("currentRole")}
                    onBlur={() => markFieldTouched('currentRole')}
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                      shouldShowError('currentRole') ? 'border-red-500' : ''
                    }`}
                    placeholder="Describe your current role, key responsibilities, and the impact you're making..."
                  />
                  {shouldShowError('currentRole') && (
                    <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                  )}
                </div>
                {shouldShowError('currentRole') && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.currentRole?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register("yearsExperience")}
                    onBlur={() => markFieldTouched('yearsExperience')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                      shouldShowError('yearsExperience') ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Select years</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                  {shouldShowError('yearsExperience') && (
                    <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                  )}
                </div>
                {shouldShowError('yearsExperience') && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.yearsExperience?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Achievement <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    {...register("keyAchievement")}
                    onBlur={() => markFieldTouched('keyAchievement')}
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                      shouldShowError('keyAchievement') ? 'border-red-500' : ''
                    }`}
                    placeholder="Share your proudest professional achievement with metrics (e.g., Led $200M transformation, Built system processing 1M+ requests)"
                  />
                  {shouldShowError('keyAchievement') && (
                    <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                  )}
                </div>
                {shouldShowError('keyAchievement') && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.keyAchievement?.message}
                  </p>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          {...register(`experiences.${index}.company`)}
                          onBlur={() => markFieldTouched(`experiences.${index}.company`)}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                            errors.experiences?.[index]?.company ? 'border-red-500' : ''
                          }`}
                          placeholder="Expedia Group"
                        />
                        {errors.experiences?.[index]?.company && (
                          <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          {...register(`experiences.${index}.role`)}
                          onBlur={() => markFieldTouched(`experiences.${index}.role`)}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                            errors.experiences?.[index]?.role ? 'border-red-500' : ''
                          }`}
                          placeholder="Director of Analytics"
                        />
                        {errors.experiences?.[index]?.role && (
                          <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          {...register(`experiences.${index}.duration`)}
                          onBlur={() => markFieldTouched(`experiences.${index}.duration`)}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                            errors.experiences?.[index]?.duration ? 'border-red-500' : ''
                          }`}
                          placeholder="Jan 2020 - Present"
                        />
                        {errors.experiences?.[index]?.duration && (
                          <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Key Achievements
                      </label>
                      {watch(`experiences.${index}.achievements`)?.map((_, achIndex) => (
                        <div key={achIndex} className="flex gap-2 mb-2">
                          <input
                            {...register(`experiences.${index}.achievements.${achIndex}`)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Name
                        </label>
                        <input
                          {...register(`projects.${index}.name`)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                          placeholder="Multi-Agent AI System"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          {...register(`projects.${index}.description`)}
                          rows={3}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                          placeholder="Describe what you built and why"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Technologies Used
                        </label>
                        <input
                          placeholder="Python, TensorFlow, OpenAI, React (comma separated)"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                          onChange={(e) => {
                            setValue(
                              `projects.${index}.technologies`,
                              e.target.value.split(",").map((t) => t.trim())
                            );
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Impact/Results
                        </label>
                        <input
                          {...register(`projects.${index}.impact`)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                          placeholder="e.g., Improved efficiency by 40%, Processed 1M+ requests"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Link (optional)
                        </label>
                        <input
                          {...register(`projects.${index}.link`)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  List your technical skills (one per line) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={6}
                    onBlur={() => markFieldTouched('technicalSkills')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                      shouldShowError('technicalSkills') ? 'border-red-500' : ''
                    }`}
                    placeholder="Python\nMachine Learning\nTensorFlow/PyTorch\nSQL\nData Visualization\nNLP"
                    onChange={(e) => {
                      setValue(
                        "technicalSkills",
                        e.target.value.split("\n").filter((s) => s.trim())
                      );
                    }}
                    defaultValue={watch('technicalSkills')?.join('\n') || ''}
                  />
                  {shouldShowError('technicalSkills') && (
                    <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                  )}
                </div>
                {shouldShowError('technicalSkills') && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.technicalSkills?.message}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What roles are you targeting? (one per line) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    onBlur={() => markFieldTouched('targetRoles')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                      shouldShowError('targetRoles') ? 'border-red-500' : ''
                    }`}
                    placeholder="Senior Data Scientist\nAI/ML Engineering Manager\nDirector of Data Science\nPrincipal ML Engineer"
                    onChange={(e) => {
                      setValue(
                        "targetRoles",
                        e.target.value.split("\n").filter((s) => s.trim())
                      );
                    }}
                    defaultValue={watch('targetRoles')?.join('\n') || ''}
                  />
                  {shouldShowError('targetRoles') && (
                    <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                  )}
                </div>
                {shouldShowError('targetRoles') && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.targetRoles?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What makes you unique? <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    {...register("uniqueValue")}
                    onBlur={() => markFieldTouched('uniqueValue')}
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                      shouldShowError('uniqueValue') ? 'border-red-500' : ''
                    }`}
                    placeholder="Describe your unique combination of skills, experience, and perspective that sets you apart (e.g., 'Blend of deep technical ML expertise with proven business leadership, having built and scaled data teams that delivered $100M+ impact')"
                  />
                  {shouldShowError('uniqueValue') && (
                    <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                  )}
                </div>
                {shouldShowError('uniqueValue') && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.uniqueValue?.message}
                  </p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Ready to Generate!</h4>
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
                disabled={!isStepComplete()}
                className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  isStepComplete()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isGenerating || !isStepComplete()}
                className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  isGenerating || !isStepComplete()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
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

      {/* Validation Summary for Generate Button */}
      {currentStep === steps.length - 1 && !isStepComplete() && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">
                Please complete all required fields before generating
              </p>
              <ul className="text-sm text-red-700 mt-2 space-y-1">
                {!getValues('targetRoles')?.length && (
                  <li>• Add at least one target role</li>
                )}
                {(!getValues('uniqueValue') || getValues('uniqueValue').length < 20) && (
                  <li>• Describe what makes you unique (min 20 characters)</li>
                )}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Full Form Validation Summary (when on last step) */}
      {currentStep === steps.length - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6"
        >
          {(() => {
            const allErrors = getAllValidationErrors();
            const errorsByStep = allErrors.reduce((acc, error) => {
              if (!acc[error.step]) acc[error.step] = [];
              acc[error.step].push(error);
              return acc;
            }, {} as Record<number, typeof allErrors>);

            if (Object.keys(errorsByStep).length > 0) {
              return (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="w-full">
                      <p className="font-medium text-yellow-900 mb-3">
                        Complete all required fields to generate your portfolio
                      </p>
                      {Object.entries(errorsByStep).map(([stepIndex, errors]) => (
                        <div key={stepIndex} className="mb-3">
                          <button
                            onClick={() => setCurrentStep(Number(stepIndex))}
                            className="text-sm font-medium text-yellow-800 hover:text-yellow-900 flex items-center gap-1 mb-1"
                          >
                            {(() => {
                              const Icon = steps[Number(stepIndex)].icon;
                              return <Icon className="w-4 h-4" />;
                            })()}
                            {steps[Number(stepIndex)].title}
                          </button>
                          <ul className="text-sm text-yellow-700 ml-5 space-y-0.5">
                            {errors.map((error, idx) => (
                              <li key={idx}>• {error.message}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </motion.div>
      )}
    </div>
  );
}