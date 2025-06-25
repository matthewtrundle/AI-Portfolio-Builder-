"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users, TrendingUp, Clock, Sparkles } from "lucide-react";

// Animated counter component
export function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;
      
      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return <span>{count.toLocaleString()}{suffix}</span>;
}

// Floating elements for depth
export function FloatingElements() {
  return (
    <>
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full blur-3xl opacity-20"
        animate={{
          y: [0, 30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-20"
        animate={{
          y: [0, -40, 0],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </>
  );
}

// Social proof ticker
export function SocialProofTicker() {
  const activities = [
    { name: "Sarah Chen", location: "San Francisco", time: "2 min ago" },
    { name: "Marcus Johnson", location: "New York", time: "5 min ago" },
    { name: "Emily Rodriguez", location: "Austin", time: "8 min ago" },
    { name: "David Kim", location: "Seattle", time: "12 min ago" },
    { name: "Jessica Patel", location: "Boston", time: "15 min ago" },
  ];

  return (
    <div className="overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 py-4">
      <motion.div
        className="flex gap-8"
        animate={{ x: [0, -1000] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        {[...activities, ...activities].map((activity, i) => (
          <div key={i} className="flex items-center gap-2 whitespace-nowrap px-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-700">
              <strong>{activity.name}</strong> from {activity.location} created a portfolio
            </span>
            <span className="text-xs text-gray-500">{activity.time}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// Interactive feature cards
export function InteractiveFeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  stat 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  stat: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="relative group cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl transition-colors duration-300 ${
            isHovered ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-100'
          }`}>
            <Icon className={`w-6 h-6 transition-colors duration-300 ${
              isHovered ? 'text-white' : 'text-gray-700'
            }`} />
          </div>
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {stat}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
}

// Testimonial carousel with images
export function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonials = [
    {
      quote: "Got 5 interviews in my first week. The portfolio made all the difference.",
      author: "Sarah Chen",
      role: "Senior Developer at Google",
      image: "/images/biff01_Professional_portrait_of_person_in_video_call_receivin_dad9126f-27ae-4d2b-b37c-e2e78931310c_3.png"
    },
    {
      quote: "Went from 0 responses to multiple offers. This is a game changer.",
      author: "Marcus Johnson",
      role: "Product Manager at Meta",
      image: "/images/biff01_Joyful_professional_in_a_video_call_receiving_job_offe_f911db22-ad7b-46e2-bf8b-9dd01758a091_0.png"
    },
    {
      quote: "The AI perfectly captured my achievements. Landed my dream job!",
      author: "Emily Rodriguez",
      role: "Data Scientist at Amazon",
      image: "/images/biff01_Warm_lifestyle_photo_of_professional_woman_reviewing_d_714e293a-fc90-4e3f-b4f2-739e20b1e95f_1.png"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-8 md:p-12">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-2xl text-gray-800 mb-6 leading-relaxed">
                "{testimonials[activeIndex].quote}"
              </p>
              <div>
                <p className="font-semibold text-lg">{testimonials[activeIndex].author}</p>
                <p className="text-gray-600">{testimonials[activeIndex].role}</p>
              </div>
            </div>
            <div className="relative h-64 md:h-full">
              <img
                src={testimonials[activeIndex].image}
                alt={testimonials[activeIndex].author}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20" />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-8 bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Live stats bar
export function LiveStatsBar() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span><AnimatedCounter end={12458} /> Active Portfolios</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span><AnimatedCounter end={89} suffix="%" /> Get Interviews</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span><AnimatedCounter end={5} /> Min Setup</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';