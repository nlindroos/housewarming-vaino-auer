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
  Heart,
} from "lucide-react";

type Language = "sv" | "fi" | "en";

const translations = {
  sv: {
    title: "Housewarming Party!",
    subtitle: "...och du är inbjuden",
    address: "Väinö Auers gata 15 B 21, 00560 Helsingfors",
    date: "Lördag 8 november kl 15:00 och framåt",
    familyFriendly:
      "Mimma och Niklas bjuder in dig! Kom och fira vårt nya hem. Familjevänlig timing – kom tidigt med barn, stanna sent utan dem. P.S. Om du är törstig är det bra att ta med egna drycker.",
    firstName: "Förnamn",
    lastName: "Efternamn",
    attending: "Kommer du?",
    yes: "JA!",
    no: "Tyvärr, kan inte komma",
    guestCount: "Antal gäster (inklusive dig själv)",
    messageLabel: "Meddelande (valfritt)",
    messagePlaceholderYes:
      "Ser fram emot att träffa er! Något speciellt ni vill att vi ska veta?",
    messagePlaceholderNo: "Vi kommer att sakna er! Hoppas vi ses snart.",
    submit: "Skicka RSVP",
    submitting: "Skickar...",
    successTitle: "Tack för ditt svar!",
    successMessage: "Vi ser fram emot att träffa dig på festen!",
    errorMessage: "Något gick fel. Försök igen.",
    maxGuests: "Max 100 gäster",
    goodFood: "God mat & dryck",
    greatMusic: "Bra musik",
    calendarTitle: "Housewarming Party",
    calendarDescription:
      "Kom och fira vårt nya hem! Familjevänlig timing – kom tidigt med barn, stanna sent utan dem.",
    charactersText: "tecken",
  },
  fi: {
    title: "Tupaantuliaiset!",
    subtitle: "...ja sinut on kutsuttu",
    address: "Väinö Auerin katu 15 B 21, 00560 Helsinki",
    date: "Lauantai 8. marraskuuta klo 15:00 alkaen",
    familyFriendly:
      "Mimma ja Niklas kutsuvat sinut! Tule juhlimaan uutta kotiamme. Perheystävällinen aikataulu – tule aikaisin lasten kanssa, jää myöhään ilman heitä. P.S. Jos on kova jano niin kannattaa ottaa mukaan omia juomia.",
    firstName: "Etunimi",
    lastName: "Sukunimi",
    attending: "Tuletko?",
    yes: "KYLLÄ!",
    no: "Valitettavasti en pääse",
    guestCount: "Vieraiden määrä (sisältäen sinut)",
    messageLabel: "Viesti (valinnainen)",
    messagePlaceholderYes:
      "Odotamme innolla tapaamista! Onko jotain erityistä mitä meidän pitäisi tietää?",
    messagePlaceholderNo:
      "Tulemme kaipaamaan teitä! Toivottavasti nähdään pian.",
    submit: "Lähetä RSVP",
    submitting: "Lähetetään...",
    successTitle: "Kiitos vastauksestasi!",
    successMessage: "Odotamme innolla tapaamista juhlissa!",
    errorMessage: "Jokin meni pieleen. Yritä uudelleen.",
    maxGuests: "Max 100 vierasta",
    goodFood: "Hyvää ruokaa & juomaa",
    greatMusic: "Hyvää musiikkia",
    calendarTitle: "Tupaantuliaiset",
    calendarDescription:
      "Tule juhlimaan uutta kotiamme! Perheystävällinen aikataulu – tule aikaisin lasten kanssa, jää myöhään ilman heitä.",
    charactersText: "merkkiä",
  },
  en: {
    title: "Housewarming Party!",
    subtitle: "...and you're invited",
    address: "Väinö Auers gata 15 B 21, 00560 Helsinki",
    date: "Saturday November 8 at 15:00 onwards",
    familyFriendly:
      "Mimma and Niklas invite you! Come celebrate our new home. Family-friendly timing – arrive early with kids, stay late without them. P.S. If you get thirsty, feel free to bring your own drinks.",
    firstName: "First Name",
    lastName: "Last Name",
    attending: "Are you coming?",
    yes: "YES!",
    no: "Sorry, can't make it",
    guestCount: "Number of guests (including yourself)",
    messageLabel: "Message (optional)",
    messagePlaceholderYes:
      "Looking forward to seeing you! Anything special we should know?",
    messagePlaceholderNo: "We'll miss you! Hope to see you soon.",
    submit: "Send RSVP",
    submitting: "Sending...",
    successTitle: "Thanks for your response!",
    successMessage: "We look forward to seeing you at the party!",
    errorMessage: "Something went wrong. Please try again.",
    maxGuests: "Max 100 guests",
    goodFood: "Good food & drinks",
    greatMusic: "Great music",
    calendarTitle: "Housewarming Party",
    calendarDescription:
      "Come celebrate our new home! Family-friendly timing – arrive early with kids, stay late without them.",
    charactersText: "characters",
  },
};

