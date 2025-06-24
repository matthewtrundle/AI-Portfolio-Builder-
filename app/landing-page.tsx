"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Eye, 
  Zap, 
  Shield, 
  ChevronRight,
  CheckCircle,
  XCircle,
  BarChart3,
  Globe,
  Smartphone,
  RefreshCw,
  Star,
  ArrowRight,
  Users,
  Building2,
  Quote
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Landing Page Component
export default function LandingPage() {
  const [portfoliosCreated, setPortfoliosCreated] = useState(10847);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  // Simulate live counter
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfoliosCreated(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Simulate recent activity
  useEffect(() => {
    const activities = [
      "Sarah from Microsoft just created a portfolio",
      "David landed an interview at Google",
      "A Data Scientist from Meta joined",
      "Rachel got 5 portfolio views today",
      "An ML Engineer from Apple signed up"
    ];
    
    const interval = setInterval(() => {
      setRecentActivity(prev => {
        const newActivity = activities[Math.floor(Math.random() * activities.length)];
        return [newActivity, ...prev.slice(0, 2)];
      });
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white"
        style={{ opacity: heroOpacity }}
      >
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust Indicator */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">Join {portfoliosCreated.toLocaleString()}+ professionals who've ditched resumes</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Your Resume is Dead.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Long Live Your AI Portfolio.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              In the age of AI screening, stand out with a dynamic portfolio that showcases your real impact—not just keywords.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/app">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2">
                  Build My Portfolio in 5 Minutes
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <button className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all">
                See Examples
              </button>
            </motion.div>

            {/* Live Activity Feed */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 space-y-2"
            >
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={`${activity}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-sm text-gray-400 flex items-center justify-center gap-2"
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  {activity}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full blur-3xl opacity-20" />
      </motion.section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Resume is Broken</h2>
            <p className="text-xl text-gray-600">And everyone knows it.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: XCircle,
                stat: "75%",
                title: "Never Reach Human Eyes",
                description: "ATS filters reject most resumes before anyone reads them"
              },
              {
                icon: Clock,
                stat: "7 sec",
                title: "Scanning Time",
                description: "That's all the time your resume gets from busy hiring managers"
              },
              {
                icon: Eye,
                stat: "0",
                title: "Visibility Into Views",
                description: "No idea who's looking or what interests them"
              }
            ].map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <problem.icon className="w-12 h-12 text-red-500 mb-4" />
                <div className="text-3xl font-bold mb-2">{problem.stat}</div>
                <h3 className="text-lg font-semibold mb-2">{problem.title}</h3>
                <p className="text-gray-600">{problem.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-lg text-gray-700 italic">
              "I sent out 200+ resumes. Got 3 callbacks. Built one portfolio. Got 15 interviews."
            </p>
            <p className="text-sm text-gray-500 mt-2">- Alex Thompson, now Senior Data Scientist at Tesla</p>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome to the Portfolio Revolution
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              While others play keyword bingo, you're showing real impact with interactive demos and measurable results.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                from: "Static PDF",
                to: "Dynamic Experience",
                icon: Zap,
                features: ["Interactive projects", "Live demos", "Real code samples"]
              },
              {
                from: "Keywords",
                to: "Stories",
                icon: TrendingUp,
                features: ["Career narrative", "Context & impact", "Personality shines"]
              },
              {
                from: "Guessing",
                to: "Knowing",
                icon: BarChart3,
                features: ["View analytics", "Engagement metrics", "Follow-up insights"]
              }
            ].map((transform, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 h-full">
                  <div className="text-center mb-4">
                    <div className="text-sm text-gray-500 line-through">{transform.from}</div>
                    <ChevronRight className="w-6 h-6 mx-auto my-2 text-blue-500" />
                    <div className="text-lg font-semibold text-blue-600">{transform.to}</div>
                  </div>
                  <transform.icon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <ul className="space-y-2">
                    {transform.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Three Steps to Your Future
            </h2>
            <p className="text-xl text-gray-600">
              Easier than updating your LinkedIn. More powerful than any resume.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Share Your Story",
                description: "Quick form about your experience, skills, and career goals",
                time: "2 minutes"
              },
              {
                step: "2",
                title: "AI Creates Magic",
                description: "Our AI crafts a compelling narrative and stunning design",
                time: "30 seconds"
              },
              {
                step: "3",
                title: "Share & Track",
                description: "Get your portfolio.ai URL and watch opportunities roll in",
                time: "Instant"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 mb-8"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {step.step}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 mb-1">{step.description}</p>
                  <p className="text-sm text-blue-600 font-medium">{step.time}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/app">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-xl">
                Start Building Now
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Stand Out
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Narrative",
                description: "Transform bullet points into compelling career stories"
              },
              {
                icon: Globe,
                title: "Instant Portfolio URL",
                description: "YourName.ai - memorable and professional"
              },
              {
                icon: Smartphone,
                title: "Mobile-First Design",
                description: "Looks stunning on any device, guaranteed"
              },
              {
                icon: BarChart3,
                title: "Real-Time Analytics",
                description: "See who viewed your portfolio and what caught their eye"
              },
              {
                icon: RefreshCw,
                title: "One-Click Updates",
                description: "Keep your portfolio fresh without starting over"
              },
              {
                icon: Shield,
                title: "Privacy First",
                description: "Control who sees what with granular permissions"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <feature.icon className="w-10 h-10 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Professionals Love Their Portfolios
            </h2>
            <div className="flex justify-center items-center gap-8 mt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">2,500+</div>
                <div className="text-gray-600">Job Offers Secured</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">89%</div>
                <div className="text-gray-600">Interview Rate Increase</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">4.9/5</div>
                <div className="text-gray-600">User Satisfaction</div>
              </div>
            </div>
          </motion.div>

          {/* Testimonials */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto mt-12">
            {[
              {
                name: "Sarah Chen",
                role: "Data Scientist at Meta",
                quote: "I sent 200 resumes with no response. Created my AI portfolio on Monday, had 3 interviews by Friday. This is the future.",
                rating: 5
              },
              {
                name: "Marcus Johnson",
                role: "ML Engineer at Google",
                quote: "The analytics blew my mind. I could see exactly which projects interested recruiters and doubled down on those.",
                rating: 5
              },
              {
                name: "Emily Rodriguez",
                role: "Director at Microsoft",
                quote: "Finally, a way to show my leadership impact beyond boring bullet points. My portfolio tells my real story.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <Quote className="w-8 h-8 text-blue-200 mb-4" />
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-gray-600">{testimonial.role}</div>
              </motion.div>
            ))}
          </div>

          {/* Company Logos */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-gray-600 mb-6">Professionals from these companies trust AI Portfolio Builder</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {["Google", "Meta", "Microsoft", "Amazon", "Apple", "Tesla"].map((company) => (
                <div key={company} className="text-2xl font-bold text-gray-400">
                  {company}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See the Difference
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4"></th>
                  <th className="text-center py-4 px-4">Traditional Resume</th>
                  <th className="text-center py-4 px-4">LinkedIn Profile</th>
                  <th className="text-center py-4 px-4 bg-blue-50 rounded-t-lg">AI Portfolio</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Format", "Static PDF", "Limited template", "Fully customizable"],
                  ["Analytics", "None", "Basic views", "Detailed engagement"],
                  ["Media Support", "Text only", "Some images", "Rich multimedia"],
                  ["Shareability", "Email attachment", "Profile link", "Custom URL"],
                  ["Updates", "Manual recreate", "In-platform only", "AI-powered"],
                  ["ATS Compatibility", "Hit or miss", "Not applicable", "Direct to humans"],
                  ["Mobile Experience", "Poor", "App required", "Responsive design"]
                ].map((row, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b"
                  >
                    <td className="py-4 px-4 font-medium">{row[0]}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-red-500">✗</span> {row[1]}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-yellow-500">~</span> {row[2]}
                    </td>
                    <td className="py-4 px-4 text-center bg-blue-50">
                      <span className="text-green-500">✓</span> <strong>{row[3]}</strong>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free. Upgrade when you're ready.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                features: [
                  "1 AI-powered portfolio",
                  "Basic analytics",
                  "Standard templates",
                  "Public sharing"
                ],
                cta: "Start Free",
                popular: false
              },
              {
                name: "Pro",
                price: "$9",
                period: "month",
                features: [
                  "Unlimited portfolios",
                  "Advanced analytics",
                  "Custom domains",
                  "Priority AI updates",
                  "Remove branding",
                  "Export to PDF"
                ],
                cta: "Go Pro",
                popular: true
              },
              {
                name: "Teams",
                price: "Custom",
                period: "",
                features: [
                  "Everything in Pro",
                  "Team collaboration",
                  "Company branding",
                  "API access",
                  "Dedicated support",
                  "Custom integrations"
                ],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-xl p-8 ${
                  plan.popular ? 'ring-2 ring-blue-500 shadow-xl' : 'shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold">
                    {plan.price}
                    {plan.period && <span className="text-lg text-gray-500">/{plan.period}</span>}
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: "Do companies actually prefer portfolios over resumes?",
                a: "Forward-thinking companies absolutely do. Tech giants and startups are leading the way, with 73% of hiring managers saying they prefer seeing actual work over bullet points."
              },
              {
                q: "What if I'm not technical or in tech?",
                a: "Perfect! Our AI adapts to any profession. Whether you're in marketing, finance, design, or leadership, your portfolio showcases your unique impact and story."
              },
              {
                q: "How is this different from a personal website?",
                a: "AI Portfolio Builder is purpose-built for job seekers with analytics, AI optimization, and instant updates. No coding, no hosting hassles, just results."
              },
              {
                q: "Can I import my LinkedIn data?",
                a: "Yes! One-click LinkedIn import gets you started in seconds. Our AI then enhances your data into a compelling narrative."
              },
              {
                q: "Is my data secure?",
                a: "Absolutely. We use bank-level encryption, never sell your data, and you control exactly what's public or private."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-50 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Leave Resumes in the Past?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands building their future with AI portfolios
            </p>
            
            <div className="flex items-center justify-center gap-2 text-yellow-400 mb-8">
              <Sparkles className="w-5 h-5" />
              <span>50 professionals joined today</span>
            </div>

            <Link href="/app">
              <button className="px-10 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-bold text-xl hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-2xl inline-flex items-center gap-3">
                Start Building - It's Free
                <ArrowRight className="w-6 h-6" />
              </button>
            </Link>

            <p className="mt-6 text-sm text-gray-400">
              Love it in 5 minutes or we'll help you personally. That's our promise.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}