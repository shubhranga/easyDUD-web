import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/plans-pricing")({
  head: () => ({
    meta: [
      { title: "Plans & Pricing — easyDUD" },
      { name: "description", content: "easyDUD plans and pricing." },
    ],
  }),
  component: PlansPricing,
});

function PlansPricing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground">Plans & Pricing</h1>
        <p className="mt-2 text-muted-foreground">Coming soon.</p>
      </main>
    </div>
  );
}
