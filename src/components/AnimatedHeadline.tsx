import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface AnimatedHeadlineProps {
  prefix?: string;
  suffix?: string;
  words?: string[];
  intervalMs?: number;
}

export function AnimatedHeadline({
  prefix = "Ride smarter where every trip feels",
  suffix = "....",
  words,
  intervalMs = 2000,
}: AnimatedHeadlineProps) {
  const list = useMemo(
    () => words ?? ["effortless", "efficient", "safer", "seamless", "stress-free"],
    [words],
  );
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = setTimeout(
      () => setIndex((p) => (p + 1) % list.length),
      intervalMs,
    );
    return () => clearTimeout(id);
  }, [index, list, intervalMs]);

  return (
    <h1 className="text-[44px] md:text-[56px] lg:text-[64px] font-light leading-[1.05] tracking-tight text-foreground/90">
      {prefix}{" "}
      <span className="relative inline-block align-baseline">
        <AnimatePresence mode="wait">
          <motion.span
            key={list[index]}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={
              reduce
                ? { opacity: 1, backgroundPosition: "100% 50%" }
                : {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }
            }
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -24, filter: "blur(6px)" }}
            transition={{
              opacity: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              y: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              filter: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              backgroundPosition: { duration: 6, ease: "linear", repeat: Infinity },
            }}
            style={{
              backgroundImage:
                "linear-gradient(90deg, hsl(217 91% 60%), hsl(239 84% 67%), hsl(271 91% 65%), hsl(239 84% 67%), hsl(217 91% 60%))",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              willChange: "transform, opacity, background-position",
            }}
            className="inline-block italic font-normal"
          >
            {list[index]}
          </motion.span>
        </AnimatePresence>
      </span>
      {suffix}
    </h1>
  );
}
