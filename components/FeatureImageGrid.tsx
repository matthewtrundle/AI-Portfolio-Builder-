"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Zap, Shield } from "lucide-react";

const features = [
  {
    title: "AI-Powered Resume Analysis",
    description: "Upload your resume and let AI extract and enhance your achievements",
    icon: Zap,
    image: "/images/biff01_Close-up_of_AI_scanning_and_analyzing_resume_text_tran_600426ad-c79d-4145-ae98-383b4d8860e5_3.png",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Professional Design",
    description: "Clean, modern portfolios that make recruiters take notice",
    icon: CheckCircle,
    image: "/images/biff01_Professional_viewing_their_completed_portfolio_on_a_la_187b8b32-18e1-444e-a95c-ae1382a47d48_0.png",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Ready in Minutes",
    description: "From upload to professional portfolio in under 5 minutes",
    icon: Clock,
    image: "/images/biff01_Over-shoulder_shot_of_hands_typing_on_modern_laptop_cl_14e0c1cb-a26a-4fcf-904e-14d466b466c8_3.png",
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Secure & Private",
    description: "Your data is encrypted and never shared without permission",
    icon: Shield,
    image: "/images/biff01_First-person_perspective_reaching_toward_a_glowing_por_5e07d602-56c8-4dd4-9e38-fb168844b321_2.png",
    color: "from-orange-500 to-red-500"
  }
];

export default function FeatureImageGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="group relative"
        >
          <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={feature.image}
              alt={feature.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hover effect border */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none`} />
        </motion.div>
      ))}
    </div>
  );
}