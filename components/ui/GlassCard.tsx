"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  blur?: "sm" | "md" | "lg" | "xl";
}

export default function GlassCard({ 
  children, 
  className = "", 
  hover = true,
  blur = "md" 
}: GlassCardProps) {
  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
  };

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/80 ${blurClasses[blur]}
        border border-white/20
        shadow-xl
        ${className}
      `}
      whileHover={hover ? { 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
      } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}