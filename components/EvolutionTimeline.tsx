"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Custom SVG icons for each era
const TypewriterIcon = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full" fill="currentColor">
    <path d="M8 16h48v32H8z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="12" y="20" width="40" height="24" rx="2" fill="currentColor" opacity="0.2"/>
    <rect x="16" y="24" width="4" height="4" rx="1"/>
    <rect x="24" y="24" width="4" height="4" rx="1"/>
    <rect x="32" y="24" width="4" height="4" rx="1"/>
    <rect x="40" y="24" width="4" height="4" rx="1"/>
    <rect x="16" y="32" width="4" height="4" rx="1"/>
    <rect x="24" y="32" width="4" height="4" rx="1"/>
    <rect x="32" y="32" width="4" height="4" rx="1"/>
    <rect x="40" y="32" width="4" height="4" rx="1"/>
    <rect x="20" y="40" width="24" height="2" rx="1"/>
    <path d="M24 48v8M40 48v8" strokeWidth="2"/>
  </svg>
);

const ComputerIcon = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full" fill="currentColor">
    <rect x="8" y="12" width="48" height="32" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="12" y="16" width="40" height="24" fill="currentColor" opacity="0.2"/>
    <path d="M24 48h16M28 48v4h8v-4" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="32" cy="50" r="1"/>
    <path d="M18 24h12M18 28h20M18 32h16" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
  </svg>
);

const CloudIcon = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full" fill="currentColor">
    <path d="M45 28c0-7.18-5.82-13-13-13s-13 5.82-13 13c0 .34.02.67.04 1C14.58 30.24 11 34.64 11 40c0 6.63 5.37 12 12 12h24c5.52 0 10-4.48 10-10 0-5.28-4.11-9.61-9.3-9.97A13.04 13.04 0 0045 28z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2"/>
    <path d="M24 36v8M32 32v12M40 36v8" stroke="currentColor" strokeWidth="2"/>
    <path d="M20 44h8M28 44h8M36 44h8" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const NetworkIcon = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full" fill="currentColor">
    <circle cx="32" cy="20" r="6" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2"/>
    <circle cx="16" cy="32" r="6" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2"/>
    <circle cx="48" cy="32" r="6" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2"/>
    <circle cx="24" cy="44" r="6" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2"/>
    <circle cx="40" cy="44" r="6" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2"/>
    <path d="M28 24l-8 4M36 24l8 4M32 26v12M28 40l-4-4M36 40l4-4" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const PortfolioIcon = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full" fill="currentColor">
    <rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="12" y="16" width="40" height="32" fill="currentColor" opacity="0.1"/>
    <rect x="16" y="20" width="16" height="12" rx="2" fill="currentColor" opacity="0.3"/>
    <rect x="36" y="20" width="12" height="12" rx="2" fill="currentColor" opacity="0.3"/>
    <path d="M16 36h32M16 40h24M16 44h28" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
    <path d="M32 8l4 4M32 8l-4 4" stroke="currentColor" strokeWidth="2"/>
    <circle cx="24" cy="26" r="2" fill="currentColor"/>
    <path d="M40 24l2 2 4-4" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const evolutionSteps = [
  {
    year: "1940s",
    title: "The Paper Resume",
    description: "Typed on typewriters, mailed in envelopes",
    icon: TypewriterIcon,
    color: "from-gray-400 to-gray-600",
    bgColor: "bg-gray-50",
    image: "/images/typewriter-era.jpg",
    details: "One page, black ink, professional formatting"
  },
  {
    year: "1990s",
    title: "Digital Documents",
    description: "Email attachments and Word files",
    icon: ComputerIcon,
    color: "from-blue-400 to-blue-600",
    bgColor: "bg-blue-50",
    image: "/images/computer-era.jpg",
    details: "PDF formats, keyword optimization begins"
  },
  {
    year: "2000s",
    title: "Online Applications",
    description: "Job boards and ATS systems",
    icon: CloudIcon,
    color: "from-purple-400 to-purple-600",
    bgColor: "bg-purple-50",
    image: "/images/online-era.jpg",
    details: "Mass applications, automated screening"
  },
  {
    year: "2010s",
    title: "Social Profiles",
    description: "LinkedIn and professional networks",
    icon: NetworkIcon,
    color: "from-green-400 to-green-600",
    bgColor: "bg-green-50",
    image: "/images/social-era.jpg",
    details: "Personal branding, network effects"
  },
  {
    year: "Today",
    title: "Interactive Portfolios",
    description: "Rich media, projects, and authentic stories",
    icon: PortfolioIcon,
    color: "from-orange-400 to-pink-500",
    bgColor: "bg-gradient-to-br from-orange-50 to-pink-50",
    image: "/images/portfolio-era.jpg",
    details: "AI-powered, multimedia, personality-driven"
  }
];

