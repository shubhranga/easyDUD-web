export type ServiceCategory =
  | "taxi"
  | "bus"
  | "flight"
  | "hotel"
  | "bikePooling"
  | "auto";

export const SERVICE_IMAGES: Record<ServiceCategory, string[]> = {
  taxi: [
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&h=600&q=80",
    "https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=1200&h=600&q=80",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&h=600&q=80",
  ],
  bus: [
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&h=600&q=80",
    "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?auto=format&fit=crop&w=1200&h=600&q=80",
    "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&h=600&q=80",
  ],
  flight: [
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&h=600&q=80",
    "https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=1200&h=600&q=80",
    "https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=1200&h=600&q=80",
  ],
  hotel: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&h=600&q=80",
    "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1200&h=600&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&h=600&q=80",
  ],
  bikePooling: [
    "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&h=600&q=80",
    "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1200&h=600&q=80",
    "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1200&h=600&q=80",
  ],
  auto: [
    "https://images.unsplash.com/photo-1625225233840-695456021cdc?auto=format&fit=crop&w=1200&h=600&q=80",
    "https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&w=1200&h=600&q=80",
    "https://images.unsplash.com/photo-1597007030739-6d2e7172f235?auto=format&fit=crop&w=1200&h=600&q=80",
  ],
};

export const CATEGORY_META: Record<
  ServiceCategory,
  { label: string; tagline: string; route: string }
> = {
  taxi: { label: "Taxi", tagline: "City cabs, airport rides & luxury rideshare.", route: "/taxi" },
  bus: { label: "Bus", tagline: "Sleeper buses, terminals & highway coaches.", route: "/bus" },
  flight: { label: "Flights", tagline: "Airports, cabins & seamless departures.", route: "/flights" },
  hotel: { label: "Hotels", tagline: "Luxury rooms, resorts & modern lobbies.", route: "/hotels" },
  bikePooling: {
    label: "Bike pooling",
    tagline: "Urban commuters, helmets & electric bikes.",
    route: "/bike-pooling",
  },
  auto: { label: "Auto", tagline: "Auto-rickshaws, metro pickups & street mobility.", route: "/auto" },
};
