"use client";

import { motion } from "framer-motion";
import type { CardBrand, CardFormValues } from "../types";
import { CardBrandIcon } from "./CardBrandIcon";
import { brandLabel } from "../utils/cardType";

interface CardPreviewProps {
  values: CardFormValues;
  brand: CardBrand;
  flipped: boolean;
}

const BRAND_GRADIENT: Record<CardBrand, string> = {
  visa: "from-indigo-700 via-blue-700 to-slate-900",
  mastercard: "from-neutral-800 via-orange-900 to-red-900",
  amex: "from-sky-800 via-cyan-800 to-slate-900",
  discover: "from-orange-700 via-amber-800 to-stone-900",
  unionpay: "from-red-800 via-blue-900 to-emerald-900",
  jcb: "from-blue-900 via-indigo-800 to-cyan-900",
  unknown: "from-slate-700 via-indigo-800 to-violet-900",
};

function displayNumber(number: string): string {
  const padded = (number.replace(/\s/g, "") + "••••••••••••••••").slice(0, 16);
  return padded.replace(/(.{4})/g, "$1 ").trim();
}

export function CardPreview({ values, brand, flipped }: CardPreviewProps) {
  return (
    <div className="mx-auto w-full max-w-sm" style={{ perspective: 1200 }}>
      <motion.div
        className="relative w-full"
        style={{ aspectRatio: "1.586 / 1", transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={`absolute inset-0 overflow-hidden rounded-2xl bg-linear-to-br p-5 text-white shadow-xl shadow-indigo-900/25 ${BRAND_GRADIENT[brand]}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          aria-hidden={flipped}
        >
          <div className="pointer-events-none absolute -left-10 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-8 h-44 w-44 rounded-full bg-fuchsia-400/20 blur-2xl" />

          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
                Nova Bank
              </p>
              <p className="mt-0.5 text-xs text-white/50">{brandLabel(brand)}</p>
            </div>
            <CardBrandIcon brand={brand} className="h-7 w-11 drop-shadow" />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <span className="h-8 w-11 rounded-md bg-linear-to-br from-amber-200 via-yellow-400 to-orange-500 shadow-inner" />
            <ContactlessIcon />
          </div>

          <p className="mt-6 font-mono text-lg tracking-[0.18em] sm:text-xl" dir="ltr">
            {displayNumber(values.number)}
          </p>

          <div className="mt-5 flex items-end justify-between gap-4 text-[11px] uppercase tracking-wider">
            <div className="min-w-0">
              <p className="text-[9px] text-white/50">Card Holder</p>
              <p className="truncate font-medium tracking-wide">
                {values.holderName || "نام دارنده"}
              </p>
            </div>
            <div dir="ltr">
              <p className="text-[9px] text-white/50">Expires</p>
              <p className="font-mono tracking-widest">{values.expiry || "MM/YY"}</p>
            </div>
          </div>
        </div>

        <div
          className={`absolute inset-0 overflow-hidden rounded-2xl bg-linear-to-br text-white shadow-xl ${BRAND_GRADIENT[brand]}`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          aria-hidden={!flipped}
        >
          <div className="mt-6 h-10 w-full bg-black/80" />
          <div className="mt-6 px-5">
            <div className="flex items-center justify-end gap-2 rounded bg-white/90 px-3 py-2 text-slate-900">
              <span className="text-[10px] uppercase tracking-wider text-slate-500">CVV</span>
              <span className="font-mono tracking-[0.3em]" dir="ltr">
                {values.cvv ? values.cvv.replace(/./g, "•") : "•••"}
              </span>
            </div>
            <p className="mt-4 text-[10px] leading-relaxed text-white/60">
              این کارت فقط برای نمایش است. در اتصال واقعی به Stripe، داده‌های حساس هرگز از iframe خارج نمی‌شوند.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ContactlessIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 text-white/80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M8 8c2.5 2 2.5 6 0 8" />
      <path d="M11 5.5c3.6 3 3.6 10 0 13" />
      <path d="M14 3c5 4.2 5 13.8 0 18" />
    </svg>
  );
}
