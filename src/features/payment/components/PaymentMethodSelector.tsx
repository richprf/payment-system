"use client";

import { CreditCard, Landmark, Wallet } from "lucide-react";
import type { PaymentMethodId } from "../types";
import { PAYMENT_METHODS } from "../registry";
import { cn } from "@/lib/cn";

interface PaymentMethodSelectorProps {
  value: PaymentMethodId | null;
  onChange: (id: PaymentMethodId) => void;
  disabled?: boolean;
}

const ICONS: Record<PaymentMethodId, typeof CreditCard> = {
  card: CreditCard,
  wallet: Wallet,
  cod: Landmark,
};

export function PaymentMethodSelector({
  value,
  onChange,
  disabled,
}: PaymentMethodSelectorProps) {
  return (
    <fieldset disabled={disabled} className="space-y-3">
      <legend className="text-sm font-semibold text-slate-800">روش پرداخت را انتخاب کنید</legend>
      <div className="grid gap-3" role="radiogroup" aria-label="روش‌های پرداخت">
        {PAYMENT_METHODS.map((method) => {
          const selected = value === method.id;
          const Icon = ICONS[method.id];
          return (
            <button
              key={method.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(method.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border p-4 text-right transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                selected
                  ? "border-indigo-500 bg-indigo-50 shadow-sm ring-1 ring-indigo-500"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                  selected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600",
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="font-medium text-slate-900">{method.label}</span>
                  {method.badge ? (
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                      {method.badge}
                    </span>
                  ) : null}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">{method.description}</span>
              </span>
              <span
                className={cn(
                  "h-4 w-4 shrink-0 rounded-full border-2",
                  selected ? "border-indigo-600 bg-indigo-600" : "border-slate-300",
                )}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
