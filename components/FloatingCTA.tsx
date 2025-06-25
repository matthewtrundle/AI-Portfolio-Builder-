"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const threshold = window.innerHeight * 0.5;
      setIsVisible(scrolled > threshold && !isDismissed);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse" />
            
            {/* Main button */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl">
              <Link
                href="/app"
                className="flex items-center gap-3 px-6 py-4 text-white font-semibold group"
              >
                <span className="hidden sm:inline">Create Your Portfolio</span>
                <span className="sm:hidden">Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Dismiss button */}
            <button
              onClick={() => setIsDismissed(true)}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}