interface RSVPForm {
  firstName: string;
  lastName: string;
  isAttending: boolean;
  guestCount: number;
  message?: string;
}

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("sv");
  const [formData, setFormData] = useState<RSVPForm>({
    firstName: "",
    lastName: "",
    isAttending: true,
    guestCount: 1,
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[language];

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
            {t.successTitle}
          </h1>
          <p className="text-gray-600 mb-6">{t.successMessage}</p>
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
        {/* Language Switcher */}
        <div className="flex justify-center gap-2 p-4 pb-0">
          <Button
            variant={language === "sv" ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage("sv")}
            className="text-xs"
          >
            🇸🇪 Svenska
          </Button>
          <Button
            variant={language === "fi" ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage("fi")}
            className="text-xs"
          >
            🇫🇮 Suomi
          </Button>
          <Button
            variant={language === "en" ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage("en")}
            className="text-xs"
          >
            🇬🇧 English
          </Button>
        </div>

        <CardHeader className="text-center pb-4">
          <div className="flex justify-center items-center gap-2 mb-3">
            <Home className="h-8 w-8 text-pink-500" />
            <Sparkles className="h-8 w-8 text-purple-500" />
          </div>
          <CardTitle className="text-2xl mb-2">{t.title}</CardTitle>
          <p className="text-lg text-muted-foreground mb-4">{t.subtitle}</p>
          <div className="text-sm space-y-2 mb-4 text-muted-foreground">
            <div
              className="flex items-center justify-center gap-2 cursor-pointer hover:text-foreground transition-colors"
              onClick={() => {
                const address = t.address;
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
                {t.address}
              </span>
            </div>
            <div
              className="flex items-center justify-center gap-2 cursor-pointer hover:text-foreground transition-colors"
              onClick={() => {
                // Create calendar event
                const startDate = new Date(2024, 10, 8, 15, 0); // November 8, 2024, 15:00
                const endDate = new Date(2024, 10, 9, 0, 0); // November 9, 2024, 00:00 (24:00)

                const eventDetails = {
                  title: t.calendarTitle,
                  location: t.address,
                  details: t.calendarDescription,
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
                {t.date}
              </span>
            </div>
          </div>

          <Alert className="text-left mb-4">
            <Heart className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {t.familyFriendly}
            </AlertDescription>
          </Alert>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t.firstName}</Label>
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
                <Label htmlFor="lastName">{t.lastName}</Label>
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
                <Label>{t.attending}</Label>
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
                  {t.yes}
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
                  {t.no}
                </Button>
              </div>
            </div>

            {formData.isAttending && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <Label>{t.guestCount}</Label>
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
                <Label htmlFor="message">{t.messageLabel}</Label>
              </div>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                maxLength={500}
                rows={3}
                placeholder={
                  formData.isAttending
                    ? t.messagePlaceholderYes
                    : t.messagePlaceholderNo
                }
                className="resize-none placeholder:text-sm"
              />
              <div className="text-right text-sm text-muted-foreground">
                {formData.message?.length ?? 0}/500 {t.charactersText}
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
                  {t.submitting}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {t.submit}
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center text-sm text-muted-foreground">
            <div className="flex flex-col sm:flex-row items-center gap-1">
              <UserCheck className="h-4 w-4 sm:h-3 sm:w-3" />
              <span>{t.maxGuests}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-1">
              <UtensilsCrossed className="h-4 w-4 sm:h-3 sm:w-3" />
              <span>{t.goodFood}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-1">
              <Music className="h-4 w-4 sm:h-3 sm:w-3" />
              <span>{t.greatMusic}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
