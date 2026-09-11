"use client";

import { ShieldCheck, Truck } from "lucide-react";
import type { PricingBreakdown } from "../types";
import { formatToman } from "../utils/format";
import { DiscountCodeInput } from "./DiscountCodeInput";
import type { OrderLine } from "../types";

interface PaymentSummaryProps {
  items: OrderLine[];
  pricing: PricingBreakdown;
  discountInput: string;
  discountError: string | null;
  onDiscountInput: (value: string) => void;
  onApplyDiscount: () => void;
  onClearDiscount: () => void;
  locked?: boolean;
}

export function PaymentSummary({
  items,
  pricing,
  discountInput,
  discountError,
  onDiscountInput,
  onApplyDiscount,
  onClearDiscount,
  locked,
}: PaymentSummaryProps) {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
      <h2 className="text-base font-semibold text-slate-900">خلاصه سفارش</h2>
      <ul className="mt-4 divide-y divide-slate-100">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 py-3">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg"
              style={{
                background: `hsl(${item.imageHue ?? 250} 70% 93%)`,
              }}
              aria-hidden="true"
            >
              {productEmoji(item.name)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-slate-800">
                {item.name}
              </span>
              <span className="text-xs text-slate-500">× {item.quantity}</span>
            </span>
            <span className="text-sm text-slate-700">
              {formatToman(item.unitPrice * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <DiscountCodeInput
          value={discountInput}
          error={discountError}
          applied={pricing.discountCode}
          appliedLabel={pricing.discountLabel}
          disabled={locked}
          onChange={onDiscountInput}
          onApply={onApplyDiscount}
          onClear={onClearDiscount}
        />
      </div>

      <dl className="mt-5 space-y-2 text-sm">
        <Row label="جمع جزء" value={formatToman(pricing.subtotal)} />
        {pricing.discount > 0 ? (
          <Row
            label={pricing.discountLabel ?? "تخفیف"}
            value={`− ${formatToman(pricing.discount)}`}
            tone="good"
          />
        ) : null}
        <Row
          label="ارسال"
          value={
            pricing.shippingWasFree ? "رایگان" : formatToman(pricing.shipping)
          }
          tone={pricing.shippingWasFree ? "good" : "default"}
        />
        <Row label="مالیات ارزش افزوده (۹٪)" value={formatToman(pricing.tax)} />
        <div className="my-2 border-t border-dashed border-slate-200" />
        <Row label="مبلغ قابل پرداخت" value={formatToman(pricing.total)} strong />
      </dl>

      <div className="mt-5 flex items-start gap-2 rounded-2xl bg-emerald-50 px-3 py-2.5 text-xs text-emerald-800">
        <Truck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>سفارش‌های بالای ۲ میلیون تومان ارسال رایگان دارند.</p>
      </div>
      <div className="mt-2 flex items-start gap-2 rounded-2xl bg-indigo-50 px-3 py-2.5 text-xs text-indigo-800">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>پرداخت شما شبیه‌سازی‌شده است؛ هیچ مبلغ واقعی کسر نمی‌شود.</p>
      </div>
    </aside>
  );
}

function Row({
  label,
  value,
  tone = "default",
  strong,
}: {
  label: string;
  value: string;
  tone?: "default" | "good";
  strong?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-3 ${strong ? "text-base" : ""}`}>
      <dt className={strong ? "font-semibold text-slate-900" : "text-slate-500"}>{label}</dt>
      <dd
        className={
          tone === "good"
            ? "font-medium text-emerald-600"
            : strong
              ? "font-bold text-slate-900"
              : "text-slate-800"
        }
      >
        {value}
      </dd>
    </div>
  );
}

function productEmoji(name: string): string {
  if (name.includes("هدفون")) return "🎧";
  if (name.includes("ساعت")) return "⌚";
  if (name.includes("کوله")) return "🎒";
  if (name.includes("لامپ")) return "💡";
  if (name.includes("کیبورد")) return "⌨️";
  if (name.includes("اسپیکر")) return "🔊";
  return "🛍️";
}
