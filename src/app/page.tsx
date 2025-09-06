"use client";

import { useState } from "react";

interface RSVPForm {
  firstName: string;
  lastName: string;
  isAttending: boolean;
  guestCount: number;
  message?: string;
}

export default function HomePage() {
  const [formData, setFormData] = useState<RSVPForm>({
    firstName: "",
    lastName: "",
    isAttending: false,
    guestCount: 1,
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to submit RSVP");
        return;
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      alert("Failed to submit RSVP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof RSVPForm,
    value: string | boolean | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-bounce">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            YAY! You&apos;re Coming!
          </h1>
          <p className="text-gray-600 mb-6">
            {formData.isAttending
              ? `Can&apos;t wait to see you${
                  formData.guestCount > 1
                    ? ` and your ${formData.guestCount - 1} guest${
                        formData.guestCount > 2 ? "s" : ""
                      }!`
                    : "!"
                }`
              : "We&apos;ll miss you, but thanks for letting us know!"}
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
          >
            RSVP Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏠✨</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            House Warming Party!
          </h1>
          <p className="text-gray-600 text-lg">
            Come celebrate our new digs! 🎊
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-500"
                placeholder="Your first name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-500"
                placeholder="Your last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Are you coming to the party? 🎉
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleInputChange("isAttending", true)}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                  formData.isAttending
                    ? "bg-green-500 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-green-100"
                }`}
              >
                YES! 🎊
              </button>
              <button
                type="button"
                onClick={() => handleInputChange("isAttending", false)}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                  !formData.isAttending
                    ? "bg-red-500 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-red-100"
                }`}
              >
                Sorry, can&apos;t make it 😢
              </button>
            </div>
          </div>

          {formData.isAttending && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                How many people are coming? 👥
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    handleInputChange(
                      "guestCount",
                      Math.max(1, formData.guestCount - 1),
                    )
                  }
                  className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full font-bold text-xl hover:bg-purple-200 transition-colors"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-gray-800 min-w-[3rem] text-center">
                  {formData.guestCount}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleInputChange(
                      "guestCount",
                      Math.min(10, formData.guestCount + 1),
                    )
                  }
                  className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full font-bold text-xl hover:bg-purple-200 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Any message for us? 💌
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none text-gray-900 placeholder:text-gray-500"
              rows={3}
              placeholder="Tell us what you're excited about or any dietary restrictions..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending RSVP... 🚀" : "Send RSVP! 🎉"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            🎈 Maximum 100 guests • 🍕 Food & drinks provided • 🎵 Music & fun
            guaranteed!
          </p>
        </div>
      </div>
    </div>
  );
}
