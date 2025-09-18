import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";

interface RSVPSubmission {
  firstName: string;
  lastName: string;
  email?: string;
  isAttending: boolean;
  guestCount: number;
  message?: string;
  timestamp: string;
  language?: string;
}

interface RSVPRecord extends Record<string, unknown> {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
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

const resend = new Resend(process.env.RESEND_API_KEY);

// Email templates
const emailTemplates = {
  sv: {
    attending: {
      subject: "RSVP bekräftelse - inflyttningsfest 8 november! 🎉",
      html: (name: string, guestCount: number, message?: string) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🏠 Inflyttningsfest! 🎉</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937;">Hej ${name}!</h2>
            <p style="color: #374151; line-height: 1.6;">Tack för din RSVP! Vi ser fram emot att träffa dig på vår inflyttningsfest.</p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ec4899;">
              <h3 style="margin-top: 0; color: #1f2937;">📅 Detaljer</h3>
              <p style="margin: 5px 0; color: #374151;"><strong>Datum:</strong> Lördag 8 november 2025</p>
              <p style="margin: 5px 0; color: #374151;"><strong>Tid:</strong> 15:00 framåt</p>
              <p style="margin: 5px 0; color: #374151;"><strong>Plats:</strong> Väinö Auers gata 15 B 21, 00560 Helsingfors</p>
              <p style="margin: 5px 0; color: #374151;"><strong>Gäster:</strong> ${guestCount} ${
                guestCount > 1 ? "personer" : "person"
              }</p>
            </div>

            <p style="color: #374151; line-height: 1.6;">Vi bjuder på snacks och dryck, men törstiga gäster uppmuntras att ta med egna drycker. Stanna länge eller kom bara förbi enligt dina egna planer!</p>

            ${
              message
                ? `
            <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <h4 style="margin: 0 0 8px 0; color: #0c4a6e; font-size: 14px; font-weight: 600;">Ditt meddelande:</h4>
              <p style="margin: 0; color: #0c4a6e; font-style: italic; line-height: 1.5;">"${message}"</p>
            </div>
            `
                : ""
            }

            <p style="color: #374151; line-height: 1.6;">Vi ses snart! ❤️</p>

            <p style="color: #374151; margin-top: 30px;">Hälsningar,<br><strong>Mimma & Niklas</strong></p>
          </div>
        </div>
      `,
    },
    notAttending: {
      subject: "Tack för ditt svar - Vi kommer att sakna dig! 💔",
      html: (name: string, guestCount: number, message?: string) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #dc2626 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Vi kommer sakna dig! 💔</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937;">Hej ${name}!</h2>
            <p style="color: #374151; line-height: 1.6;">Tack för att du lät oss veta att du inte kan komma till vår tupaantuliaiset. Vi kommer verkligen sakna dig!</p>

            ${
              message
                ? `
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <h4 style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 600;">Ditt meddelande:</h4>
              <p style="margin: 0; color: #92400e; font-style: italic; line-height: 1.5;">"${message}"</p>
            </div>
            `
                : ""
            }

            <p style="color: #374151; line-height: 1.6;">Vi hoppas att vi ses snart vid ett annat tillfälle. ❤️</p>

            <p style="color: #374151; margin-top: 30px;">Kram,<br><strong>Mimma & Niklas</strong></p>
          </div>
        </div>
      `,
    },
  },
  fi: {
    attending: {
      subject: "RSVP:n vahvistus - Tuparit 8. marraskuuta! 🎉",
      html: (name: string, guestCount: number, message?: string) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🏠 Tupaantuliaiset! 🎉</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937;">Hei ${name}!</h2>
            <p style="color: #374151; line-height: 1.6;">Kiitos RSVP:stäsi! Odotamme innolla tapaamista tupaantuliaisissamme.</p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ec4899;">
              <h3 style="margin-top: 0; color: #1f2937;">📅 Tiedot</h3>
              <p style="margin: 5px 0; color: #374151;"><strong>Päivä:</strong> Lauantai 8. marraskuuta 2025</p>
              <p style="margin: 5px 0; color: #374151;"><strong>Aika:</strong> klo 15:00 alkaen</p>
              <p style="margin: 5px 0; color: #374151;"><strong>Paikka:</strong> Väinö Auerin katu 15 B 21, 00560 Helsinki</p>
              <p style="margin: 5px 0; color: #374151;"><strong>Vieraat:</strong> ${guestCount} ${
                guestCount > 1 ? "henkilöä" : "henkilö"
              }</p>
            </div>

            <p style="color: #374151; line-height: 1.6;">Tarjolla on syötävää ja juotavaa, mutta janoisempien kannattaa ottaa myös omia juomia mukaan. Tule viihtymään pidemmäksi aikaa tai tule vain piipahtamaan!</p>

            ${
              message
                ? `
            <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <h4 style="margin: 0 0 8px 0; color: #0c4a6e; font-size: 14px; font-weight: 600;">Viestisi:</h4>
              <p style="margin: 0; color: #0c4a6e; font-style: italic; line-height: 1.5;">"${message}"</p>
            </div>
            `
                : ""
            }

            <p style="color: #374151; line-height: 1.6;">Nähdään pian! ❤️</p>

            <p style="color: #374151; margin-top: 30px;">Terkuin,<br><strong>Mimma & Niklas</strong></p>
          </div>
        </div>
      `,
    },
    notAttending: {
      subject: "Kiitos vastauksestasi - Tulemme kaipaamaan teitä! 💔",
      html: (name: string, guestCount: number, message?: string) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #dc2626 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Tulemme kaipaamaan teitä! 💔</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937;">Hei ${name}!</h2>
            <p style="color: #374151; line-height: 1.6;">Kiitos, että ilmoitit ettet pääse tupaantuliaisiimme. Tulemme todella kaipaamaan teitä!</p>

            ${
              message
                ? `
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <h4 style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 600;">Viestisi:</h4>
              <p style="margin: 0; color: #92400e; font-style: italic; line-height: 1.5;">"${message}"</p>
            </div>
            `
                : ""
            }

            <p style="color: #374151; line-height: 1.6;">Toivomme että näemme pian jossain muussa yhteydessä. ❤️</p>

            <p style="color: #374151; margin-top: 30px;">Halauksin,<br><strong>Mimma & Niklas</strong></p>
          </div>
        </div>
      `,
    },
  },
  en: {
    attending: {
      subject: "RSVP Confirmation - Housewarming Party November 8th! 🎉",
      html: (name: string, guestCount: number, message?: string) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🏠 Housewarming Party! 🎉</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937;">Hi ${name}!</h2>
            <p style="color: #374151; line-height: 1.6;">Thank you for your RSVP! We're looking forward to seeing you at our housewarming party.</p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ec4899;">
              <h3 style="margin-top: 0; color: #1f2937;">📅 Details</h3>
              <p style="margin: 5px 0; color: #374151;"><strong>Date:</strong> Saturday November 8th, 2025</p>
              <p style="margin: 5px 0; color: #374151;"><strong>Time:</strong> 3:00 PM onwards</p>
              <p style="margin: 5px 0; color: #374151;"><strong>Location:</strong> Väinö Auers gata 15 B 21, 00560 Helsinki</p>
              <p style="margin: 5px 0; color: #374151;"><strong>Guests:</strong> ${guestCount} ${
                guestCount > 1 ? "people" : "person"
              }</p>
            </div>

            <p style="color: #374151; line-height: 1.6;">We'll provide food and drinks, but thirsty guests are encouraged to bring their own drinks too. Come and stay for a long time or just drop by according to your own schedule!</p>

            ${
              message
                ? `
            <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <h4 style="margin: 0 0 8px 0; color: #0c4a6e; font-size: 14px; font-weight: 600;">Your message:</h4>
              <p style="margin: 0; color: #0c4a6e; font-style: italic; line-height: 1.5;">"${message}"</p>
            </div>
            `
                : ""
            }

            <p style="color: #374151; line-height: 1.6;">See you soon! ❤️</p>

            <p style="color: #374151; margin-top: 30px;">Best regards,<br><strong>Mimma & Niklas</strong></p>
          </div>
        </div>
      `,
    },
    notAttending: {
      subject: "Thanks for your response - We'll miss you! 💔",
      html: (name: string, guestCount: number, message?: string) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #dc2626 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">We'll miss you! 💔</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937;">Hi ${name}!</h2>
            <p style="color: #374151; line-height: 1.6;">Thank you for letting us know you can't make it to our housewarming party. We'll really miss you!</p>

            ${
              message
                ? `
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <h4 style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 600;">Your message:</h4>
              <p style="margin: 0; color: #92400e; font-style: italic; line-height: 1.5;">"${message}"</p>
            </div>
            `
                : ""
            }

            <p style="color: #374151; line-height: 1.6;">We hope to see you soon on another occasion. ❤️</p>

            <p style="color: #374151; margin-top: 30px;">Hugs,<br><strong>Mimma & Niklas</strong></p>
          </div>
        </div>
      `,
    },
  },
};

async function sendConfirmationEmail({
  email,
  firstName,
  isAttending,
  guestCount,
  message,
  language = "en",
}: {
  email: string;
  firstName: string;
  isAttending: boolean;
  guestCount: number;
  message?: string;
  language: string;
}) {
  try {
    console.log(`Attempting to send email to: ${email}`);
    console.log(`RESEND_API_KEY present: ${!!process.env.RESEND_API_KEY}`);

    const lang = language as keyof typeof emailTemplates;
    const template = emailTemplates[lang] || emailTemplates.en;
    const emailType = isAttending ? "attending" : "notAttending";
    const emailContent = template[emailType];

    const emailData = {
      from: "Mimma & Niklas <noreply@mail.niklaslindroos.fi>",
      to: [email],
      subject: emailContent.subject,
      html: emailContent.html(firstName, guestCount, message),
    };

    console.log(`Email data:`, { ...emailData, html: "[HTML_CONTENT]" });

    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error(`❌ Failed to send confirmation email to ${email}:`, error);
    } else {
      console.log(`✅ Confirmation email sent successfully to ${email}`, data);
    }
  } catch (error) {
    console.error(`❌ Failed to send confirmation email to ${email}:`, error);
    // Don't throw error - email failure shouldn't break RSVP submission
  }
}

