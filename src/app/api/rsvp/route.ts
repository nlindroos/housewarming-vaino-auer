import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

interface RSVPSubmission {
  firstName: string;
  lastName: string;
  isAttending: boolean;
  guestCount: number;
  message?: string;
  timestamp: string;
}

interface RSVPRecord extends Record<string, unknown> {
  id: number;
  first_name: string;
  last_name: string;
  is_attending: boolean;
  guest_count: number;
  message: string | null;
  timestamp: string;
  created_at: string;
  updated_at: string;
}

const getDatabaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return process.env.DATABASE_URL_DEV || process.env.DATABASE_URL!;
  }
  return process.env.DATABASE_URL!;
};

const sql = neon(getDatabaseUrl());

function isRSVPRecord(record: Record<string, unknown>): record is RSVPRecord {
  return (
    typeof record.id === "number" &&
    typeof record.first_name === "string" &&
    typeof record.last_name === "string" &&
    typeof record.is_attending === "boolean" &&
    typeof record.guest_count === "number" &&
    (record.message === null || typeof record.message === "string") &&
    typeof record.timestamp === "string" &&
    typeof record.created_at === "string" &&
    typeof record.updated_at === "string"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body: RSVPSubmission = await request.json();

    // Basic validation and sanitization
    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();
    const message = body.message?.trim();

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 },
      );
    }

    if (firstName.length > 50 || lastName.length > 50) {
      return NextResponse.json(
        { error: "First name and last name must be 50 characters or less" },
        { status: 400 },
      );
    }

    // Name format validation (letters including Nordic åäö and Spanish accented characters, spaces, hyphens, apostrophes)
    const namePattern = /^[a-zA-ZåäöÅÄÖáéíóúüñÁÉÍÓÚÜÑ\s\-']+$/;
    if (!namePattern.test(firstName) || !namePattern.test(lastName)) {
      return NextResponse.json(
        {
          error:
            "Names can only contain letters (including accented characters), spaces, hyphens, and apostrophes",
        },
        { status: 400 },
      );
    }

    if (body.guestCount < 1 || body.guestCount > 10) {
      return NextResponse.json(
        { error: "Guest count must be between 1 and 10" },
        { status: 400 },
      );
    }

    // Message length validation
    if (message && message.length > 500) {
      return NextResponse.json(
        { error: "Message must be 500 characters or less" },
        { status: 400 },
      );
    }

    // Check for duplicate submissions (same name combination)
    const duplicateCheck = await sql`
      SELECT COUNT(*) as count
      FROM rsvp_responses
      WHERE LOWER(first_name) = LOWER(${firstName})
      AND LOWER(last_name) = LOWER(${lastName})
    `;

    if (Number(duplicateCheck[0].count) > 0) {
      return NextResponse.json(
        {
          error:
            "An RSVP with this name has already been submitted. Contact us if you need to make changes.",
        },
        { status: 409 },
      );
    }

    // Check if we're at capacity (100 guests max)
    const capacityResult = await sql`
      SELECT COALESCE(SUM(guest_count), 0) as total_guests
      FROM rsvp_responses
      WHERE is_attending = true
    `;

    const currentTotalGuests = Number(capacityResult[0].total_guests);
    const newTotalGuests =
      currentTotalGuests + (body.isAttending ? body.guestCount : 0);

    if (body.isAttending && newTotalGuests > 100) {
      return NextResponse.json(
        { error: "Sorry, we've reached our maximum capacity of 100 guests!" },
        { status: 409 },
      );
    }

    // Insert into database
    const result = await sql`
      INSERT INTO rsvp_responses (first_name, last_name, is_attending, guest_count, message, timestamp)
      VALUES (${firstName}, ${lastName}, ${body.isAttending}, ${
      body.guestCount
    }, ${message || null}, ${new Date().toISOString()})
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      message: "RSVP submitted successfully!",
      totalGuests: newTotalGuests,
      id: result[0].id,
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
    // Get all responses
    const responses = await sql`
      SELECT
        id,
        first_name,
        last_name,
        is_attending,
        guest_count,
        message,
        timestamp,
        created_at
      FROM rsvp_responses
      ORDER BY created_at DESC
    `;

    // Get summary statistics
    const stats = await sql`
      SELECT
        COUNT(*) as total_responses,
        COUNT(*) FILTER (WHERE is_attending = true) as attending_count,
        COALESCE(SUM(guest_count) FILTER (WHERE is_attending = true), 0) as total_guests
      FROM rsvp_responses
    `;

    // Convert database format to API format
    const formattedResponses = responses.filter(isRSVPRecord).map((record) => ({
      firstName: record.first_name,
      lastName: record.last_name,
      isAttending: record.is_attending,
      guestCount: record.guest_count,
      message: record.message,
      timestamp: record.timestamp,
    }));

    return NextResponse.json({
      totalResponses: Number(stats[0].total_responses),
      attendingCount: Number(stats[0].attending_count),
      totalGuests: Number(stats[0].total_guests),
      responses: formattedResponses,
    });
  } catch (error) {
    console.error("Error fetching RSVP data:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSVP data" },
      { status: 500 },
    );
  }
}
