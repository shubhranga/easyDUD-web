import { useNavigate } from "@tanstack/react-router";
import { DiscountBadge } from "./DiscountBadge";
import { PremiumFeatureList } from "./PremiumFeatureList";

export interface PricingTier {
  id: "basic" | "premium";
  name: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  cta: string;
  highlight: boolean;
  flow: string[];
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function PricingCard({ tier }: { tier: PricingTier }) {
  const navigate = useNavigate();

  return (
    <article
      className={`relative flex flex-col rounded-3xl border bg-white p-8 shadow-sm transition-all hover:shadow-xl ${
        tier.highlight
          ? "border-indigo-500 ring-2 ring-indigo-100"
          : "border-slate-200"
      }`}
    >
      {tier.highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-md">
          Most Popular
        </span>
      )}

      <DiscountBadge percent={tier.discountPercent} />

      <h3 className="text-2xl font-bold text-foreground">{tier.name}</h3>

      <div className="mt-4">
        <div className="flex items-baseline gap-3">
          <span className="text-base text-slate-400 line-through">
            {inr(tier.originalPrice)}
          </span>
          <span className="text-4xl font-extrabold text-foreground">
            {inr(tier.discountedPrice)}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {tier.id === "basic"
            ? "One-time registration fee"
            : "Promotional price — limited period"}
        </p>
      </div>

      {tier.id === "premium" ? (
        <PremiumFeatureList />
      ) : (
        <ul className="my-6 space-y-2 text-sm text-foreground/75">
          <li>• Listing on easyDUD hotel search</li>
          <li>• Manual booking management</li>
          <li>• Email & phone support</li>
        </ul>
      )}

      <div className="mb-6 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
        <p className="font-semibold uppercase tracking-wide text-slate-500">
          Process
        </p>
        <ol className="mt-1 list-inside list-decimal space-y-0.5">
          {tier.flow.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <button
        type="button"
        onClick={() =>
          navigate({
            to: "/hotel-onboarding/register",
            search: { tier: tier.id },
          })
        }
        className={`mt-auto w-full rounded-xl py-3 font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          tier.highlight
            ? "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-400"
            : "bg-foreground text-background hover:opacity-90 focus-visible:ring-slate-400"
        }`}
      >
        {tier.cta}
      </button>
    </article>
  );
}
