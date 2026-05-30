import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/auto")({
  head: () => ({
    meta: [
      { title: "Auto — easyDUD" },
      { name: "description", content: "Auto-rickshaws, metro pickups and street mobility on demand." },
    ],
  }),
  component: () => <CategoryPage category="auto" />,
});
