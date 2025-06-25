"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Trash2, Save, ChevronLeft, Edit3, AlertCircle, CheckCircle } from "lucide-react";

interface EditPageProps {
  params: { slug: string };
}

export default function EditPage({ params }: EditPageProps) {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [remainingEdits, setRemainingEdits] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  const verifyPin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/portfolio/${params.slug}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      if (response.ok) {
        const data = await response.json();
        setPortfolioData(data);
        setRemainingEdits(data.remainingEdits || 0);
        setIsVerified(true);
      } else {
        alert("Invalid PIN. Please try again.");
      }
    } catch (error) {
      alert("Error verifying PIN. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your portfolio? This cannot be undone.")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/portfolio/${params.slug}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      if (response.ok) {
        alert("Portfolio deleted successfully!");
        router.push("/");
      } else {
        alert("Failed to delete portfolio.");
      }
    } catch (error) {
      alert("Error deleting portfolio.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full"
        >
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Enter Your Edit PIN</h1>
            <p className="text-gray-600">
              Please enter the 6-digit PIN you received when creating your portfolio.
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter 6-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={6}
              className="w-full px-4 py-3 border rounded-lg text-center text-xl font-mono focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={verifyPin}
              disabled={pin.length !== 6 || isLoading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify PIN"}
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <ChevronLeft className="w-4 h-4 inline mr-2" />
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Edit Portfolio</h1>
            <button
              onClick={() => router.push(`/p/${params.slug}`)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              View Live Portfolio
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            {/* Edit Count Alert */}
            <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              remainingEdits === 0
                ? "bg-red-50 border border-red-200"
                : remainingEdits <= 2
                ? "bg-orange-50 border border-orange-200"
                : "bg-green-50 border border-green-200"
            }`}>
              {remainingEdits === 0 ? (
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              ) : (
                <Edit3 className="w-5 h-5 text-green-600 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${
                  remainingEdits === 0
                    ? "text-red-900"
                    : remainingEdits <= 2
                    ? "text-orange-900"
                    : "text-green-900"
                }`}>
                  {remainingEdits === 0
                    ? "No edits remaining"
                    : `${remainingEdits} edit${remainingEdits === 1 ? '' : 's'} remaining`}
                </p>
                <p className={`text-sm mt-1 ${
                  remainingEdits === 0
                    ? "text-red-700"
                    : remainingEdits <= 2
                    ? "text-orange-700"
                    : "text-green-700"
                }`}>
                  {remainingEdits === 0
                    ? "You've used all 5 edits for this portfolio. Create a new portfolio to make more changes."
                    : "Each portfolio can be edited up to 5 times. Use your edits wisely!"}
                </p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Portfolio editing interface coming soon. For now, you can delete your portfolio if needed.
            </p>

            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4 text-red-600">Danger Zone</h2>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                {isLoading ? "Deleting..." : "Delete Portfolio"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}