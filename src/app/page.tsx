"use client";

import { useState, useRef, useEffect } from "react";
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
  Heart,
} from "lucide-react";

type Language = "sv" | "fi" | "en";

const translations = {
  sv: {
    title: "Inflyttningsfest!",
    subtitle: "...och du är inbjuden.",
    address: "Väinö Auers gata 15 B 21, 00560 Helsingfors",
    date: "Lördag 8 november kl 15:00 framåt",
    familyFriendly:
      "Välkommen!\n\nKom och fira vårt nya hem tillsammans med oss. Vi bjuder på snacks och dryck, men törstiga gäster uppmuntras att ta med egna drycker.\n\nStanna länge eller kom bara förbi enligt dina egna planer. Festen börjar familjevänligt redan kl 15 och fortsätter tills sent på kvällen.\n\nVi hoppas att vi ses ❤\n\nHälsningar,\nMimma & Niklas",
    firstName: "Förnamn",
    lastName: "Efternamn",
    email: "E-post (om du vill ha en bekräftelse)",
    attending: "Kommer du?",
    yes: "JA!",
    no: "Tyvärr, kan inte komma",
    guestCount: "Antal gäster (inklusive du själv)",
    messageLabel: "Meddelande (valfritt)",
    messagePlaceholder: "Ditt meddelande",
    messagePlaceholderYes:
      "Ser fram emot att träffa er! Berätta under t.ex. vilka ni är som kommer, om ni är många och om ni har speciella kostbehov eller allergier, vi försöker ta hänsyn till dessa.",
    messagePlaceholderNo:
      "Vi kommer att sakna er! Om du vill meddela oss något, skriv bara här.",
    rsvpDeadline: "Vänligen svara senast 1.11.",
    submit: "Skicka RSVP",
    submitting: "Skickar...",
    successTitle: "Tack för ditt svar!",
    successMessage: "Vi ser fram emot att träffa dig på festen!",
    successEmailSent: "En bekräftelse har skickats till din e-post.",
    successNoEmail: "Ditt RSVP har registrerats.",
    successAttending: "Vi ser fram emot att träffa dig! 🏠✨",
    successNotAttending: "Tack för att du lät oss veta! 💙",
    firstNamePlaceholder: "Ditt förnamn",
    lastNamePlaceholder: "Ditt efternamn",
    emailPlaceholder: "din@email.com",
    messageHintAttending: "Tips för er som kommer",
    messageHintNotAttending: "Meddelande till oss",
    partyDetails: "Festdetaljer",
    errorMessage: "Något gick fel. Försök igen.",
    errorContact: "Om problemet återkommer, kontakta Mimma eller Niklas.",
    maxGuests: "Max 100 gäster",
    goodFood: "Snacks & dryck",
    greatMusic: "(Bra) musik",
    calendarTitle: "Inflyttningsfest",
    calendarDescription:
      "Kom och fira vårt nya hem! Familjevänlig timing – kom tidigt med barn, stanna sent utan dem.",
    charactersText: "tecken",
  },
  fi: {
    title: "Tuparit!",
    subtitle: "...ja sinut on kutsuttu.",
    address: "Väinö Auerin katu 15 B 21, 00560 Helsinki",
    date: "Lauantai 8. marraskuuta klo 15:00 alkaen",
    familyFriendly:
      "Tervetuloa!\n\nTule juhlimaan meidän kanssamme uutta kotiamme. Tarjolla on syötävää ja juotavaa, mutta janoisempien kannattaa ottaa myös omia juomia mukaan.\n\nTule viihtymään pidemmäksi aikaa tai tule vain piipahtamaan omien aikataulujesi puitteissa. Juhlat alkavat lapsiystävällisesti jo klo 15 ja jatkuvat myöhäisiltaan asti.\n\nToivottavasti nähdään ❤\n\nTerkuin,\nMimma & Niklas",
    firstName: "Etunimi",
    lastName: "Sukunimi",
    email: "Sähköposti (jos haluat vahvistusviestin)",
    attending: "Tuletko?",
    yes: "KYLLÄ!",
    no: "Valitettavasti en pääse",
    guestCount: "Vieraiden määrä (sisältäen sinut)",
    messageLabel: "Viesti (valinnainen)",
    messagePlaceholder: "Viestisi",
    messagePlaceholderYes:
      "Odotamme innolla tapaamista! Kerro alla esim. keitä teitä tulee, jos on tulossa monta ja onko teillä esim. erityisruokavalioita tai allergioita, pyrimme ottamaan nämä huomioon.",
    messagePlaceholderNo:
      "Tulemme kaipaamaan teitä! Jos haluat kertoa meille jotain, kirjoita se alle.",
    rsvpDeadline: "Vastaa viimeistään 1.11.",
    submit: "Lähetä RSVP",
    submitting: "Lähetetään...",
    successTitle: "Kiitos vastauksestasi!",
    successMessage: "Odotamme innolla tapaamista juhlissa!",
    successEmailSent: "Vahvistus on lähetetty sähköpostiisi.",
    successNoEmail: "RSVP:si on kirjattu.",
    successAttending: "Odotamme innolla tapaamista! 🏠✨",
    successNotAttending: "Kiitos, että ilmoitit! 💙",
    firstNamePlaceholder: "Etunimesi",
    lastNamePlaceholder: "Sukunimesi",
    emailPlaceholder: "sinun@email.com",
    messageHintAttending: "Vinkkejä tuleville vieraille",
    messageHintNotAttending: "Viesti meille",
    partyDetails: "Juhlan tiedot",
    errorMessage: "Jokin meni pieleen. Yritä uudelleen.",
    errorContact: "Jos ongelmia ilmenee, ota yhteyttä Mimmaan tai Niklakseen.",
    goodFood: "Snackseja & juomaa",
    greatMusic: "(Hyvää) musiikkia",
    calendarTitle: "Tupaantuliaiset",
    calendarDescription:
      "Tule juhlimaan uutta kotiamme! Perheystävällinen aikataulu – tule aikaisin lasten kanssa, jää myöhään ilman heitä.",
    charactersText: "merkkiä",
  },
  en: {
    title: "Housewarming Party!",
    subtitle: "...and you're invited.",
    address: "Väinö Auers gata 15 B 21, 00560 Helsinki",
    date: "Saturday November 8 at 15:00 onwards",
    familyFriendly:
      "Welcome!\n\nCome celebrate our new home with us. We'll provide food and drinks, but thirsty guests are encouraged to bring their own drinks too.\n\nCome and stay for a long time or just drop by according to your own schedule. The party starts family-friendly at 3 PM and continues late into the evening.\n\nHope to see you ❤\n\nBest regards,\nMimma & Niklas",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email (if you want a confirmation email)",
    attending: "Are you coming?",
    yes: "YES!",
    no: "Sorry, can't make it",
    guestCount: "Number of guests (including yourself)",
    messageLabel: "Message (optional)",
    messagePlaceholder: "Your message",
    messagePlaceholderYes:
      "Looking forward to seeing you! Please let us know e.g. who is coming, if there are many of you and if you have any special dietary requirements or allergies, we'll try to take these into account.",
    messagePlaceholderNo:
      "We'll miss you! If you have anything you want us to know, write it below.",
    rsvpDeadline: "Please RSVP by 1.11.",
    submit: "Send RSVP",
    submitting: "Sending...",
    successTitle: "Thanks for your response!",
    successMessage: "We look forward to seeing you at the party!",
    successEmailSent: "A confirmation has been sent to your email.",
    successNoEmail: "Your RSVP has been recorded.",
    successAttending: "We look forward to seeing you! 🏠✨",
    successNotAttending: "Thanks for letting us know! 💙",
    firstNamePlaceholder: "Your first name",
    lastNamePlaceholder: "Your last name",
    emailPlaceholder: "your@email.com",
    messageHintAttending: "Tips for attendees",
    messageHintNotAttending: "Message to us",
    partyDetails: "Party Details",
    errorMessage: "Something went wrong. Please try again.",
    errorContact: "In case of any problems, just message Mimma or Niklas.",
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
  email?: string;
  isAttending: boolean;
  guestCount: number;
  message?: string;
}

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("sv");
  const [formData, setFormData] = useState<RSVPForm>({
    firstName: "",
    lastName: "",
    email: "",
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
        body: JSON.stringify({
          ...formData,
          language: language,
        }),
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
    const [shouldBounce, setShouldBounce] = useState(false);
    const [currentImageSrc, setCurrentImageSrc] = useState("");
    const [currentMessage, setCurrentMessage] = useState("");
    const nameRef = useRef<HTMLSpanElement>(null);

    // Preload images for instant display (after initial page load)
    useEffect(() => {
      // Delay preloading to not interfere with LCP
      const imagesToPreload = [
        "/mimma1.jpeg",
        "/mimma2.jpeg",
        "/niklas1.jpg",
        "/niklas2.jpg",
      ];

      imagesToPreload.forEach((src) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = src;
        document.head.appendChild(link);
      });
    }, []);

    const handleMouseEnter = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });

      // Set random image for Mimma and Niklas
      if (name === "Mimma") {
        const randomImage = Math.random() < 0.5 ? "mimma1.jpeg" : "mimma2.jpeg";
        setCurrentImageSrc(`/${randomImage}`);
      } else if (name === "Niklas") {
        const randomImage = Math.random() < 0.5 ? "niklas1.jpg" : "niklas2.jpg";
        setCurrentImageSrc(`/${randomImage}`);
      } else {
        setCurrentImageSrc(`/${name.toLowerCase()}.jpg`);
      }

      setImageLoaded(false); // Reset image loaded state

      // Set the message once when popover appears
      setCurrentMessage(getRandomMessage(name));

      setIsVisible(true);

      // Reset bounce animation properly
      setShouldBounce(false);
      // Use setTimeout to ensure the animation resets before starting again
      setTimeout(() => {
        setShouldBounce(true);
        // Stop animation after 1.5s
        setTimeout(() => setShouldBounce(false), 1500);
      }, 10);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Hide popover on scroll (for mobile)
    useEffect(() => {
      if (!isVisible) return;

      const handleScroll = () => {
        setIsVisible(false);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, [isVisible]);

    const sillyMessages = {
      Mimma: [
        "🌟 Party Queen! 🌟",
        "🎉 The Fun One! 🎉",
        "✨ Sparkle Master ✨",
      ],
      Niklas: ["🤓 Tech Wizard! 🤓", "🍕 Pizza Connoisseur! 🍕"],
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
            className="fixed z-50 transform -translate-x-1/2 -translate-y-full transition-all duration-300"
            style={{
              left: position.x,
              top: position.y,
              animation: shouldBounce
                ? "bounce 1s ease-in-out infinite"
                : "none",
            }}
          >
            <div
              className={`bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-400 border-4 border-dashed border-rainbow rounded-3xl shadow-2xl p-4 max-w-xs transform ${
                name === "Mimma" ? "-rotate-3" : "rotate-3"
              } hover:rotate-0 transition-transform duration-300`}
            >
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
                  {currentImageSrc && (
                    <Image
                      src={currentImageSrc}
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
                  )}
                </div>

                {/* Silly name with effects */}
                <h4 className="font-bold text-purple-800 text-lg mb-2 transform hover:scale-105 transition-transform">
                  {name}
                </h4>

                {/* Random silly message */}
                <p className="text-sm font-medium text-purple-700 bg-white/70 rounded-full px-3 py-1 animate-pulse">
                  {currentMessage}
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
    const hasEmail = formData.email && formData.email.trim().length > 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center animate-bounce-twice">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {t.successTitle}
          </h1>
          <p className="text-gray-600 mb-6">{t.successMessage}</p>

          {/* Party Details */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-6 mb-6 text-left">
            <h3 className="text-lg font-semibold text-pink-700 mb-4 text-center">
              📅 {formData.isAttending ? t.calendarTitle : t.partyDetails}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-pink-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">{t.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-pink-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">{t.address}</span>
              </div>
              {formData.isAttending && (
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-pink-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    {formData.guestCount}{" "}
                    {formData.guestCount > 1
                      ? language === "sv"
                        ? "personer"
                        : language === "fi"
                          ? "henkilöä"
                          : "people"
                      : language === "sv"
                        ? "person"
                        : language === "fi"
                          ? "henkilö"
                          : "person"}
                  </span>
                </div>
              )}
              {formData.message && formData.message.trim().length > 0 && (
                <div className="mt-4 pt-3 border-t border-pink-200">
                  <div className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-pink-600 flex-shrink-0 mt-0.5"
                    >
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold mb-1 text-sm text-pink-700">
                        {language === "sv"
                          ? "Ditt meddelande:"
                          : language === "fi"
                            ? "Viestisi:"
                            : "Your message:"}
                      </h4>
                      <p className="text-sm italic text-gray-600">
                        &ldquo;{formData.message}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Email Status */}
          {hasEmail ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-green-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-mail-check"
                >
                  <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" />
                  <path d="m22 7-10 5L2 7" />
                  <path d="m16 19 2 2 4-4" />
                </svg>
                <div className="text-center">
                  <span className="font-medium block">
                    {t.successEmailSent}
                  </span>
                  <span className="text-sm text-green-600 font-mono">
                    {formData.email}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-blue-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check-circle"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="m9 11 3 3L22 4" />
                </svg>
                <span className="font-medium">{t.successNoEmail}</span>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500">
            {formData.isAttending ? (
              <span>{t.successAttending}</span>
            ) : (
              <span>{t.successNotAttending}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full min-w-[340px] shadow-2xl border-0">
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
                const endDate = new Date(2024, 10, 8, 23, 59); // November 8, 2024, 23:59

                // Format dates for different calendar systems
                const formatDateForICS = (date: Date) => {
                  return (
                    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
                  );
                };

                const eventDetails = {
                  title: t.calendarTitle,
                  location: t.address,
                  details: t.calendarDescription.replace(/\n/g, "\\n"),
                  start: formatDateForICS(startDate),
                  end: formatDateForICS(endDate),
                };

                // Detect device type for optimal calendar integration
                const isAndroid = /Android/i.test(navigator.userAgent);

                if (isAndroid) {
                  // For Android, try Google Calendar URL first (works better than .ics)
                  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(t.calendarDescription)}&location=${encodeURIComponent(eventDetails.location)}`;

                  // Try to open Google Calendar, fallback to ICS download
                  const calendarWindow = window.open(
                    googleCalendarUrl,
                    "_blank",
                  );

                  // If popup was blocked or failed, download ICS file
                  setTimeout(() => {
                    if (!calendarWindow || calendarWindow.closed) {
                      downloadICSFile();
                    }
                  }, 1000);
                } else {
                  // For iOS, desktop, and other devices, use .ics file (works better with native apps)
                  downloadICSFile();
                }

                function downloadICSFile() {
                  // Create properly formatted .ics file
                  const icsContent = [
                    "BEGIN:VCALENDAR",
                    "VERSION:2.0",
                    "PRODID:-//Housewarming Party//EN",
                    "CALSCALE:GREGORIAN",
                    "METHOD:PUBLISH",
                    "BEGIN:VEVENT",
                    `UID:housewarming-party-${Date.now()}@housewarmingparty.com`,
                    `DTSTART:${eventDetails.start}`,
                    `DTEND:${eventDetails.end}`,
                    `SUMMARY:${eventDetails.title}`,
                    `DESCRIPTION:${eventDetails.details}`,
                    `LOCATION:${eventDetails.location}`,
                    `URL:${window.location.href}`,
                    "STATUS:CONFIRMED",
                    "TRANSP:OPAQUE",
                    `CREATED:${formatDateForICS(new Date())}`,
                    `LAST-MODIFIED:${formatDateForICS(new Date())}`,
                    "END:VEVENT",
                    "END:VCALENDAR",
                  ].join("\r\n");

                  // Create and download .ics file with proper MIME type
                  const blob = new Blob([icsContent], {
                    type: "text/calendar;charset=utf-8",
                  });
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.download = "housewarming-party.ics";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);

                  // Clean up the blob URL
                  URL.revokeObjectURL(link.href);
                }
              }}
            >
              <Calendar className="h-4 w-4" />
              <span className="font-medium underline decoration-dotted">
                {t.date}
              </span>
            </div>
          </div>

          <Alert className="text-left mb-4 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
            <Heart className="h-4 w-4 text-pink-500 flex-shrink-0" />
            <AlertDescription className="text-sm leading-relaxed pl-2">
              <div className="space-y-3">
                {t.familyFriendly.split("\n\n").map((paragraph, index) => (
                  <div
                    key={index}
                    className={`${
                      index === 0 ? "font-medium text-pink-700" : ""
                    }`}
                  >
                    {renderTextWithNames(paragraph)}
                  </div>
                ))}
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
                  placeholder={t.firstNamePlaceholder}
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
                  placeholder={t.lastNamePlaceholder}
                  className="placeholder:text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder={t.emailPlaceholder}
                className="placeholder:text-sm"
              />
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
              <div className="relative mb-3 p-4 rounded-xl border-2 border-dashed border-pink-200 bg-gradient-to-r from-pink-50/80 to-purple-50/80 backdrop-blur-sm">
                <div className="absolute -top-2 left-4 bg-white px-2 py-0.5 rounded-full text-xs font-medium text-pink-600 border border-pink-200">
                  {formData.isAttending
                    ? t.messageHintAttending
                    : t.messageHintNotAttending}
                </div>
                <div className="text-sm text-gray-700 leading-relaxed mt-2">
                  {formData.isAttending
                    ? t.messagePlaceholderYes
                    : t.messagePlaceholderNo}
                </div>
              </div>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                maxLength={500}
                rows={3}
                placeholder={t.messagePlaceholder}
                className="resize-none"
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
