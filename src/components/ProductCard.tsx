"use client";

import { useCart } from "@/features/cart/cart-context";
import type { Product } from "@/data/products";
import { formatToman } from "@/features/payment/utils/format";
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <article className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div
        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl"
        style={{
          background: `linear-gradient(145deg, hsl(${product.hue} 80% 92%), hsl(${product.hue} 60% 78%))`,
        }}
      >
        {product.badge ? (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
            {product.badge}
          </span>
        ) : null}
        <span className="text-6xl transition group-hover:scale-110" aria-hidden="true">
          {emojiFor(product.name)}
        </span>
      </div>
      <h2 className="mt-4 text-base font-semibold text-slate-900">{product.name}</h2>
      <p className="mt-1 flex-1 text-sm leading-6 text-slate-500">{product.description}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-900">{formatToman(product.price)}</p>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
        >
          {added ? "اضافه شد" : "افزودن به سبد"}
        </button>
      </div>
    </article>
  );
}

function emojiFor(name: string): string {
  if (name.includes("هدفون")) return "🎧";
  if (name.includes("ساعت")) return "⌚";
  if (name.includes("کوله")) return "🎒";
  if (name.includes("لامپ")) return "💡";
  if (name.includes("کیبورد")) return "⌨️";
  if (name.includes("اسپیکر")) return "🔊";
  return "🛍️";
}
