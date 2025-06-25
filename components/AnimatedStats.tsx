"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, TrendingUp, Clock, Briefcase } from "lucide-react";

function useCountUp(end: number, duration: number = 2000, startCounting: boolean = true) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!startCounting) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Ease out cubic
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOutCubic * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startCounting]);
  
  return count;
}

export default function AnimatedStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const stats = [
    {
      icon: Users,
      value: 12458,
      label: "Active Portfolios",
      suffix: "",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: TrendingUp,
      value: 89,
      label: "Get Interviews",
      suffix: "%",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Briefcase,
      value: 2534,
      label: "Job Offers",
      suffix: "+",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Clock,
      value: 4.9,
      label: "User Rating",
      suffix: "★",
      color: "from-orange-500 to-red-500",
      decimals: 1
    }
  ];
  
  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-gray-600">
            Real results from real professionals
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const value = stat.decimals 
              ? useCountUp(stat.value * 10, 2000, isInView) / 10
              : useCountUp(stat.value, 2000, isInView);
              
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center mb-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  <span className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.decimals ? value.toFixed(1) : value.toLocaleString()}{stat.suffix}
                  </span>
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}