"use client";

import { useState, useRef } from "react";
import Image from "next/image";
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
    date: "Lördag 8 november kl 15:00 framåt",
    familyFriendly:
      "Välkommen!\n\nKom och fira vårt nya hem tillsammans med oss. Tarjolla är mat och dryck, men törstiga gäster uppmuntras att ta med egna drycker.\n\nKom och stanna länge eller kom bara förbi enligt dina egna planer. Festen börjar familjevänligt redan kl 15 och fortsätter sent på kvällen.\n\nVi hoppas vi ses ❤\n\nHälsningar,\nMimma & Niklas",
    firstName: "Förnamn",
    lastName: "Efternamn",
    attending: "Kommer du?",
    yes: "JA!",
    no: "Tyvärr, kan inte komma",
    guestCount: "Antal gäster (inklusive dig själv)",
    messageLabel: "Meddelande (valfritt)",
    messagePlaceholderYes:
      "Ser fram emot att träffa er! Berätta t.ex. vilka ni är som kommer, om ni är många och om ni har speciella kostbehov eller allergier, vi försöker ta hänsyn till dessa.",
    messagePlaceholderNo:
      "Vi kommer att sakna er! Om ni vill meddela något, skriv bara här.",
    rsvpDeadline: "Vänligen svara senast 1.11.",
    submit: "Skicka RSVP",
    submitting: "Skickar...",
    successTitle: "Tack för ditt svar!",
    successMessage: "Vi ser fram emot att träffa dig på festen!",
    errorMessage: "Något gick fel. Försök igen.",
    errorContact: "Om problem kvarstår, kontakta bara Mimma eller Niklas.",
    maxGuests: "Max 100 gäster",
    goodFood: "Snacks & dryck",
    greatMusic: "(Bra) musik",
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
      "Tervetuloa!\n\nTule juhlimaan meidän kanssamme uutta kotiamme. Tarjolla on syötävää ja juotavaa, mutta janoisempien kannattaa ottaa myös omia juomia mukaan.\n\nTule viihtymään pidemmäksi aikaa tai tule vain piipahtamaan omien aikataulujesi puitteissa. Juhlat alkavat lapsiystävällisesti jo klo 15 ja jatkuvat myöhäisiltaan asti.\n\nToivottavasti nähdään ❤\n\nTerkuin,\nMimma & Niklas",
    firstName: "Etunimi",
    lastName: "Sukunimi",
    attending: "Tuletko?",
    yes: "KYLLÄ!",
    no: "Valitettavasti en pääse",
    guestCount: "Vieraiden määrä (sisältäen sinut)",
    messageLabel: "Viesti (valinnainen)",
    messagePlaceholderYes:
      "Odotamme innolla tapaamista! Kerro esim. keitä teitä tulee, jos on tulossa monta ja onko teillä esim. erityisruokavalioita tai allergioita, pyrimme ottamaan nämä huomioon.",
    messagePlaceholderNo:
      "Tulemme kaipaamaan teitä! Jos haluat kertoa jotain, kirjoita tähän.",
    rsvpDeadline: "Vastaa viimeistään 1.11.",
    submit: "Lähetä RSVP",
    submitting: "Lähetetään...",
    successTitle: "Kiitos vastauksestasi!",
    successMessage: "Odotamme innolla tapaamista juhlissa!",
    errorMessage: "Jokin meni pieleen. Yritä uudelleen.",
    errorContact: "Jos ongelmia ilmenee, ota yhteyttä Mimmaan tai Niklasiin.",
    maxGuests: "Maks. 100 vierasta",
    goodFood: "Snackseja & juomaa",
    greatMusic: "(Hyvää) musiikkia",
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
      "Welcome!\n\nCome celebrate our new home with us. We'll provide food and drinks, but thirsty guests are encouraged to bring their own drinks too.\n\nCome and stay for a long time or just drop by according to your own schedule. The party starts family-friendly at 3 PM and continues late into the evening.\n\nHope to see you ❤\n\nBest regards,\nMimma & Niklas",
    firstName: "First Name",
    lastName: "Last Name",
    attending: "Are you coming?",
    yes: "YES!",
    no: "Sorry, can't make it",
    guestCount: "Number of guests (including yourself)",
    messageLabel: "Message (optional)",
    messagePlaceholderYes:
      "Looking forward to seeing you! Please let us know e.g. who is coming, if there are many of you and if you have any special dietary requirements or allergies, we'll try to take these into account.",
    messagePlaceholderNo:
      "We'll miss you! If you have anything you want us to know, write it here.",
    rsvpDeadline: "Please RSVP by 1.11.",
    submit: "Send RSVP",
    submitting: "Sending...",
    successTitle: "Thanks for your response!",
    successMessage: "We look forward to seeing you at the party!",
    errorMessage: "Something went wrong. Please try again.",
    errorContact: "In case of any problems, just message Mimma or Niklas.",
    maxGuests: "Max 100 guests",
    goodFood: "Snacks & drinks",
    greatMusic: "(Great) music",
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
        alert(`${result.error || t.errorMessage}\n\n${t.errorContact}`);
        return;
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      alert(`${t.errorMessage}\n\n${t.errorContact}`);
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

  const NamePopover = ({
    name,
    children,
  }: {
    name: string;
    children: React.ReactNode;
  }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [imageLoaded, setImageLoaded] = useState(false);
    const nameRef = useRef<HTMLSpanElement>(null);

    const handleMouseEnter = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const sillyMessages = {
      Mimma: [
        "🌟 Party Queen! 🌟",
        "🎉 The Fun One! 🎉",
        "✨ Sparkle Master ✨",
      ],
      Niklas: [
        "🤓 Tech Wizard! 🤓",
        "🎸 Music Guru! 🎸",
        "🏠 Home Builder! 🏠",
      ],
    };

    const getRandomMessage = (personName: string) => {
      const messages = sillyMessages[
        personName as keyof typeof sillyMessages
      ] || ["🎉 Party Person! 🎉"];
      return messages[Math.floor(Math.random() * messages.length)];
    };

    return (
      <>
        <span
          ref={nameRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="text-pink-600 font-semibold cursor-pointer hover:text-pink-700 transition-all duration-300 underline decoration-dotted hover:scale-110 hover:rotate-1"
        >
          {children}
        </span>
        {isVisible && (
          <div
            className="fixed z-50 transform -translate-x-1/2 -translate-y-full transition-all duration-300 animate-bounce"
            style={{
              left: position.x,
              top: position.y,
            }}
          >
            <div className="bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-400 border-4 border-dashed border-rainbow rounded-3xl shadow-2xl p-4 max-w-xs transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="text-center relative">
                {/* Silly decorative elements */}
                <div className="absolute -top-2 -left-2 text-2xl animate-spin">
                  🌟
                </div>
                <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                  🎉
                </div>
                <div className="absolute -bottom-1 -left-1 text-xl animate-bounce">
                  ✨
                </div>
                <div className="absolute -bottom-1 -right-1 text-xl animate-ping">
                  💫
                </div>

                {/* Image placeholder with silly styling */}
                <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full border-4 border-white shadow-lg mx-auto mb-3 flex items-center justify-center transform hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                  {/* Emoji fallback - only show if image hasn't loaded */}
                  {!imageLoaded && (
                    <div className="text-4xl z-10">
                      {name === "Mimma" ? "👩" : "👨"}
                    </div>
                  )}
                  {/* Actual image */}
                  <Image
                    src={`/${name.toLowerCase()}.jpg`}
                    alt={name}
                    width={96}
                    height={96}
                    className={`w-full h-full rounded-full object-cover absolute inset-0 z-20 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => {
                      setImageLoaded(true);
                    }}
                    onError={() => {
                      setImageLoaded(false);
                    }}
                  />
                </div>

                {/* Silly name with effects */}
                <h4 className="font-bold text-purple-800 text-lg mb-2 transform hover:scale-105 transition-transform">
                  {name}
                </h4>

                {/* Random silly message */}
                <p className="text-sm font-medium text-purple-700 bg-white/70 rounded-full px-3 py-1 animate-pulse">
                  {getRandomMessage(name)}
                </p>
              </div>

              {/* Silly arrow with rainbow effect */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-yellow-300 animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderTextWithNames = (text: string) => {
    const parts = text.split(/(\bMimma\s*&\s*Niklas\b|\bMimma\b|\bNiklas\b)/g);
    return parts.map((part, index) => {
      if (part === "Mimma" || part === "Niklas") {
        return (
          <NamePopover key={index} name={part}>
            {part}
          </NamePopover>
        );
      } else if (part.match(/Mimma\s*&\s*Niklas/)) {
        const nameParts = part.split(/(\s*&\s*)/);
        return (
          <span key={index} className="whitespace-nowrap">
            {nameParts.map((namePart, nameIndex) => {
              if (namePart === "Mimma") {
                return (
                  <NamePopover key={nameIndex} name="Mimma">
                    Mimma
                  </NamePopover>
                );
              } else if (namePart === "Niklas") {
                return (
                  <NamePopover key={nameIndex} name="Niklas">
                    Niklas
                  </NamePopover>
                );
              }
              return namePart;
            })}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
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
      <Card className="max-w-lg w-full min-w-[340px] shadow-2xl border-0">
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
            <AlertDescription className="text-sm whitespace-pre-line">
              <div className="inline">
                {renderTextWithNames(t.familyFriendly)}
              </div>
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

            <div className="text-center text-sm text-foreground font-medium italic mb-2">
              {t.rsvpDeadline}
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
