"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";

export default function TransformationShowcase() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Your Journey to Success
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch how professionals transform their careers with AI-powered portfolios
          </p>
        </motion.div>

        {/* Transformation timeline */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Before - Stressed */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl mb-6">
                <Image
                  src="/images/biff01_Documentary_style_photo_of_concerned_professional_at_d_e2bb513e-29af-476b-8aaa-f86801c842ab_2.png"
                  alt="Professional struggling with applications"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Before</h3>
              <p className="text-gray-600">Endless applications, zero responses</p>
              <div className="mt-4 inline-flex items-center gap-2 text-red-600">
                <span className="text-3xl font-bold">0%</span>
                <span className="text-sm">Response Rate</span>
              </div>
            </motion.div>

            {/* Arrow */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-30" />
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-6">
                  <ArrowRight className="w-8 h-8 text-white" />
                </div>
              </div>
            </motion.div>

            {/* After - Success */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl mb-6">
                <Image
                  src="/images/biff01_Professional_portrait_of_person_in_video_call_receivin_dad9126f-27ae-4d2b-b37c-e2e78931310c_3.png"
                  alt="Professional celebrating job offer"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <h3 className="text-2xl font-bold mb-2">After PortfolioAI</h3>
              <p className="text-gray-600">Multiple interviews, dream job secured</p>
              <div className="mt-4 inline-flex items-center gap-2 text-green-600">
                <span className="text-3xl font-bold">89%</span>
                <span className="text-sm">Interview Rate</span>
                <TrendingUp className="w-5 h-5" />
              </div>
            </motion.div>
          </div>

          {/* Process visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl" />
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
              <div className="text-center">
                <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                  <Image
                    src="/images/biff01_Overwhelming_pile_of_paper_resumes_falling_into_a_digi_b3435f81-f58d-4f23-a6d9-682a14cfdee7_2.png"
                    alt="Upload resume"
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-semibold text-lg mb-2">1. Upload Resume</h4>
                <p className="text-gray-600 text-sm">Drop your existing resume or paste your experience</p>
              </div>

              <div className="text-center">
                <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                  <Image
                    src="/images/biff01_Time-lapse_style_visualization_of_AI_building_a_portfo_d2c0061c-09ea-4cd5-8d9a-b58e39e48800_0.png"
                    alt="AI processing"
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-semibold text-lg mb-2">2. AI Enhancement</h4>
                <p className="text-gray-600 text-sm">Our AI analyzes and optimizes your content</p>
              </div>

              <div className="text-center">
                <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                  <Image
                    src="/images/biff01_Split_composition_showing_same_person_left_side_tired__ff6dcb76-a2db-48ba-b433-7b24f96efd80_1.png"
                    alt="Success transformation"
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-semibold text-lg mb-2">3. Land Interviews</h4>
                <p className="text-gray-600 text-sm">Share your portfolio and watch opportunities flow</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}