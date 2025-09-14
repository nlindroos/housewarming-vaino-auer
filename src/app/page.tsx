"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Minus,
  Plus,
  Home,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  MessageCircle,
  Send,
  Loader2,
  PartyPopper,
  UtensilsCrossed,
  Music,
  UserCheck,
} from "lucide-react";

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
      <Card className="max-w-md w-full min-w-[340px] shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center items-center gap-2 mb-3">
            <Home className="h-8 w-8 text-pink-500" />
            <Sparkles className="h-8 w-8 text-purple-500" />
          </div>
          <CardTitle className="text-2xl mb-2">Housewarming Party!</CardTitle>
          <p className="text-lg text-muted-foreground mb-4">
            ...and you&apos;re invited
          </p>
          <div className="text-sm space-y-2 mb-4 text-muted-foreground">
            <div
              className="flex items-center justify-center gap-2 cursor-pointer hover:text-foreground transition-colors"
              onClick={() => {
                const address = "Väinö Auers gata 15 B 21, 00560 Helsinki";
                const encodedAddress = encodeURIComponent(address);

                const isAppleDevice = /iPad|iPhone|iPod|Macintosh/.test(
                  navigator.userAgent,
                );

                if (isAppleDevice) {
                  const appleMapsUrl = `maps://maps.apple.com/?q=${encodedAddress}`;
                  window.location.href = appleMapsUrl;
                } else {
                  const googleMapsUrl = `https://maps.google.com/maps?q=${encodedAddress}`;
                  window.open(googleMapsUrl, "_blank");
                }
              }}
            >
              <MapPin className="h-4 w-4" />
              <span className="font-medium underline decoration-dotted">
                Väinö Auers gata 15 B 21
              </span>
            </div>
            <p className="font-medium">00560 Helsinki</p>
            <div
              className="flex items-center justify-center gap-2 cursor-pointer hover:text-foreground transition-colors"
              onClick={() => {
                // Create calendar event
                const startDate = new Date(2024, 10, 8, 15, 0); // November 8, 2024, 15:00
                const endDate = new Date(2024, 10, 9, 0, 0); // November 9, 2024, 00:00 (24:00)

                const eventDetails = {
                  title: "Housewarming Party",
                  location: "Väinö Auers gata 15 B 21, 00560 Helsinki",
                  details:
                    "Come celebrate our new home! Family-friendly timing - arrive early with kids, stay late without them.",
                  start:
                    startDate.toISOString().replace(/[-:]/g, "").split(".")[0] +
                    "Z",
                  end:
                    endDate.toISOString().replace(/[-:]/g, "").split(".")[0] +
                    "Z",
                };

                // Create universal .ics file that works with any calendar app
                const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Housewarming Party//EN
BEGIN:VEVENT
UID:housewarming-party-${Date.now()}@${window.location.hostname}
DTSTART:${eventDetails.start}
DTEND:${eventDetails.end}
SUMMARY:${eventDetails.title}
DESCRIPTION:${eventDetails.details}
LOCATION:${eventDetails.location}
URL:${window.location.href}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

                // Create and download .ics file
                const blob = new Blob([icsContent], {
                  type: "text/calendar;charset=utf-8",
                });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "housewarming-party.ics";
                link.click();

                // Clean up the blob URL
                URL.revokeObjectURL(link.href);
              }}
            >
              <Calendar className="h-4 w-4" />
              <span className="font-medium underline decoration-dotted">
                Sat November 8 at 15:00 onwards
              </span>
            </div>
          </div>

          <Alert className="text-left mb-4">
            <Users className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <span className="font-semibold">Family-friendly timing:</span>{" "}
              Feel free to arrive early with kids and enjoy the afternoon
              festivities. If you&apos;d like to stay later for the evening
              celebration, you&apos;re welcome to arrange childcare and continue
              the party with us!
            </AlertDescription>
          </Alert>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  required
                  maxLength={50}
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="Your first name"
                  className="placeholder:text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  required
                  maxLength={50}
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Your last name"
                  className="placeholder:text-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <PartyPopper className="h-4 w-4" />
                <Label>Are you coming to the party?</Label>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={formData.isAttending ? "default" : "outline"}
                  onClick={() => handleInputChange("isAttending", true)}
                  className={`flex-1 ${
                    formData.isAttending
                      ? "bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-700"
                      : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  }`}
                  size="sm"
                >
                  YES!
                </Button>
                <Button
                  type="button"
                  variant={!formData.isAttending ? "default" : "outline"}
                  onClick={() => handleInputChange("isAttending", false)}
                  className={`flex-1 ${
                    !formData.isAttending
                      ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-600"
                      : "border-amber-200 text-amber-600 hover:bg-amber-50"
                  }`}
                  size="sm"
                >
                  Sorry, can&apos;t make it
                </Button>
              </div>
            </div>

            {formData.isAttending && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <Label>How many people are coming?</Label>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleInputChange(
                        "guestCount",
                        Math.max(1, formData.guestCount - 1),
                      )
                    }
                    className="h-10 w-10 rounded-full"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-2xl font-bold min-w-[3rem] text-center">
                    {formData.guestCount}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleInputChange(
                        "guestCount",
                        Math.min(10, formData.guestCount + 1),
                      )
                    }
                    className="h-10 w-10 rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <Label htmlFor="message">Any message for us?</Label>
              </div>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                maxLength={500}
                rows={3}
                placeholder={
                  formData.isAttending
                    ? "Tell us what you're excited about or any dietary restrictions..."
                    : "If there's something you'd like to tell us, this is your chance..."
                }
                className="resize-none placeholder:text-sm"
              />
              <div className="text-right text-sm text-muted-foreground">
                {formData.message?.length ?? 0}/500 characters
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending RSVP...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send RSVP!
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center text-sm text-muted-foreground">
            <div className="flex flex-col sm:flex-row items-center gap-1">
              <UserCheck className="h-4 w-4 sm:h-3 sm:w-3" />
              <span>Max 100 guests</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-1">
              <UtensilsCrossed className="h-4 w-4 sm:h-3 sm:w-3" />
              <span>Snacks & drinks</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-1">
              <Music className="h-4 w-4 sm:h-3 sm:w-3" />
              <span>Music & fun!</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
