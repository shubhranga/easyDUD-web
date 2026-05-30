import { Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  steps: string[];
  currentStep: number; // 0-indexed
  children: ReactNode;
}

export function StepWizard({ steps, currentStep, children }: Props) {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <ol className="mb-10 flex items-center">
        {steps.map((label, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <li key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                    done
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : active
                      ? "border-indigo-600 bg-white text-indigo-600"
                      : "border-slate-300 bg-white text-slate-400"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span
                  className={`mt-2 text-[11px] font-medium uppercase tracking-wide ${
                    active || done ? "text-foreground" : "text-slate-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mx-2 mt-[-22px] h-0.5 flex-1 transition-colors ${
                    done ? "bg-indigo-600" : "bg-slate-200"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
