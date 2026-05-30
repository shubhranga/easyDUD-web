import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { BasicRegisterForm } from "@/components/onboarding/BasicRegisterForm";
import { PremiumRegisterForm } from "@/components/onboarding/PremiumRegisterForm";

const searchSchema = z.object({
  tier: z.enum(["basic", "premium"]).catch("basic"),
});

export const Route = createFileRoute("/hotel-onboarding/register")({
  validateSearch: (input) => searchSchema.parse(input),
  head: () => ({
    meta: [
      { title: "Hotel Registration — easyDUD Partners" },
      {
        name: "description",
        content:
          "Complete your hotel registration with easyDUD in a few guided steps.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { tier } = Route.useSearch();
  const isPremium = tier === "premium";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            to="/hotel-onboarding"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to plans
          </Link>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
              isPremium ? "bg-indigo-600 text-white" : "bg-slate-900 text-white"
            }`}
          >
            {tier} tier
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
          {isPremium
            ? "Premium hotel onboarding"
            : "Basic hotel registration"}
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          {isPremium
            ? "Full-service onboarding with booking engine, payments, and analytics."
            : "Get listed on easyDUD with a quick 3-step registration."}
        </p>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {isPremium ? <PremiumRegisterForm /> : <BasicRegisterForm />}
        </div>
      </main>
    </div>
  );
}
