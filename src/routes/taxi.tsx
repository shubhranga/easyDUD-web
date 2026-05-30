import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/taxi")({
  head: () => ({
    meta: [
      { title: "Taxi — easyDUD" },
      { name: "description", content: "Book city cabs, airport rides and luxury rideshare with easyDUD." },
    ],
  }),
  component: () => <CategoryPage category="taxi" />,
});
