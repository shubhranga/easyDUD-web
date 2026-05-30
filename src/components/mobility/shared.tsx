import { motion, type HTMLMotionProps } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export const FONT_SANS = "'DM Sans', system-ui, -apple-system, sans-serif";
export const FONT_SERIF = "'DM Serif Display', Georgia, serif";

export const COLORS = {
  bg: "#F7F8FC",
  surface: "#FFFFFF",
  ink: "#0B1020",
  inkMuted: "rgba(11,16,32,0.62)",
  inkSoft: "rgba(11,16,32,0.45)",
  hairline: "rgba(11,16,32,0.06)",
  blue: "#2563EB",
  blueLight: "#60A5FA",
  blueGlow: "rgba(37,99,235,0.18)",
  warm: "rgba(252,165,128,0.25)",
};

export const GRADIENTS = {
  primary: "linear-gradient(135deg,#2563EB 0%,#60A5FA 100%)",
  primarySoft: "linear-gradient(135deg, rgba(37,99,235,0.10), rgba(96,165,250,0.05))",
  mesh:
    "radial-gradient(60% 50% at 15% 15%, rgba(96,165,250,0.35), transparent 60%),radial-gradient(50% 60% at 90% 10%, rgba(167,139,250,0.28), transparent 60%),radial-gradient(60% 60% at 80% 95%, rgba(252,165,128,0.22), transparent 60%),linear-gradient(180deg,#F7F8FC, #EEF2FA)",
  meshBike:
    "radial-gradient(55% 50% at 10% 10%, rgba(34,211,238,0.32), transparent 60%),radial-gradient(50% 55% at 90% 20%, rgba(132,204,22,0.28), transparent 60%),radial-gradient(60% 60% at 70% 95%, rgba(250,204,21,0.22), transparent 60%),linear-gradient(180deg,#F6FBF7,#EFF6F1)",
};

export const SHADOWS = {
  soft: "0 10px 30px rgba(15,23,42,0.06)",
  card: "0 20px 60px rgba(15,23,42,0.08), 0 2px 6px rgba(15,23,42,0.04)",
  glow: "0 18px 50px rgba(37,99,235,0.28)",
  glowBike: "0 18px 50px rgba(34,197,94,0.25)",
  ring: "0 0 0 1px rgba(11,16,32,0.05)",
};

export const RADII = { sm: 14, md: 20, lg: 28, xl: 32, pill: 999 };

export function GlassCard({
  children,
  style,
  padding = 24,
  ...rest
}: HTMLMotionProps<"div"> & { padding?: number }) {
  return (
    <motion.div
      {...rest}
      style={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
        border: "1px solid rgba(255,255,255,0.6)",
        borderRadius: RADII.lg,
        boxShadow: SHADOWS.card,
        padding,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

export function FloatingBadge({
  icon: Icon,
  label,
  tone = "blue",
  style,
}: {
  icon?: LucideIcon;
  label: ReactNode;
  tone?: "blue" | "green" | "neutral";
  style?: CSSProperties;
}) {
  const palette = {
    blue: { bg: "rgba(37,99,235,0.10)", fg: "#1d4ed8", dot: "#2563EB" },
    green: { bg: "rgba(34,197,94,0.12)", fg: "#15803d", dot: "#22c55e" },
    neutral: { bg: "rgba(11,16,32,0.06)", fg: "#0B1020", dot: "#0B1020" },
  }[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        borderRadius: RADII.pill,
        background: palette.bg,
        color: palette.fg,
        fontFamily: FONT_SANS,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "-0.01em",
        ...style,
      }}
    >
      {Icon ? (
        <Icon size={14} strokeWidth={2.4} />
      ) : (
        <motion.span
          style={{ width: 8, height: 8, borderRadius: 999, background: palette.dot }}
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      )}
      {label}
    </span>
  );
}

export function GradientButton({
  children,
  onClick,
  tone = "blue",
  full,
  icon: Icon,
  type = "button",
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: "blue" | "green" | "dark";
  full?: boolean;
  icon?: LucideIcon;
  type?: "button" | "submit";
  style?: CSSProperties;
}) {
  const bg =
    tone === "green"
      ? "linear-gradient(135deg,#16a34a,#84cc16)"
      : tone === "dark"
        ? "linear-gradient(135deg,#0B1020,#1e293b)"
        : GRADIENTS.primary;
  const shadow = tone === "green" ? SHADOWS.glowBike : SHADOWS.glow;
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ y: -2, boxShadow: shadow }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 360, damping: 22 }}
      style={{
        background: bg,
        color: "#fff",
        border: "none",
        borderRadius: RADII.pill,
        padding: "14px 22px",
        fontFamily: FONT_SANS,
        fontWeight: 600,
        fontSize: 15,
        letterSpacing: "-0.01em",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        width: full ? "100%" : "auto",
        boxShadow: "0 10px 24px rgba(37,99,235,0.20)",
        ...style,
      }}
    >
      {children}
      {Icon ? <Icon size={18} strokeWidth={2.2} /> : null}
    </motion.button>
  );
}

export function AnimatedInput({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon?: LucideIcon;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 16px",
        background: "#fff",
        border: `1px solid ${COLORS.hairline}`,
        borderRadius: RADII.md,
        transition: "border-color 200ms, box-shadow 200ms",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = COLORS.blue;
        e.currentTarget.style.boxShadow = `0 0 0 4px ${COLORS.blueGlow}`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = COLORS.hairline;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {Icon ? <Icon size={18} color={COLORS.blue} strokeWidth={2.2} /> : null}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: 11,
            fontWeight: 600,
            color: COLORS.inkSoft,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {label}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: FONT_SANS,
            fontSize: 15,
            fontWeight: 500,
            color: COLORS.ink,
            padding: "2px 0",
            width: "100%",
          }}
        />
      </div>
    </label>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div style={{ textAlign: align, maxWidth: 720, margin: align === "center" ? "0 auto" : undefined }}>
      {eyebrow ? (
        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: COLORS.blue,
          }}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2
        style={{
          fontFamily: FONT_SERIF,
          fontSize: "clamp(28px, 4vw, 44px)",
          lineHeight: 1.08,
          margin: "10px 0 0",
          color: COLORS.ink,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          style={{
            margin: "12px 0 0",
            fontFamily: FONT_SANS,
            fontSize: 16,
            color: COLORS.inkMuted,
            lineHeight: 1.55,
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function AnimatedMap({ tone = "blue" }: { tone?: "blue" | "green" }) {
  const stroke = tone === "blue" ? "#2563EB" : "#16a34a";
  const soft = tone === "blue" ? "rgba(37,99,235,0.18)" : "rgba(22,163,74,0.18)";
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 280,
        borderRadius: RADII.lg,
        overflow: "hidden",
        background:
          tone === "blue"
            ? "linear-gradient(135deg,#EEF4FF,#F8FAFF)"
            : "linear-gradient(135deg,#F0FAF1,#FAFFF6)",
      }}
    >
      <svg viewBox="0 0 400 300" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke={soft} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#grid)" />
        <motion.path
          d="M 40 240 C 120 220, 140 120, 220 110 S 340 70, 370 50"
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="6 8"
          initial={{ strokeDashoffset: 200 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <circle cx="40" cy="240" r="8" fill={stroke} />
        <circle cx="40" cy="240" r="14" fill={stroke} opacity="0.25">
          <animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="370" cy="50" r="8" fill={stroke} />
      </svg>
    </div>
  );
}
