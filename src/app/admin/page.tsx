"use client";

import { useState, useEffect } from "react";

interface RSVPResponse {
  firstName: string;
  lastName: string;
  isAttending: boolean;
  guestCount: number;
  message?: string;
  timestamp: string;
}

interface RSVPStats {
  totalResponses: number;
  attendingCount: number;
  totalGuests: number;
  responses: RSVPResponse[];
}

export default function AdminPage() {
  const [stats, setStats] = useState<RSVPStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRSVPData();
  }, []);

  const fetchRSVPData = async () => {
    try {
      const response = await fetch("/api/rsvp");
      if (!response.ok) {
        throw new Error("Failed to fetch RSVP data");
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="text-4xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-gray-800">
            Loading RSVP Data...
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Error Loading Data
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchRSVPData}
            className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h1 className="text-2xl font-bold text-gray-800">
            No Data Available
          </h1>
        </div>
      </div>
    );
  }

  const attendingResponses = stats.responses.filter((r) => r.isAttending);
  const notAttendingResponses = stats.responses.filter((r) => !r.isAttending);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📊</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              RSVP Dashboard
            </h1>
            <p className="text-gray-600">House Warming Party Responses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold">{stats.totalResponses}</div>
              <div className="text-sm opacity-90">Total Responses</div>
            </div>
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold">{stats.attendingCount}</div>
              <div className="text-sm opacity-90">Attending</div>
            </div>
            <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold">{stats.totalGuests}</div>
              <div className="text-sm opacity-90">Total Guests</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                Attending ({attendingResponses.length})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {attendingResponses.map((response, index) => (
                  <div
                    key={index}
                    className="bg-green-50 border border-green-200 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-gray-800">
                        {response.firstName} {response.lastName}
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        {response.guestCount} guest
                        {response.guestCount > 1 ? "s" : ""}
                      </div>
                    </div>
                    {response.message && (
                      <p className="text-sm text-gray-600 italic">
                        &quot;{response.message}&quot;
                      </p>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(response.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
                {attendingResponses.length === 0 && (
                  <div className="text-gray-500 text-center py-8">
                    No attending responses yet
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-red-500 mr-2">❌</span>
                Not Attending ({notAttendingResponses.length})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notAttendingResponses.map((response, index) => (
                  <div
                    key={index}
                    className="bg-red-50 border border-red-200 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-gray-800">
                        {response.firstName} {response.lastName}
                      </div>
                      <div className="text-sm text-red-600 font-medium">
                        Declined
                      </div>
                    </div>
                    {response.message && (
                      <p className="text-sm text-gray-600 italic">
                        &quot;{response.message}&quot;
                      </p>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(response.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
                {notAttendingResponses.length === 0 && (
                  <div className="text-gray-500 text-center py-8">
                    No declined responses yet
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={fetchRSVPData}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
