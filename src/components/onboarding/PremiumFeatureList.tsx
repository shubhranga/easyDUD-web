import {
  Eye,
  CalendarCheck,
  Globe,
  BarChart2,
  CreditCard,
  CalendarDays,
  Handshake,
  type LucideIcon,
} from "lucide-react";

const features: { icon: LucideIcon; label: string }[] = [
  { icon: Eye, label: "Visibility Management" },
  { icon: CalendarCheck, label: "Booking Engine" },
  { icon: Globe, label: "Website Building" },
  { icon: BarChart2, label: "Analytical Reports" },
  { icon: CreditCard, label: "Payment Gateway" },
  { icon: CalendarDays, label: "365-Day Occupancy Control" },
  { icon: Handshake, label: "Partner & B2B Handling" },
];

export function PremiumFeatureList() {
  return (
    <ul className="my-6 space-y-3">
      {features.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-3 text-sm text-foreground/80">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Icon className="h-4 w-4" />
          </span>
          {label}
        </li>
      ))}
    </ul>
  );
}
