"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  User,
  Mail,
  Sparkles,
  Grid,
  Eye,
  Edit3,
  Trash2,
  ChevronLeft,
  AlertCircle,
  BarChart3,
} from "lucide-react";

interface UserProfile {
  user: {
    email: string;
    name?: string;
    image?: string;
  };
  stats: {
    totalPortfolios: number;
    totalViews: number;
    totalEdits: number;
    totalRemainingEdits: number;
    maxEditsPerPortfolio: number;
  };
  portfolios: Array<{
    id: number;
    slug: string;
    name: string;
    view_count: number;
    edit_count: number;
    remainingEdits: number;
    created_at: string;
    updated_at: string;
  }>;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm(
      "Are you sure you want to delete your account? This will permanently delete all your portfolios and cannot be undone."
    )) {
      return;
    }

    // Double confirmation for safety
    const userEmail = prompt(
      "Please type your email address to confirm account deletion:"
    );
    if (userEmail !== session?.user?.email) {
      alert("Email address does not match. Account deletion cancelled.");
      return;
    }

    setIsDeletingAccount(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Your account has been successfully deleted.");
        router.push("/");
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred while deleting your account.");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load profile</p>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

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
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/profile" className="text-blue-600 font-medium">
                Profile
              </Link>
              <button className="text-gray-600 hover:text-gray-900">
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Dashboard
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  {profile.user.image ? (
                    <img
                      src={profile.user.image}
                      alt={profile.user.name || "User"}
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <User className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {profile.user.name || "Your Profile"}
                  </h2>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {profile.user.email}
                  </p>
                </div>
              </div>

              {/* Account Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Grid className="w-6 h-6 text-purple-600" />
                    <span className="text-xl font-bold">
                      {profile.stats.totalPortfolios}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Total Portfolios</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Eye className="w-6 h-6 text-blue-600" />
                    <span className="text-xl font-bold">
                      {profile.stats.totalViews}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Total Views</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Edit3 className="w-6 h-6 text-green-600" />
                    <span className="text-xl font-bold">
                      {profile.stats.totalEdits}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Total Edits Used</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                    <span className="text-xl font-bold">
                      {profile.stats.totalRemainingEdits}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Edits Remaining</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Portfolio Edit Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h3 className="text-xl font-bold mb-4">Portfolio Edit Summary</h3>
            <div className="bg-white rounded-lg shadow-sm">
              {profile.portfolios.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No portfolios created yet
                </div>
              ) : (
                <div className="divide-y">
                  {profile.portfolios.map((portfolio) => (
                    <div
                      key={portfolio.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{portfolio.name}</h4>
                        <p className="text-sm text-gray-600">
                          Created {new Date(portfolio.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-gray-600">
                          <Eye className="w-4 h-4" />
                          {portfolio.view_count} views
                        </span>
                        <span className={`flex items-center gap-1 ${
                          portfolio.remainingEdits === 0
                            ? "text-red-600"
                            : portfolio.remainingEdits <= 2
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}>
                          <Edit3 className="w-4 h-4" />
                          {portfolio.remainingEdits}/{profile.stats.maxEditsPerPortfolio} edits left
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Link
                          href={`/edit/${portfolio.slug}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h3>
            <p className="text-gray-600 mb-4">
              Once you delete your account, there is no going back. All your
              portfolios and data will be permanently removed.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              {isDeletingAccount ? "Deleting Account..." : "Delete My Account"}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}