const sql = neon(getDatabaseUrl());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const email = body.email?.trim();
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

    // Email validation (only if email is provided)
    if (email && email.length > 0) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        return NextResponse.json(
          { error: "Please enter a valid email address" },
          { status: 400 },
        );
      }
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

    // Check for duplicate submissions (same email or name combination)
    let duplicateCheck;
    if (email && email.length > 0) {
      duplicateCheck = await sql`
        SELECT COUNT(*) as count
        FROM rsvp_responses
        WHERE LOWER(email) = LOWER(${email}) 
        OR (LOWER(first_name) = LOWER(${firstName}) AND LOWER(last_name) = LOWER(${lastName}))
      `;
    } else {
      duplicateCheck = await sql`
        SELECT COUNT(*) as count
        FROM rsvp_responses
        WHERE LOWER(first_name) = LOWER(${firstName}) AND LOWER(last_name) = LOWER(${lastName})
      `;
    }

    if (Number(duplicateCheck[0].count) > 0) {
      return NextResponse.json(
        {
          error:
            "An RSVP with this name or email has already been submitted. Contact us if you need to make changes.",
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
      INSERT INTO rsvp_responses (first_name, last_name, email, is_attending, guest_count, message, timestamp)
      VALUES (${firstName}, ${lastName}, ${email || null}, ${body.isAttending}, ${
        body.guestCount
      }, ${message || null}, ${new Date().toISOString()})
      RETURNING id
    `;

    // Send confirmation email only if email is provided (don't await to avoid blocking response)
    if (email && email.length > 0) {
      sendConfirmationEmail({
        email,
        firstName,
        isAttending: body.isAttending,
        guestCount: body.guestCount,
        message: body.message,
        language: body.language || "en",
      });
    }

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
        email,
        is_attending,
        guest_count,
        message,
        timestamp,
        created_at,
        updated_at
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
    const formattedResponses = responses.map((record) => ({
      firstName: record.first_name,
      lastName: record.last_name,
      email: record.email,
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
