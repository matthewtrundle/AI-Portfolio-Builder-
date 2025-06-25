"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import HeroImageSection from "./HeroImageSection";
import FeatureImageGrid from "./FeatureImageGrid";
import TransformationShowcase from "./TransformationShowcase";
import AnimatedStats from "./AnimatedStats";
import ScrollProgress from "./ScrollProgress";
import FloatingCTA from "./FloatingCTA";
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

// Custom hook for number animation
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime.current) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      
      if (currentCount !== countRef.current) {
        countRef.current = currentCount;
        setCount(currentCount);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
}

export default function PremiumLandingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { scrollY } = useScroll();
  
  // Parallax transforms
  const heroY = useTransform(scrollY, [0, 1000], [0, -150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Animated counters
  const portfolioCount = useCountUp(12458, 2500);
  const interviewRate = useCountUp(89, 2000);
  const offerCount = useCountUp(2534, 2500);

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

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
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
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-xl opacity-50" />
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
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
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <motion.div 
          className="container mx-auto px-4 relative z-10"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="max-w-5xl mx-auto text-center">
            {/* Live activity badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full px-4 py-2 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm font-medium text-gray-700">
                {recentActivity[0].name} from {recentActivity[0].location} just created a portfolio
              </span>
            </motion.div>

            {/* Main headline with typing effect */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
            >
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Get 3x More
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Interviews
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Your resume gets trapped in ATS filters. Your AI portfolio goes{" "}
              <span className="font-semibold text-gray-900">straight to hiring managers</span>.
            </motion.p>

            {/* CTA buttons with hover effects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link
                href="/app"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Create My Portfolio
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
                <span className="text-gray-600">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="text-gray-600">SOC2 compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-500" />
                <span className="text-gray-600">Setup in 5 minutes</span>
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
      <section className="py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <HeroImageSection />
        </div>
      </section>

      {/* Animated Stats */}
      <AnimatedStats />

      {/* Problem Agitation with Premium Cards */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  The Resume Game is Rigged
                </span>
              </h2>
              <p className="text-xl text-gray-600">
                And you're playing by outdated rules
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Traditional Resume Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                <div className="relative bg-white border border-red-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-red-100 rounded-xl">
                      <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold">Traditional Resume</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { stat: "75%", desc: "Never reach human eyes" },
                      { stat: "6 sec", desc: "Average review time" },
                      { stat: "3%", desc: "Interview rate" },
                      { stat: "Static", desc: "Can't show real work" },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <span className="text-3xl font-bold text-red-600 w-20">
                          {item.stat}
                        </span>
                        <span className="text-gray-700">{item.desc}</span>
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
                <div className="relative bg-white border border-blue-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <CheckCircle className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold">AI Portfolio</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { stat: "100%", desc: "Direct to hiring managers" },
                      { stat: "2.5 min", desc: "Average engagement time" },
                      { stat: "27%", desc: "Interview rate" },
                      { stat: "Dynamic", desc: "Live demos & projects" },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <span className="text-3xl font-bold text-blue-600 w-20">
                          {item.stat}
                        </span>
                        <span className="text-gray-700">{item.desc}</span>
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
              className="mt-16 relative h-96 rounded-2xl overflow-hidden shadow-2xl"
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
                  Stop competing on keywords. Start connecting with humans.
                </p>
                <p className="text-gray-200">
                  Your portfolio tells your story in a way resumes never could.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Bento Grid Style */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  From Zero to Hired in 3 Steps
                </span>
              </h2>
              <p className="text-xl text-gray-600">
                No coding. No design skills. Just results.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  icon: FileText,
                  title: "Share Your Story",
                  description: "Tell us about your experience. Our AI understands context, not just keywords.",
                  gradient: "from-blue-500 to-cyan-500",
                },
                {
                  step: "02",
                  icon: Bot,
                  title: "AI Creates Magic",
                  description: "Watch as AI crafts compelling content that highlights your unique value.",
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  step: "03",
                  icon: Globe,
                  title: "Share & Get Hired",
                  description: "Get your unique link. Add to LinkedIn. Watch interview requests roll in.",
                  gradient: "from-orange-500 to-red-500",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl transform group-hover:scale-105 transition-transform duration-300" />
                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <span className="text-6xl font-bold text-gray-200">
                        {item.step}
                      </span>
                      <div className={`p-3 bg-gradient-to-r ${item.gradient} rounded-xl`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Transformation Showcase */}
      <TransformationShowcase />

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

      {/* Social Proof Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >

            {/* Testimonials Carousel */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 text-center"
                >
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-2xl text-gray-800 mb-8 leading-relaxed max-w-4xl mx-auto">
                    "{testimonials[activeTestimonial].quote}"
                  </p>
                  <div>
                    <p className="font-semibold text-lg">
                      {testimonials[activeTestimonial].name}
                    </p>
                    <p className="text-gray-600">
                      {testimonials[activeTestimonial].role}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Testimonial indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === activeTestimonial
                        ? "w-8 bg-blue-600"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
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
              Ready to Get 3x More Interviews?
            </h2>
            <p className="text-xl mb-8 text-gray-100">
              Stop waiting for ATS algorithms to notice you.
            </p>
            
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              Create My Portfolio Now
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
                <span>Setup in minutes</span>
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

// Sample testimonials data
const testimonials = [
  {
    quote: "I went from 0 responses to 5 interviews in 2 weeks. The portfolio shows what I can actually do, not just keywords. Game changer!",
    name: "Sarah Chen",
    role: "Senior Data Scientist at Meta",
  },
  {
    quote: "After 6 months of applying with no luck, I built my portfolio and got 3 offers within a month. The analytics showed me what worked.",
    name: "Michael Torres",
    role: "ML Engineer at Google",
  },
  {
    quote: "The AI understood my experience better than I could explain it myself. My portfolio got me interviews at companies I thought were out of reach.",
    name: "Jessica Liu",
    role: "Director of Analytics at Stripe",
  },
];