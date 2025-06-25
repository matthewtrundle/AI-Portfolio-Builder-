"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import HeroImageSection from "./HeroImageSection";
import FeatureImageGrid from "./FeatureImageGrid";
import ScrollProgress from "./ScrollProgress";
import FloatingCTA from "./FloatingCTA";
import EvolutionTimeline from "./EvolutionTimeline";
import {
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  ArrowRight,
  Zap,
  Shield,
  Eye,
  FileText,
  Bot,
  Globe,
  Star,
  Clock,
  BarChart3,
  ChevronRight,
  Play,
  Briefcase,
  Award,
  Target,
  ArrowUpRight,
} from "lucide-react";


export default function PremiumLandingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const { scrollY } = useScroll();
  
  // Parallax transforms
  const heroY = useTransform(scrollY, [0, 1000], [0, -150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  

  // Live activity simulation
  const [recentActivity, setRecentActivity] = useState([
    { name: "Sarah C.", location: "San Francisco", time: "2 min ago" },
    { name: "Mike T.", location: "New York", time: "5 min ago" },
    { name: "Jessica L.", location: "Austin", time: "8 min ago" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const names = ["Alex", "Emma", "David", "Lisa", "John", "Maria"];
      const locations = ["Seattle", "Boston", "Chicago", "Denver", "Miami", "Portland"];
      const newActivity = {
        name: `${names[Math.floor(Math.random() * names.length)]} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}.`,
        location: locations[Math.floor(Math.random() * locations.length)],
        time: "just now"
      };
      
      setRecentActivity(prev => [newActivity, ...prev.slice(0, 2)]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Scroll Progress */}
      <ScrollProgress />
      
      {/* Floating CTA */}
      <FloatingCTA />
      
      {/* Noise texture overlay */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none">
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Premium Navigation */}
      <motion.nav 
        className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image 
                src="/images/logo.png" 
                alt="CareerCanvas Logo" 
                width={40} 
                height={40} 
                className="object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                CareerCanvas
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/auth/signin"
                className="text-gray-900 font-medium hover:text-gray-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/app"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Premium Design */}
      <section className="relative min-h-[110vh] flex items-center justify-center pt-20">
        {/* Hero background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/biff01_Soft_focus_background_of_modern_office_space_with_plan_14e31197-aced-43ca-b87a-4f48f219b97d_0.png"
            alt="Modern workspace"
            fill
            className="object-cover opacity-10"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-white/90 to-purple-50/90" />
        </div>
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
        </div>

        <motion.div 
          className="container mx-auto px-4 relative z-10"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left side - Text content */}
            <div className="text-center lg:text-left">
              {/* Main headline with typing effect */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8"
              >
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Your Story Deserves
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  More Than a Resume
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto lg:mx-0 leading-relaxed"
              >
                Welcome to the evolution of professional storytelling. Share your projects,{" "}
                <span className="font-semibold text-gray-900">showcase your journey</span>, and connect authentically.
              </motion.p>

              {/* CTA buttons with hover effects */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-16"
              >
                <Link
                  href="/app"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 inline-block"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Begin Your Story
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </motion.div>

              {/* Trust indicators with animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Free to start your journey</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600">Your story, protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-600">Begin in minutes</span>
                </div>
              </motion.div>
            </div>

            {/* Right side - Modern Resume showcase */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Animated gradient background */}
                <motion.div
                  className="absolute -inset-8 rounded-3xl opacity-60"
                  animate={{
                    background: [
                      "linear-gradient(45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #667eea 100%)",
                      "linear-gradient(45deg, #4facfe 0%, #667eea 25%, #764ba2 50%, #f093fb 75%, #4facfe 100%)",
                      "linear-gradient(45deg, #f093fb 0%, #4facfe 25%, #667eea 50%, #764ba2 75%, #f093fb 100%)",
                      "linear-gradient(45deg, #764ba2 0%, #f093fb 25%, #4facfe 50%, #667eea 75%, #764ba2 100%)",
                      "linear-gradient(45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #667eea 100%)",
                    ],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    filter: "blur(40px)",
                    transform: "scale(1.2)",
                  }}
                />
                
                {/* Modern card with vibrant border */}
                <div className="relative group">
                  {/* Gradient border */}
                  <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Main card */}
                  <div className="relative bg-white rounded-3xl overflow-hidden">
                    {/* Top accent bar */}
                    <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                    
                    {/* Content container */}
                    <div className="p-8">
                      {/* Header with colorful accents */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-20 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full" />
                          <div className="h-6 w-16 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full" />
                        </div>
                      </div>
                      
                      {/* Resume image */}
                      <div className="relative overflow-hidden rounded-2xl shadow-inner">
                        <Image
                          src="/images/Resume.png"
                          alt="Interactive portfolio example"
                          width={600}
                          height={800}
                          className="w-full h-auto transform transition-transform duration-500 group-hover:scale-105"
                          priority
                        />
                        
                        {/* Colorful gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </div>
                      
                      {/* Bottom accent with gradient */}
                      <div className="mt-6 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full" />
                    </div>
                  </div>
                </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronRight className="w-6 h-6 text-gray-400 rotate-90" />
        </motion.div>
      </section>

      {/* Hero Image Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <HeroImageSection />
        </div>
      </section>

      {/* Evolution Timeline */}
      <section className="py-16">
        <EvolutionTimeline />
      </section>
      

      {/* Problem Agitation with Premium Cards */}
      <section className="py-40 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-24">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
                  <span className="bg-gradient-to-r from-red-600 via-gray-900 to-blue-600 bg-clip-text text-transparent">
                    The World Has Changed
                  </span>
                </h2>
              </motion.div>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl text-gray-700 font-light"
              >
                The way we share our professional stories
                <span className="block text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mt-2">
                  hasn't kept up
                </span>
              </motion.p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
              {/* Traditional Resume Card - Enhanced */}
              <motion.div
                initial={{ opacity: 0, x: -50, rotateY: -10 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring" }}
                className="relative group perspective-1000"
              >
                {/* Multiple layered glow effects */}
                <div className="absolute -inset-4 bg-gradient-to-r from-red-300 to-orange-300 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="absolute -inset-2 bg-gradient-to-r from-red-200 to-orange-200 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                
                <div className="relative bg-gradient-to-br from-red-50 via-white to-orange-50 border-2 border-red-200 rounded-3xl p-12 hover:shadow-[0_20px_80px_rgba(239,68,68,0.3)] transition-all duration-500 transform hover:-translate-y-2">
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-red-400 to-orange-400 rotate-45 opacity-10" />
                  </div>
                  
                  {/* Header with custom icon */}
                  <div className="flex items-center gap-4 mb-10">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="relative"
                    >
                      <div className="p-5 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl shadow-lg">
                        <svg className="w-10 h-10 text-red-600" viewBox="0 0 24 24" fill="none">
                          <path d="M9 11H7a1 1 0 100 2h2a1 1 0 100-2zM13 11h-2a1 1 0 100 2h2a1 1 0 100-2zM17 11h-2a1 1 0 100 2h2a1 1 0 100-2z" fill="currentColor"/>
                          <path d="M20 8h-1V6a3 3 0 00-3-3H8a3 3 0 00-3 3v2H4a1 1 0 00-1 1v10a3 3 0 003 3h12a3 3 0 003-3V9a1 1 0 00-1-1zM7 6a1 1 0 011-1h8a1 1 0 011 1v2H7V6zm12 13a1 1 0 01-1 1H6a1 1 0 01-1-1v-9h14v9z" fill="currentColor"/>
                          <circle cx="12" cy="2" r="2" fill="currentColor" opacity="0.3"/>
                          <path d="M2 12L4 14M22 12L20 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <motion.div
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900">Yesterday's Format</h3>
                      <p className="text-sm text-red-600 font-medium mt-1">Stuck in the past</p>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    {[
                      { 
                        label: "Text Only", 
                        desc: "Limited to words on a page",
                        icon: "📄",
                        detail: "No videos, no demos, no personality"
                      },
                      { 
                        label: "Keywords", 
                        desc: "Reduced to searchable terms",
                        icon: "🔍",
                        detail: "Gaming the ATS instead of being authentic"
                      },
                      { 
                        label: "One-way", 
                        desc: "No interaction or engagement",
                        icon: "➡️",
                        detail: "Send and pray, no feedback loop"
                      },
                      { 
                        label: "Past Focus", 
                        desc: "Shows where you've been",
                        icon: "⏮️",
                        detail: "Not what you're capable of"
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 10 }}
                        className="group/item cursor-pointer"
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-3xl group-hover/item:scale-110 transition-transform">{item.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xl font-bold text-red-600">
                                {item.label}
                              </span>
                              <XCircle className="w-5 h-5 text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-gray-700 leading-relaxed">{item.desc}</p>
                            <p className="text-sm text-gray-500 mt-1 italic">{item.detail}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Bottom accent */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-red-400 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* AI Portfolio Card - Enhanced */}
              <motion.div
                initial={{ opacity: 0, x: 50, rotateY: 10 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring" }}
                className="relative group perspective-1000"
              >
                {/* Multiple layered glow effects with animation */}
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                
                <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-transparent bg-clip-padding rounded-3xl p-12 hover:shadow-[0_20px_80px_rgba(59,130,246,0.3)] transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                  {/* Animated gradient border */}
                  <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 -z-10">
                    <div className="h-full w-full rounded-3xl bg-white" />
                  </div>
                  
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                    <motion.div
                      className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rotate-45 opacity-20"
                      animate={{ rotate: [45, 50, 45] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </div>
                  
                  {/* Header with animated icon */}
                  <div className="flex items-center gap-4 mb-10">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="relative"
                    >
                      <div className="p-5 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl shadow-lg">
                        <svg className="w-10 h-10 text-blue-600" viewBox="0 0 24 24" fill="none">
                          <motion.path
                            d="M12 2L2 7L12 12L22 7L12 2Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <motion.path
                            d="M2 17L12 22L22 17"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
                          />
                          <motion.path
                            d="M2 12L12 17L22 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, delay: 1, repeat: Infinity }}
                          />
                        </svg>
                      </div>
                      <motion.div
                        className="absolute -top-1 -right-1"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-6 h-6 text-yellow-500" />
                      </motion.div>
                    </motion.div>
                    <div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Tomorrow's Portfolio</h3>
                      <p className="text-sm text-blue-600 font-medium mt-1">The future is here</p>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    {[
                      { 
                        label: "Rich Media", 
                        desc: "Videos, projects, and stories",
                        icon: "🎬",
                        detail: "Show, don't just tell your story",
                        color: "text-blue-600"
                      },
                      { 
                        label: "Human", 
                        desc: "Personality shines through",
                        icon: "✨",
                        detail: "Be authentic, be memorable",
                        color: "text-purple-600"
                      },
                      { 
                        label: "Interactive", 
                        desc: "Engage with your work",
                        icon: "🚀",
                        detail: "Let them experience your projects",
                        color: "text-pink-600"
                      },
                      { 
                        label: "Future Ready", 
                        desc: "Shows what you can do",
                        icon: "🎯",
                        detail: "Demonstrate your potential",
                        color: "text-indigo-600"
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: -10, scale: 1.02 }}
                        className="group/item cursor-pointer"
                      >
                        <div className="flex items-start gap-4">
                          <motion.span 
                            className="text-3xl group-hover/item:scale-125 transition-transform"
                            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            {item.icon}
                          </motion.span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xl font-bold ${item.color}`}>
                                {item.label}
                              </span>
                              <CheckCircle className="w-5 h-5 text-green-500 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-gray-700 leading-relaxed">{item.desc}</p>
                            <p className="text-sm text-gray-500 mt-1 italic">{item.detail}</p>
                            
                            {/* Progress bar animation on hover */}
                            <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden opacity-0 group-hover/item:opacity-100 transition-opacity">
                              <motion.div
                                className={`h-full bg-gradient-to-r ${item.color === 'text-blue-600' ? 'from-blue-400 to-blue-600' : item.color === 'text-purple-600' ? 'from-purple-400 to-purple-600' : item.color === 'text-pink-600' ? 'from-pink-400 to-pink-600' : 'from-indigo-400 to-indigo-600'}`}
                                initial={{ width: "0%" }}
                                whileInView={{ width: "100%" }}
                                transition={{ duration: 1, delay: 0.2 }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Floating particles */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: `linear-gradient(45deg, #3B82F6, #A855F7, #EC4899)`
                        }}
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0.5, 1, 0.5],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 3,
                          delay: i * 0.3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Visual comparison */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-20 relative h-96 rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/biff01_A_split_composition_showing_a_stressed_job_seeker_on_t_79fcc99d-6a5d-464d-80df-b5fd75648ad2_2.png"
                alt="Before and after portfolio transformation"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-white text-2xl font-bold mb-2">
                  Every career has a story worth telling.
                </p>
                <p className="text-gray-200">
                  Finally, a way to share yours that feels authentic and complete.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Visual Section Divider */}
      <div className="relative py-12">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-gray-400" />
            </motion.div>
          </span>
        </div>
      </div>

      {/* Features with Images */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
              Everything You Need to Stand Out
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Professional tools that transform your experience into compelling stories
            </p>
          </motion.div>
          <FeatureImageGrid />
        </div>
      </section>



      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(120, 119, 198, 0.3), transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%)",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-5xl mx-auto text-center text-white">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                Your Career Story
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Deserves Better
                </span>
              </h2>
            </motion.div>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl mb-12 text-gray-100 max-w-3xl mx-auto leading-relaxed"
            >
              Join thousands of professionals who've transformed their careers with CareerCanvas.
              Your next opportunity is waiting.
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link
                href="/app"
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-900 rounded-full font-bold text-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:-translate-y-1"
              >
                <span className="relative z-10">Create Your Canvas</span>
                <ArrowUpRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              
              <button className="px-8 py-4 text-white border-2 border-white/30 rounded-full font-semibold hover:bg-white/10 transition-all duration-300">
                Watch Demo (2 min)
              </button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-wrap items-center justify-center gap-6 text-sm"
            >
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>Setup in 5 minutes</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Shield className="w-5 h-5 text-purple-400" />
                <span>Bank-level security</span>
              </div>
            </motion.div>
            
            {/* Live activity feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-16 max-w-md mx-auto"
            >
              <p className="text-sm text-gray-300 mb-4">Join professionals getting hired right now:</p>
              <div className="space-y-2">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm">
                      <span className="font-semibold">{activity.name}</span> from {activity.location} just created their portfolio
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

