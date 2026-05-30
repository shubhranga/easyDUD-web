import { toast } from "sonner";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, LayoutGroup } from "framer-motion";
import { Check, ShieldCheck } from "lucide-react";
import { ServiceImage } from "@/components/ServiceImage";
import { SERVICE_IMAGES, CATEGORY_META } from "@/lib/service-images";

/* -------------------------------------------------------------------------- */
/*                            Shared section helper                            */
/* -------------------------------------------------------------------------- */

function SectionEyebrow({ children }: { children: string }) {
  return (
    <h2 className="inline-block border-b border-foreground/80 pb-1 text-sm font-medium text-foreground/90">
      {children}
    </h2>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Our Services                                  */
/* -------------------------------------------------------------------------- */

/** Gradient accent bar classes per service card — no two cards share the same colour pair. */
const CARD_ACCENTS: Record<string, string> = {
  taxi:        "from-sky-500 to-blue-600",
  flight:      "from-violet-500 to-purple-600",
  hotel:       "from-emerald-500 to-teal-600",
  bus:         "from-amber-500 to-orange-600",
  bikePooling: "from-rose-500 to-pink-600",
  auto:        "from-cyan-500 to-indigo-600",
};

const SERVICE_GRID = [
  { key: "taxi",        tall: true  },
  { key: "flight",      tall: true  },
  { key: "hotel",       tall: false },
  { key: "bus",         tall: false },
  { key: "bikePooling", tall: false },
  { key: "auto",        tall: false },
] as const;

export function OurServicesSection() {
  return (
    <section id="services" className="mt-20">
      <SectionEyebrow>Our Services</SectionEyebrow>
      <h3 className="mt-6 text-3xl md:text-4xl font-light text-foreground/85">
        Travel Solutions for Every Journey
        <span className="opacity-60">.....</span>
      </h3>

      {/* Top row: 2 wide landscape cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SERVICE_GRID.filter(({ tall }) => tall).map(({ key }) => {
          const meta = CATEGORY_META[key];
          const accent = CARD_ACCENTS[key];
          return (
            <div key={key} id={key} className="relative overflow-hidden rounded-[20px]" style={{ height: 260 }}>
              {/* 4 px gradient accent bar */}
              <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${accent} z-10`} />
              <ServiceImage
                images={SERVICE_IMAGES[key]}
                alt={meta.label}
                label={meta.label}
                to={meta.route}
                className="w-full h-full"
              />
            </div>
          );
        })}
      </div>

      {/* Bottom row: 4 equal landscape cards */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {SERVICE_GRID.filter(({ tall }) => !tall).map(({ key }) => {
          const meta = CATEGORY_META[key];
          const accent = CARD_ACCENTS[key];
          return (
            <div key={key} id={key} className="relative overflow-hidden rounded-[20px]" style={{ height: 200 }}>
              {/* 4 px gradient accent bar */}
              <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${accent} z-10`} />
              <ServiceImage
                images={SERVICE_IMAGES[key]}
                alt={meta.label}
                label={meta.label}
                to={meta.route}
                className="w-full h-full"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              What We Offer                                  */
/* -------------------------------------------------------------------------- */

export function WhatWeOfferSection() {
  return (
    <section id="offers" className="mt-20">
      <SectionEyebrow>What we Offer</SectionEyebrow>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        <h3 className="lg:col-span-7 text-3xl md:text-4xl font-light text-foreground/85 leading-tight">
          Book taxis, buses, flights, hotels, and more
        </h3>
        <p className="lg:col-span-5 text-sm text-foreground/55 leading-relaxed max-w-md">
          Explore seamless booking services for every journey from daily rides
          to long-distance travel, all in one convenient platform.
        </p>
      </div>

      <div className="mt-5">
        <Link
          to="/taxi"
          className="inline-block rounded-full bg-white border border-foreground/10 px-5 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          Book a ride
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ServiceImage
          images={SERVICE_IMAGES.flight}
          alt="Flights"
          label="Flights"
          to="/flights"
          className="h-[280px] w-full"
        />
        <ServiceImage
          images={SERVICE_IMAGES.hotel}
          alt="Hotels"
          label="Hotels"
          to="/hotels"
          className="h-[280px] w-full"
        />
        <ServiceImage
          images={SERVICE_IMAGES.bus}
          alt="Bus"
          label="Bus"
          to="/bus"
          className="h-[280px] w-full"
        />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Pricing                                    */
/* -------------------------------------------------------------------------- */

export interface PricingPlan {
  id: string;
  name: string;
  desc: string;
  monthly: number;
  yearly: number;
  popular?: boolean;
  highlights: string[];
  advanced: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "stater",
    name: "Driver Registration",
    desc: "Registered as a driver.",
    monthly: 1499,
    yearly: 1499,
    highlights: [
      "24/7 Partner support",
      "Live Tracking",
      "Easy Access Platform",
    ],
    advanced: [
      "PF (Provident Fund)",
      "Medical Insurance",
      "High Paying Opportunity",
      "Lms Facility (Leave Management System)",
      "Direct Connectivity",
      "Hourly , Weekly , Outstation , Monthly basis Duty",
    ],
  },
  {
    id: "basic",
    name: "Bike Pooler and Riders",
    desc: "One time Registration amount",
    monthly: 99,
    yearly: 99,
    popular: true,
    highlights: [
      "24/7 Partner support",
      "Live Tracking",
      "Easy Access Platform",
    ],
    advanced: [
      "Medical Insurance",
      "High Paying Opportunity",
      "Direct Connectivity",
      "Easy Top UP, Unlimited rides",
    ],
  },
  {
    id: "standard",
    name: "Auto Taxis",
    desc: "One time Registration amount",
    monthly: 149,
    yearly: 149,
    highlights: [
      "24/7 Partner support",
      "Live Tracking",
      "Easy Access Platform",
    ],
    advanced: [
      "Medical Insurance",
      "High Paying Opportunity",
      "Direct Connectivity",
      "Easy Top UP, Unlimited rides",
    ],
  },
    {
      id: "premium",
      name: "Outstation Cabs",
      desc: "One time Registration amount",
      monthly: 299,
      yearly: 299,
      highlights: [
        "24/7 Partner support",
        "Live Tracking",
        "Easy Access Platform",
      ],
      advanced: [
        "Medical Insurance",
        "High Paying Opportunity",
        "Direct Connectivity",
        "Easy Top UP, Unlimited rides",
      ],
    },

    {
    id: "pro",
    name: "Hotels Registration",
    desc: "Hotels Registration",
    monthly: 9999,
    yearly: 9999,
    highlights: [
      "24/7 Partner support",
      "Easy Tracking",
      "One Tap Easy",
    ],
    advanced: [
      "0% Commission",
      "Your Growth Partner 365 Days.",
      "Direct Connectivity",
      "Retain More Customers, Effortlessly",
      "Unlock Your Hotel’s True Potential.",
    ],
  },

];

export function PricingSection() {
  return (
    <section id="pricing" className="mt-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <SectionEyebrow>Plans &amp; Pricing</SectionEyebrow>
          <h3 className="mt-6 text-3xl md:text-5xl font-light text-foreground/90 leading-tight">
            Earn with easyDUD
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent font-medium">
              .
            </span>
          </h3>
          <p className="mt-3 max-w-xl text-sm text-foreground/55">
            Transparent pricing. Cancel any time. Upgrade or downgrade as your
            travel changes.
          </p>
        </div>
      </div>

      <LayoutGroup>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </LayoutGroup>

      <TrustRow />
    </section>
  );
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  const price = plan.monthly;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className="relative rounded-[22px] p-5 flex flex-col bg-white shadow-[0_8px_28px_rgba(60,60,90,0.08)] ring-1 ring-foreground/5 hover:ring-foreground/15 h-full"
    >
      <h4 className="text-base font-semibold text-foreground/90">{plan.name}</h4>
      <p className="mt-1 text-[10px] text-foreground/45 leading-relaxed min-h-[20px]">
        {plan.desc}
      </p>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-light text-foreground">
          ₹{price}
          {plan.id === "pro" && <span className="text-xs text-foreground/50">/yr</span>}
        </span>
      </div>
      <p className="mt-0.5 text-[10px] text-foreground/40">
        One time Registration amount
      </p>

      <button
        type="button"
        onClick={() => toast.success(`You selected the ${plan.name} plan! (Demo)`)}
        className="mt-5 w-full rounded-full py-2.5 text-sm font-medium border border-foreground/15 text-foreground/85 hover:border-foreground/40 hover:bg-foreground/[0.03] transition-all"
      >
        Choose Plan
      </button>

      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
            <Check className="h-3 w-3" strokeWidth={3} />
          </div>
          <span className="text-[11px] font-medium text-foreground/50">Benefits Unlock</span>
        </div>
        <ul className="space-y-1.5 ml-7">
          {plan.highlights.map((h) => (
            <li key={h} className="text-[11px] text-foreground/55 list-disc">
              {h}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h5 className="text-[11px] font-medium text-foreground/50 mb-3">Advance Benefits</h5>
        <ul className="space-y-1.5 ml-7">
          {plan.advanced.map((a) => (
            <li key={a} className="text-[11px] text-foreground/55 list-disc">
              {a}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function TrustRow() {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-foreground/55">
      <span className="inline-flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        30-day money-back guarantee
      </span>
      <span>•</span>
      <span>No setup fees</span>
      <span>•</span>
      <span>Cancel anytime</span>
      <span>•</span>
      <span>Trusted by 2M+ riders</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  QR cards                                   */
/* -------------------------------------------------------------------------- */

// Static QR-style placeholder — actual QR codes should be generated server-side
// and linked to real app store URLs before going to production.
const QR_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
      <rect width='100' height='100' fill='white'/>
      <rect x='10' y='10' width='30' height='30' fill='none' stroke='black' stroke-width='4'/>
      <rect x='18' y='18' width='14' height='14' fill='black'/>
      <rect x='60' y='10' width='30' height='30' fill='none' stroke='black' stroke-width='4'/>
      <rect x='68' y='18' width='14' height='14' fill='black'/>
      <rect x='10' y='60' width='30' height='30' fill='none' stroke='black' stroke-width='4'/>
      <rect x='18' y='68' width='14' height='14' fill='black'/>
      <rect x='45' y='10' width='5' height='5' fill='black'/>
      <rect x='45' y='20' width='5' height='5' fill='black'/>
      <rect x='45' y='30' width='5' height='5' fill='black'/>
      <rect x='10' y='45' width='5' height='5' fill='black'/>
      <rect x='20' y='45' width='5' height='5' fill='black'/>
      <rect x='30' y='45' width='5' height='5' fill='black'/>
      <rect x='45' y='45' width='5' height='5' fill='black'/>
      <rect x='55' y='45' width='5' height='5' fill='black'/>
      <rect x='65' y='45' width='5' height='5' fill='black'/>
      <rect x='75' y='45' width='5' height='5' fill='black'/>
      <rect x='85' y='45' width='5' height='5' fill='black'/>
      <rect x='55' y='55' width='5' height='5' fill='black'/>
      <rect x='65' y='55' width='5' height='5' fill='black'/>
      <rect x='55' y='65' width='5' height='5' fill='black'/>
      <rect x='75' y='65' width='5' height='5' fill='black'/>
      <rect x='55' y='75' width='5' height='5' fill='black'/>
      <rect x='65' y='75' width='5' height='5' fill='black'/>
      <rect x='75' y='75' width='5' height='5' fill='black'/>
      <rect x='85' y='75' width='5' height='5' fill='black'/>
      <rect x='85' y='55' width='5' height='5' fill='black'/>
      <rect x='85' y='65' width='5' height='5' fill='black'/>
    </svg>`,
  );

const QR_CARDS = [
  { title: "Download the app", subtitle: "Scan to download" },
  { title: "Download the Driver app", subtitle: "Scan to download" },
  { title: "Download the Bike pooling driver app", subtitle: "Scan to download" },
];

export function QrDownloadSection() {
  return (
    <section id="download" className="mt-20 mb-12">
      <SectionEyebrow>It&apos;s Easier in the app</SectionEyebrow>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {QR_CARDS.map((card) => (
          <div
            key={card.title}
            className="rounded-[20px] bg-white shadow-[0_8px_28px_rgba(60,60,90,0.08)] p-4 flex items-center gap-4"
          >
            <img
              src={QR_PLACEHOLDER}
              alt="QR code"
              loading="lazy"
              className="h-20 w-20 rounded-md"
            />
            <div className="flex flex-col">
              <p className="text-sm font-medium text-foreground/85">
                {card.title}
              </p>
              <p className="text-xs text-foreground/50 mt-1">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
