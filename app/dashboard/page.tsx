"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Eye,
  Edit3,
  Trash2,
  BarChart3,
  Grid,
  List,
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  ExternalLink,
} from "lucide-react";

interface Portfolio {
  id: number;
  slug: string;
  name: string;
  created_at: string;
  view_count: number;
  is_public: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchPortfolios();
    }
  }, [status, router]);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch("/api/user/portfolios");
      if (response.ok) {
        const data = await response.json();
        setPortfolios(data);
      }
    } catch (error) {
      console.error("Failed to fetch portfolios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const totalViews = portfolios.reduce((sum, p) => sum + p.view_count, 0);
  const avgEngagement = portfolios.length > 0 
    ? (totalViews / portfolios.length).toFixed(1) 
    : "0";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold">AI Portfolio Builder</h1>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/dashboard" className="text-blue-600 font-medium">
                Dashboard
              </Link>
              <Link href="/templates" className="text-gray-600 hover:text-gray-900">
                Templates
              </Link>
              <button className="text-gray-600 hover:text-gray-900">
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {session?.user?.name || "there"}!
          </h2>
          <p className="text-gray-600">
            Manage your portfolios and track their performance
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold">{totalViews}</span>
            </div>
            <p className="text-gray-600">Total Views</p>
            <p className="text-sm text-green-600 mt-1">↑ 23% from last month</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Grid className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold">{portfolios.length}</span>
            </div>
            <p className="text-gray-600">Active Portfolios</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold">{avgEngagement}</span>
            </div>
            <p className="text-gray-600">Avg. Views</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-orange-600" />
              <span className="text-2xl font-bold">89%</span>
            </div>
            <p className="text-gray-600">Response Rate</p>
          </div>
        </motion.div>

        {/* Portfolios Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">My Portfolios</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <Link
                href="/app"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Portfolio
              </Link>
            </div>
          </div>

          {portfolios.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">No portfolios yet</h4>
              <p className="text-gray-600 mb-6">
                Create your first AI-powered portfolio in minutes
              </p>
              <Link
                href="/app"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Portfolio
              </Link>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios.map((portfolio) => (
                <motion.div
                  key={portfolio.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-semibold">{portfolio.name}</h4>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        portfolio.is_public
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {portfolio.is_public ? "Public" : "Private"}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{portfolio.view_count} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        Created {new Date(portfolio.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/p/${portfolio.slug}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View
                    </Link>
                    <Link
                      href={`/edit/${portfolio.slug}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </Link>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm">
              {portfolios.map((portfolio, index) => (
                <div
                  key={portfolio.id}
                  className={`flex items-center justify-between p-6 ${
                    index !== portfolios.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-1">{portfolio.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {portfolio.view_count} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(portfolio.created_at).toLocaleDateString()}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          portfolio.is_public
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {portfolio.is_public ? "Public" : "Private"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/p/${portfolio.slug}`}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/edit/${portfolio.slug}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}