"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const testimonialImages = [
  {
    src: "/images/biff01_Professional_portrait_of_person_in_video_call_receivin_dad9126f-27ae-4d2b-b37c-e2e78931310c_3.png",
    alt: "Professional receiving job offer"
  },
  {
    src: "/images/biff01_Joyful_professional_in_a_video_call_receiving_job_offe_f911db22-ad7b-46e2-bf8b-9dd01758a091_0.png",
    alt: "Happy professional in video call"
  },
  {
    src: "/images/biff01_Authentic_moment_of_professional_shaking_hands_with_hi_395770fc-b6f1-4f9c-937c-2bb7f23591df_1.png",
    alt: "Professional handshake moment"
  }
];

export default function TestimonialImages({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="relative h-64 md:h-80 mt-8 mb-12">
      <div className="absolute inset-0 flex items-center justify-center">
        {testimonialImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: index === activeIndex ? 1 : 0,
              scale: index === activeIndex ? 1 : 0.8,
              x: index === activeIndex ? 0 : index < activeIndex ? -100 : 100
            }}
            transition={{ duration: 0.5 }}
            className="absolute w-full max-w-md"
          >
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}