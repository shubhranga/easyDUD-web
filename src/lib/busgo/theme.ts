// BusGo design tokens — red/white scheme, scoped to /bus pages.
export const BUSGO_RED = "#D84040";
export const BUSGO_RED_DARK = "#B83333";
export const BUSGO_GOVT_BLUE = "#1E3A8A";

export const STATE_RTCS = [
  { code: "MSRTC", name: "Maharashtra (MSRTC)" },
  { code: "KSRTC", name: "Karnataka (KSRTC)" },
  { code: "GSRTC", name: "Gujarat (GSRTC)" },
  { code: "UPSRTC", name: "Uttar Pradesh (UPSRTC)" },
  { code: "TSRTC", name: "Telangana (TSRTC)" },
  { code: "HRTC", name: "Himachal (HRTC)" },
  { code: "RSRTC", name: "Rajasthan (RSRTC)" },
  { code: "ASTC", name: "Assam (ASTC)" },
] as const;

export const POPULAR_ROUTES = [
  { from: "Mumbai", to: "Pune", price: 320 },
  { from: "Mumbai", to: "Goa", price: 850 },
  { from: "Bangalore", to: "Chennai", price: 750 },
  { from: "Delhi", to: "Jaipur", price: 480 },
  { from: "Hyderabad", to: "Vijayawada", price: 520 },
  { from: "Pune", to: "Nagpur", price: 950 },
  { from: "Delhi", to: "Agra", price: 450 },
] as const;

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const formatDateIN = (d: Date | string) => {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export const minsToHrs = (m: number) => {
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h}h ${r}m` : `${h}h`;
};

export const generatePNR = () =>
  "BUS" + Math.random().toString(36).slice(2, 6).toUpperCase() + Math.floor(Math.random() * 9000 + 1000);
