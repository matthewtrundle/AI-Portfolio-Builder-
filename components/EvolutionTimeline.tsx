"use client";

import { motion } from "framer-motion";
import { FileText, Monitor, Smartphone, Globe, Sparkles } from "lucide-react";

const evolutionSteps = [
  {
    year: "1940s",
    title: "The Paper Resume",
    description: "Typed on typewriters, mailed in envelopes",
    icon: FileText,
    color: "from-gray-400 to-gray-500"
  },
  {
    year: "1990s",
    title: "Digital Documents",
    description: "Email attachments and Word files",
    icon: Monitor,
    color: "from-blue-400 to-blue-500"
  },
  {
    year: "2000s",
    title: "Online Applications",
    description: "Job boards and ATS systems",
    icon: Smartphone,
    color: "from-purple-400 to-purple-500"
  },
  {
    year: "2010s",
    title: "Social Profiles",
    description: "LinkedIn and professional networks",
    icon: Globe,
    color: "from-green-400 to-green-500"
  },
  {
    year: "Today",
    title: "Interactive Portfolios",
    description: "Rich media, projects, and authentic stories",
    icon: Sparkles,
    color: "from-yellow-400 to-orange-500"
  }
];

export default function EvolutionTimeline() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            The Evolution of Professional Storytelling
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From static documents to dynamic experiences. See how we got here.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-gray-300 via-purple-300 to-orange-300" />

          {/* Timeline items */}
          <div className="space-y-12">
            {evolutionSteps.map((step, index) => (
              <motion.div
                key={step.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex items-center gap-8 ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-block"
                  >
                    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md inline-block text-left">
                      <div className="text-sm font-semibold text-gray-500 mb-1">{step.year}</div>
                      <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </motion.div>
                </div>

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10"
                >
                  <div className={`p-4 rounded-full bg-gradient-to-r ${step.color} shadow-xl`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  {index === evolutionSteps.length - 1 && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 blur-xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    />
                  )}
                </motion.div>

                {/* Spacer for opposite side */}
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-2xl text-gray-700 mb-8">
            Don't get left behind in the past. <span className="font-semibold">Join the evolution.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}