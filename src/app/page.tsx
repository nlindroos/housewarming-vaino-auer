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
    isAttending: true,
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
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-bounce-twice">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {formData.isAttending ? "YAY! You're Coming!" : "Sorry to hear"}
          </h1>
          <p className="text-gray-600 mb-6">
            {formData.isAttending
              ? `Can't wait to see you${
                  formData.guestCount > 1
                    ? ` and your ${formData.guestCount - 1} guest${
                        formData.guestCount > 2 ? "s" : ""
                      }!`
                    : "!"
                }`
              : "We'll miss you, but thanks for letting us know!"}
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
          <div className="text-4xl mb-3">🏠✨</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Housewarming Party!
          </h1>
          <div className="text-gray-600 text-sm space-y-1 mb-4">
            <p className="font-semibold">📍 Väinö Auers gata 15 B 21</p>
            <p className="font-semibold">00560 Helsinki</p>
            <p className="font-semibold">🗓️ Sat November 8 at 15:00 onwards</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
            <p className="text-sm text-blue-800 leading-relaxed">
              <span className="font-semibold">👨‍👩‍👧‍👦 Family-friendly timing:</span>{" "}
              Feel free to arrive early with kids and enjoy the afternoon
              festivities. If you&apos;d like to stay later for the evening
              celebration, you&apos;re welcome to arrange childcare and continue
              the party with us!
            </p>
          </div>
          <p className="text-gray-600 text-base">
            We&apos;d love for you to come celebrate with us!
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
                maxLength={50}
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-500 placeholder:text-sm"
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
                maxLength={50}
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-500 placeholder:text-sm"
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
                className={`flex-1 py-2 px-4 rounded-xl font-medium text-sm transition-all ${
                  formData.isAttending
                    ? "bg-green-500 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-green-100"
                }`}
              >
                YES!
              </button>
              <button
                type="button"
                onClick={() => handleInputChange("isAttending", false)}
                className={`flex-1 py-2 px-4 rounded-xl font-medium text-sm transition-all ${
                  !formData.isAttending
                    ? "bg-red-500 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-red-100"
                }`}
              >
                Sorry, can&apos;t make it
              </button>
            </div>
          </div>

          {formData.isAttending && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                How many people are coming?
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
                  className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full font-semibold text-lg hover:bg-purple-200 transition-colors"
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
                  className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full font-semibold text-lg hover:bg-purple-200 transition-colors"
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
              maxLength={500}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none text-gray-900 placeholder:text-gray-500 placeholder:text-sm"
              rows={3}
              placeholder={
                formData.isAttending
                  ? "Tell us what you're excited about or any dietary restrictions..."
                  : "If there's something you'd like to tell us, this is your chance..."
              }
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.message?.length ?? 0}/500 characters
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold text-base hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending RSVP... 🚀" : "Send RSVP!"}
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
