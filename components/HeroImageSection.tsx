"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroImageSection() {
  return (
    <div className="relative w-full max-w-6xl mx-auto mt-16">
      {/* Main hero image grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Professional working */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/biff01_Professional_photography_of_confident_mid-30s_professi_588eaf31-dfba-4548-953a-7e7ca0dfec09_3.png"
              alt="Confident professional"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="font-semibold text-lg">Stand Out</p>
              <p className="text-sm opacity-90">Professional portfolios that get noticed</p>
            </div>
          </div>
        </motion.div>

        {/* Center column - Success moment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative md:mt-12"
        >
          <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/biff01_Joyful_professional_in_a_video_call_receiving_job_offe_f911db22-ad7b-46e2-bf8b-9dd01758a091_0.png"
              alt="Professional receiving job offer"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="font-semibold text-lg">Get Hired</p>
              <p className="text-sm opacity-90">Join thousands landing dream jobs</p>
            </div>
          </div>
        </motion.div>

        {/* Right column - Working professional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="relative"
        >
          <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/biff01_Warm_lifestyle_photo_of_professional_woman_reviewing_d_714e293a-fc90-4e3f-b4f2-739e20b1e95f_1.png"
              alt="Professional reviewing portfolio"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="font-semibold text-lg">Build Fast</p>
              <p className="text-sm opacity-90">AI-powered portfolio in minutes</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating accent images */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute -top-8 -right-8 w-32 h-32 rounded-xl overflow-hidden shadow-xl hidden lg:block"
      >
        <Image
          src="/images/biff01_Clean_minimal_desk_setup_from_above_organized_workspac_9a1d9e6a-6294-40e0-9992-e1803128ca90_1.png"
          alt="Clean workspace"
          fill
          className="object-cover"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute -bottom-8 -left-8 w-40 h-40 rounded-xl overflow-hidden shadow-xl hidden lg:block"
      >
        <Image
          src="/images/biff01_Authentic_moment_of_professional_shaking_hands_with_hi_395770fc-b6f1-4f9c-937c-2bb7f23591df_1.png"
          alt="Professional handshake"
          fill
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}