export default function EvolutionTimeline() {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block"
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                The Evolution of
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Professional Storytelling
              </span>
            </h2>
          </motion.div>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            From static documents to dynamic experiences. Watch how the job search has transformed over the decades.
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Animated timeline line */}
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
          >
            <div className="w-full h-full bg-gradient-to-b from-gray-300 via-purple-400 to-orange-400" />
          </motion.div>

          {/* Timeline items */}
          <div className="space-y-24">
            {evolutionSteps.map((step, index) => (
              <motion.div
                key={step.year}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex items-center gap-8 ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Content Card */}
                <div className={`flex-1 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="inline-block w-full max-w-lg"
                  >
                    <div className={`${step.bgColor} rounded-3xl shadow-xl overflow-hidden group cursor-pointer`}>
                      <div className="relative h-48 bg-gradient-to-br from-white/50 to-transparent">
                        {/* Background image container - ready for future use */}
                        <div className="absolute inset-0">
                          {step.image && (
                            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                              {/* Image placeholder - uncomment when images are added
                              <Image
                                src={step.image}
                                alt={`${step.title} era`}
                                fill
                                className="object-cover"
                              />
                              */}
                            </div>
                          )}
                        </div>
                        
                        {/* Decorative background pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-gradient-to-r from-gray-400 to-transparent blur-2xl" />
                          <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-transparent blur-2xl" />
                        </div>
                        
                        {/* Era visualization */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            className="w-32 h-32 text-gray-700 opacity-20"
                            whileHover={{ scale: 1.1, opacity: 0.3 }}
                            transition={{ duration: 0.3 }}
                          >
                            <step.icon />
                          </motion.div>
                        </div>
                        
                        {/* Year badge */}
                        <div className="absolute top-6 left-6 z-10">
                          <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${step.color} text-white font-bold text-sm shadow-lg`}>
                            {step.year}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-8">
                        <h3 className="text-3xl font-bold mb-3 text-gray-900">{step.title}</h3>
                        <p className="text-lg text-gray-700 mb-3">{step.description}</p>
                        <p className="text-sm text-gray-600 italic">{step.details}</p>
                        
                        {/* Progress indicator */}
                        <div className="mt-6 flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${step.color}`}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${(index + 1) * 20}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{(index + 1) * 20}%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Central Icon */}
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="relative z-20"
                >
                  <div className={`relative p-6 rounded-full bg-gradient-to-r ${step.color} shadow-2xl`}>
                    <div className="w-12 h-12 text-white">
                      <step.icon />
                    </div>
                    
                    {/* Animated rings */}
                    <motion.div
                      className={`absolute inset-0 rounded-full border-4 border-white/20`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {index === evolutionSteps.length - 1 && (
                      <>
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 blur-2xl"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.6, 0.3]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity
                          }}
                        />
                        <motion.div
                          className="absolute -inset-2 rounded-full"
                          style={{
                            background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.5), transparent)",
                            backgroundSize: "200% 200%"
                          }}
                          animate={{
                            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity
                          }}
                        />
                      </>
                    )}
                  </div>
                </motion.div>

                {/* Spacer for opposite side */}
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interactive CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-24"
        >
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-3xl p-8 shadow-xl max-w-2xl mx-auto">
              <p className="text-3xl text-gray-800 mb-4 font-bold">
                Don't get left behind in the past.
              </p>
              <p className="text-xl text-gray-600 mb-8">
                <span className="font-semibold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  Join the evolution
                </span>{" "}
                and tell your story the way it deserves to be told.
              </p>
              
              {/* Progress visualization */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {evolutionSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${step.color}`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))}
              </div>
              
              <motion.div className="text-sm text-gray-500">
                Join <span className="font-semibold text-gray-700">10,000+</span> professionals who've already made the leap
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}