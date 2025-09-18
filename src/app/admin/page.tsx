"use client";

import { useState, useEffect } from "react";

interface RSVPResponse {
  firstName: string;
  lastName: string;
  email?: string;
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
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

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

  const exportToCSV = () => {
    if (!stats?.responses) return;

    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Attending",
      "Guest Count",
      "Message",
      "Timestamp",
    ];

    const csvData = stats.responses.map((response) => [
      response.firstName,
      response.lastName,
      response.email || "",
      response.isAttending ? "Yes" : "No",
      response.guestCount.toString(),
      response.message || "",
      new Date(response.timestamp).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        row.map((field) => `"${field.replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `rsvp-responses-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

          {/* View Mode Toggle and Export */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  viewMode === "cards"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                📋 Cards View
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  viewMode === "table"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                📊 Table View
              </button>
            </div>
            <button
              onClick={exportToCSV}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform flex items-center gap-2"
            >
              📥 Export CSV
            </button>
          </div>

          {viewMode === "cards" ? (
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
                      {response.email && (
                        <div className="text-sm text-gray-600 mb-1">
                          📧 {response.email}
                        </div>
                      )}
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
                      {response.email && (
                        <div className="text-sm text-gray-600 mb-1">
                          📧 {response.email}
                        </div>
                      )}
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
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Email
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">
                      Attending
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">
                      Guests
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Message
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.responses.map((response, index) => (
                    <tr
                      key={index}
                      className={`border-b hover:bg-gray-50 ${response.isAttending ? "bg-green-50/30" : "bg-red-50/30"}`}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {response.firstName} {response.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {response.email || (
                          <span className="text-gray-400 italic">
                            Not provided
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            response.isAttending
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {response.isAttending ? "✅ Yes" : "❌ No"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-900">
                        {response.guestCount}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">
                        {response.message ? (
                          <span className="italic">
                            &quot;
                            {response.message.length > 50
                              ? `${response.message.substring(0, 50)}...`
                              : response.message}
                            &quot;
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">
                            No message
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(response.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {stats.responses.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No responses yet
                </div>
              )}
            </div>
          )}

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
