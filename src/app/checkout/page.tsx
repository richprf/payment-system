"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/features/cart/cart-context";
import { CheckoutPayment } from "@/features/payment";
import { PRODUCTS } from "@/data/products";
import type { CartItem } from "@/features/cart/types";

export default function CheckoutPage() {
  const { items, hydrated, add, clear } = useCart();
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const seeded = useRef(false);

  useEffect(() => {
    if (!hydrated) return;
    if (items.length === 0 && orderItems.length === 0 && !seeded.current) {
      seeded.current = true;
      add(PRODUCTS[0]);
      add(PRODUCTS[5]);
      return;
    }
    if (orderItems.length === 0 && items.length > 0) {
      setOrderItems(items);
    }
  }, [add, hydrated, items, orderItems.length]);

  const handlePaid = useCallback(() => {
    clear();
  }, [clear]);

  if (!hydrated || orderItems.length === 0) {
    return <p className="text-sm text-slate-500">در حال آماده‌سازی پرداخت…</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Checkout
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">پرداخت امن سفارش</h1>
        <p className="mt-1 text-sm text-slate-500">
          همه چیز mock است؛ از کارت‌های آزمایشی برای دیدن موفقیت، رد، موجودی ناکافی و تایم‌اوت استفاده کنید.
        </p>
        <p className="mt-2 text-xs text-slate-400">
          سبد خالی بود؟ یک سفارش نمونه برایتان چیده شد.{" "}
          <Link href="/cart" className="text-indigo-600 hover:underline">
            ویرایش سبد
          </Link>
        </p>
      </div>
      <CheckoutPayment items={orderItems} onPaid={handlePaid} />
    </div>
  );
}
