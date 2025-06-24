"use client";

import { motion } from "framer-motion";
import {
  User,
  Mail,
  MapPin,
  Github,
  Linkedin,
  Trophy,
  Code2,
  Briefcase,
  Eye,
  ExternalLink,
  Calendar,
} from "lucide-react";

interface PortfolioViewProps {
  data: any;
  viewCount: number;
}

export default function PortfolioView({ data, viewCount }: PortfolioViewProps) {
  const content = data.generatedContent || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold"
            >
              {data.name}
            </motion.h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {viewCount} views
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {data.name}
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 mb-6">{data.title}</p>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {data.currentRole}
          </p>

          {/* Contact Info */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600">
            <a
              href={`mailto:${data.email}`}
              className="flex items-center gap-2 hover:text-blue-600 transition-colors"
            >
              <Mail className="w-5 h-5" />
              {data.email}
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {data.location}
            </span>
            {data.github && (
              <a
                href={`https://github.com/${data.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <Github className="w-5 h-5" />
                {data.github}
              </a>
            )}
            {data.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </a>
            )}
          </div>
        </motion.div>
      </section>

      {/* Key Achievement */}
      {data.keyAchievement && (
        <section className="bg-blue-50 border-y">
          <div className="container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Key Achievement</h2>
              <p className="text-lg text-gray-700">{data.keyAchievement}</p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experiences && data.experiences.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-blue-600" />
              Professional Experience
            </h2>

            <div className="space-y-8">
              {data.experiences.map((exp: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{exp.role}</h3>
                      <p className="text-lg text-blue-600">{exp.company}</p>
                    </div>
                    <span className="text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {exp.duration}
                    </span>
                  </div>

                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="space-y-2">
                      {exp.achievements
                        .filter((achievement: string) => achievement.trim())
                        .map((achievement: string, achIndex: number) => (
                          <li
                            key={achIndex}
                            className="flex items-start gap-2 text-gray-700"
                          >
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="bg-gray-50">
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Code2 className="w-8 h-8 text-blue-600" />
                Projects
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                {data.projects.map((project: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>

                    <p className="text-gray-700 mb-4">{project.description}</p>

                    {project.impact && (
                      <p className="text-sm font-medium text-blue-600 mb-3">
                        Impact: {project.impact}
                      </p>
                    )}

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech: string, techIndex: number) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Skills */}
      {data.technicalSkills && data.technicalSkills.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8">Technical Skills</h2>
            <div className="flex flex-wrap gap-3">
              {data.technicalSkills.map((skill: string, index: number) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              Built with{" "}
              <a
                href="https://ai-portfolio-builder.vercel.app"
                className="text-blue-600 hover:text-blue-700"
              >
                AI Portfolio Builder
              </a>
            </p>
            <p className="text-sm">
              Create your own professional portfolio in minutes
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}