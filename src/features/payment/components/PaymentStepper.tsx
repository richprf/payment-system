"use client";

import { Check } from "lucide-react";
import type { PaymentStep } from "../types";
import { cn } from "@/lib/cn";

const STEPS: { id: PaymentStep; label: string }[] = [
  { id: "method", label: "روش پرداخت" },
  { id: "details", label: "اطلاعات" },
  { id: "review", label: "بررسی" },
  { id: "result", label: "نتیجه" },
];

interface PaymentStepperProps {
  current: PaymentStep;
  onJump?: (step: PaymentStep) => void;
}

export function PaymentStepper({ current, onJump }: PaymentStepperProps) {
  const visual = current === "processing" ? "review" : current;
  const currentIndex = STEPS.findIndex((step) => step.id === visual);

  return (
    <ol className="flex items-center gap-2" aria-label="مراحل پرداخت">
      {STEPS.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        const clickable = Boolean(onJump) && (done || active);
        return (
          <li key={step.id} className="flex min-w-0 flex-1 items-center gap-2">
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onJump?.(step.id)}
              className={cn(
                "flex min-w-0 items-center gap-2 rounded-full px-1 py-1 text-xs sm:text-sm",
                clickable && "hover:bg-slate-100",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              )}
              aria-current={active ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                  done && "bg-emerald-500 text-white",
                  active && "bg-indigo-600 text-white",
                  !done && !active && "bg-slate-200 text-slate-500",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : index + 1}
              </span>
              <span
                className={cn(
                  "hidden truncate sm:inline",
                  active ? "font-semibold text-slate-900" : "text-slate-500",
                )}
              >
                {step.label}
              </span>
            </button>
            {index < STEPS.length - 1 ? (
              <span
                className={cn(
                  "h-0.5 flex-1 rounded-full",
                  index < currentIndex ? "bg-emerald-400" : "bg-slate-200",
                )}
                aria-hidden="true"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
