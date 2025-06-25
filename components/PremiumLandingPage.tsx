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
                alt="PortfolioAI Logo" 
                width={40} 
                height={40} 
                className="object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                PortfolioAI
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
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
      <section className="relative min-h-screen flex items-center justify-center pt-20">
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
          <div className="max-w-5xl mx-auto text-center">
            {/* Removed live activity badge */}

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
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Welcome to the evolution of professional storytelling. Share your projects,{" "}
              <span className="font-semibold text-gray-900">showcase your journey</span>, and connect authentically.
            </motion.p>

            {/* CTA buttons with hover effects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link
                href="/app"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
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
              className="flex flex-wrap items-center justify-center gap-8 text-sm"
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
      <section className="py-8">
        <EvolutionTimeline />
      </section>

      {/* Problem Agitation with Premium Cards */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  The World Has Changed
                </span>
              </h2>
              <p className="text-xl text-gray-600">
                The way we share our professional stories hasn't
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Traditional Resume Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                <div className="relative bg-white border border-red-200 rounded-2xl p-10 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-red-100 rounded-xl">
                      <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Yesterday's Format</h3>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      { label: "Text Only", desc: "Limited to words on a page" },
                      { label: "Keywords", desc: "Reduced to searchable terms" },
                      { label: "One-way", desc: "No interaction or engagement" },
                      { label: "Past Focus", desc: "Shows where you've been" },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col space-y-1"
                      >
                        <span className="text-lg font-semibold text-red-600">
                          {item.label}
                        </span>
                        <span className="text-gray-600 leading-relaxed">{item.desc}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* AI Portfolio Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                <div className="relative bg-white border border-blue-200 rounded-2xl p-10 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-blue-100 rounded-xl">
                      <CheckCircle className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Tomorrow's Portfolio</h3>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      { label: "Rich Media", desc: "Videos, projects, and stories" },
                      { label: "Human", desc: "Personality shines through" },
                      { label: "Interactive", desc: "Engage with your work" },
                      { label: "Future Ready", desc: "Shows what you can do" },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col space-y-1"
                      >
                        <span className="text-lg font-semibold text-blue-600">
                          {item.label}
                        </span>
                        <span className="text-gray-600 leading-relaxed">{item.desc}</span>
                      </motion.div>
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


      {/* Features with Images */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Everything You Need to Get Hired
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional tools that turn your experience into opportunities
            </p>
          </motion.div>
          <FeatureImageGrid />
        </div>
      </section>


      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/biff01_Triptych_composition_showing_three_different_tech_prof_ae7601d9-5877-4f8e-a402-b5ff271578ad_3.png"
            alt="Successful professionals"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-purple-900/95" />
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Share Your Full Story?
            </h2>
            <p className="text-xl mb-8 text-gray-100">
              Join the evolution of professional storytelling.
            </p>
            
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              Start Your Journey
              <ArrowUpRight className="w-5 h-5" />
            </Link>
            
            <div className="mt-8 flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>5-minute setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Your data is secure</span>
              </div>
            </div>
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

