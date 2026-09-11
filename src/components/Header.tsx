"use client";

import Link from "next/link";
import { ShoppingBag, Receipt } from "lucide-react";
import { useCart } from "@/features/cart/cart-context";

export function Header() {
  const { count, hydrated } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
            N
          </span>
          <span>
            <span className="block text-sm font-bold text-slate-900">نوا استور</span>
            <span className="block text-[11px] text-slate-500">پرداخت امن شبیه‌سازی‌شده</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            <Receipt className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">سفارش‌ها</span>
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            سبد
            {hydrated && count > 0 ? (
              <span className="absolute -left-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px]">
                {count}
              </span>
            ) : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}
