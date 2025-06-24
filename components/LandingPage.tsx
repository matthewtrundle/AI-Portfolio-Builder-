"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
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
} from "lucide-react";

export default function LandingPage() {
  const [activeCount, setActiveCount] = useState(2487);
  const [offerCount, setOfferCount] = useState(831);

  // Simulate live counters
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCount(prev => prev + Math.floor(Math.random() * 3));
      setOfferCount(prev => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto text-center"
          >
            {/* Live Activity Badge */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm mb-8"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {activeCount.toLocaleString()} professionals active today
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Your Resume is Dead.
              <br />
              Long Live Your AI Portfolio.
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              75% of resumes never reach human eyes. Stop playing the ATS lottery. 
              Build an AI-powered portfolio that actually gets you interviews.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/app"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Build Your Portfolio Now
              </Link>
              <button className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2">
                <Eye className="w-5 h-5" />
                See Examples
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>{offerCount} job offers this month</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>4.9/5 satisfaction</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span>SOC2 compliant</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-center mb-12">
              The Brutal Truth About Modern Job Applications
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <XCircle className="w-12 h-12 text-red-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Traditional Resume</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">×</span>
                    75% rejected by ATS before human review
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">×</span>
                    6 seconds average review time
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">×</span>
                    Static PDF can't show your actual work
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">×</span>
                    Keyword stuffing over actual skills
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">AI Portfolio</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Direct link bypasses ATS filters
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Engaging content keeps attention
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Live demos prove your abilities
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    Real projects over buzzwords
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-center mb-4">
              Build Your Portfolio in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12">
              No coding required. AI does the heavy lifting.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: 1,
                  icon: FileText,
                  title: "Input Your Experience",
                  description: "Tell us about your background, skills, and achievements. Our AI understands context, not just keywords.",
                },
                {
                  step: 2,
                  icon: Bot,
                  title: "AI Generates Content",
                  description: "Our AI creates compelling content optimized for human readers, not ATS robots. Every word counts.",
                },
                {
                  step: 3,
                  icon: Globe,
                  title: "Share Your Link",
                  description: "Get an instant shareable URL. Add it to your resume, LinkedIn, or send directly to recruiters.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-center mb-12">
              Everything You Need to Stand Out
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Instant Generation",
                  description: "Create a professional portfolio in under 5 minutes with AI assistance.",
                },
                {
                  icon: BarChart3,
                  title: "Analytics Dashboard",
                  description: "Track views, engagement, and see which sections resonate most.",
                },
                {
                  icon: Shield,
                  title: "Privacy Controls",
                  description: "Control who sees your portfolio with privacy settings and custom domains.",
                },
                {
                  icon: TrendingUp,
                  title: "SEO Optimized",
                  description: "Rank higher in searches with built-in SEO best practices.",
                },
                {
                  icon: Users,
                  title: "Team Collaboration",
                  description: "Create team portfolios for agencies or consultancies.",
                },
                {
                  icon: Clock,
                  title: "Always Current",
                  description: "Update your portfolio anytime. Changes reflect instantly.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-12">
              Join Thousands Who've Ditched the PDF
            </h2>

            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {[
                { number: "12,458", label: "Active Portfolios" },
                { number: "3.2x", label: "More Interviews" },
                { number: "89%", label: "Get Responses" },
                { number: "4.9★", label: "User Rating" },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold text-blue-300 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-blue-800/50 rounded-lg p-8 backdrop-blur">
              <p className="text-xl italic mb-4">
                "I went from 0 responses to 5 interviews in 2 weeks. 
                The portfolio shows what I can actually do, not just keywords."
              </p>
              <p className="text-blue-300">
                — Sarah Chen, Senior Data Scientist at Meta
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-center mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12">
              Start free. Upgrade when you need more.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <div className="border rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4">Free</h3>
                <div className="text-4xl font-bold mb-6">
                  $0
                  <span className="text-lg text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    1 Portfolio
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Basic Analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Public URL
                  </li>
                </ul>
                <Link
                  href="/app"
                  className="block text-center py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
                >
                  Start Free
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="border-2 border-blue-600 rounded-lg p-8 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold mb-4">Pro</h3>
                <div className="text-4xl font-bold mb-6">
                  $19
                  <span className="text-lg text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Unlimited Portfolios
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Advanced Analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Custom Domain
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Priority Support
                  </li>
                </ul>
                <Link
                  href="/app"
                  className="block text-center py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Start Pro Trial
                </Link>
              </div>

              {/* Team Plan */}
              <div className="border rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4">Team</h3>
                <div className="text-4xl font-bold mb-6">
                  $49
                  <span className="text-lg text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Everything in Pro
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    5 Team Members
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Team Analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    White Label Options
                  </li>
                </ul>
                <Link
                  href="/app"
                  className="block text-center py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Leave the Resume Stone Age?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join {activeCount.toLocaleString()} professionals who are getting hired 
              with AI-powered portfolios. No credit card required.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Build Your Portfolio Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="mt-6 text-sm opacity-75">
              🔥 50 professionals joined today
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}