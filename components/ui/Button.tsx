"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import Link from "next/link";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
}: ButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  };

  const baseClasses = `
    relative inline-flex items-center justify-center gap-2 
    font-semibold rounded-full transition-all duration-300 
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeClasses[size]} ${variantClasses[variant]} ${className}
  `;

  const content = (
    <>
      {/* Hover effect background */}
      {variant === "primary" && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      
      {/* Loading spinner */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
      
      {/* Button content */}
      <span className={`relative z-10 flex items-center gap-2 ${loading ? "opacity-0" : ""}`}>
        {children}
      </span>
    </>
  );

  const MotionComponent = href ? motion(Link) : motion.button;

  return (
    <MotionComponent
      href={href || "#"}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} group`}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {content}
    </MotionComponent>
  );
}