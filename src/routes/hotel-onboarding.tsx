import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PricingCard, type PricingTier } from "@/components/onboarding/PricingCard";
import { ContactSection } from "@/components/onboarding/ContactSection";

const tiers: PricingTier[] = [
  {
    id: "basic",
    name: "Basic",
    originalPrice: 14999,
    discountedPrice: 9999,
    discountPercent: 33,
    cta: "Get Started",
    highlight: false,
    flow: ["Select Payment Method", "Fill Hotel Information"],
  },
  {
    id: "premium",
    name: "Premium",
    originalPrice: 299999,
    discountedPrice: 249999,
    discountPercent: 17,
    cta: "Get Started",
    highlight: true,
    flow: ["Fill Onboarding Form", "Payment Processing"],
  },
];

export const Route = createFileRoute("/hotel-onboarding")({
  head: () => ({
    meta: [
      { title: "Partner with easyDUD — List Your Hotel" },
      {
        name: "description",
        content:
          "Join easyDUD as a hotel partner. Choose Basic or Premium onboarding and reach thousands of travellers across India.",
      },
      { property: "og:title", content: "Partner with easyDUD — List Your Hotel" },
      {
        property: "og:description",
        content: "Self-register your hotel on easyDUD in minutes.",
      },
    ],
  }),
  component: HotelOnboardingLanding,
});

function HotelOnboardingLanding() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            to="/hotels"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Hotels
          </Link>
          <span className="text-sm font-semibold tracking-tight">
            easyDUD <span className="text-indigo-600">Partners</span>
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pb-12 pt-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
          Hotel Partner Portal
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Grow your bookings with easyDUD
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
          Join hundreds of properties already on the platform. Pick a tier
          that fits your business and start receiving bookings within days.
        </p>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid gap-8 md:grid-cols-2">
          {tiers.map((tier) => (
            <PricingCard key={tier.id} tier={tier} />
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              Have questions? Talk to us.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tell us about your property and we'll get back within 24 hours.
            </p>
          </div>
          <ContactSection />
        </div>
      </section>
    </div>
  );
}
