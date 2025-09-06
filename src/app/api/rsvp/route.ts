import { NextRequest, NextResponse } from "next/server";

interface RSVPSubmission {
  firstName: string;
  lastName: string;
  isAttending: boolean;
  guestCount: number;
  message?: string;
  timestamp: string;
}

// In-memory storage for demo purposes
// In production, you'd use a database like PostgreSQL, MongoDB, or Supabase
const rsvpResponses: RSVPSubmission[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: RSVPSubmission = await request.json();

    // Basic validation
    if (!body.firstName || !body.lastName) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 },
      );
    }

    if (body.guestCount < 1 || body.guestCount > 10) {
      return NextResponse.json(
        { error: "Guest count must be between 1 and 10" },
        { status: 400 },
      );
    }

    // Check if we're at capacity (100 guests max)
    const totalGuests =
      rsvpResponses
        .filter((r) => r.isAttending)
        .reduce((sum, r) => sum + r.guestCount, 0) + body.guestCount;

    if (totalGuests > 100) {
      return NextResponse.json(
        { error: "Sorry, we've reached our maximum capacity of 100 guests!" },
        { status: 409 },
      );
    }

    // Add timestamp
    const submission: RSVPSubmission = {
      ...body,
      timestamp: new Date().toISOString(),
    };

    rsvpResponses.push(submission);

    return NextResponse.json({
      success: true,
      message: "RSVP submitted successfully!",
      totalGuests,
    });
  } catch (error) {
    console.error("RSVP submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit RSVP" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const attendingCount = rsvpResponses.filter((r) => r.isAttending).length;
    const totalGuests = rsvpResponses
      .filter((r) => r.isAttending)
      .reduce((sum, r) => sum + r.guestCount, 0);

    return NextResponse.json({
      totalResponses: rsvpResponses.length,
      attendingCount,
      totalGuests,
      responses: rsvpResponses,
    });
  } catch (error) {
    console.error("Error fetching RSVP data:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSVP data" },
      { status: 500 },
    );
  }
}
