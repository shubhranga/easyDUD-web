import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/bike-pooling")({
  head: () => ({
    meta: [
      { title: "Bike Pooling — easyDUD" },
      { name: "description", content: "Urban commuters, helmets and electric bikes for daily rides." },
    ],
  }),
  component: () => <CategoryPage category="bikePooling" />,
});
