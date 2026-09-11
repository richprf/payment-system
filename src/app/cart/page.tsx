"use client";

import Link from "next/link";
import { useCart } from "@/features/cart/cart-context";
import { formatToman } from "@/features/payment/utils/format";
import { PRODUCTS } from "@/data/products";

export default function CartPage() {
  const { items, setQuantity, remove, subtotal, add, hydrated } = useCart();

  if (!hydrated) {
    return <p className="text-sm text-slate-500">در حال بارگذاری سبد…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h1 className="text-xl font-bold text-slate-900">سبد خرید خالی است</h1>
        <p className="mt-2 text-sm text-slate-500">
          برای تست سریع پرداخت، یک سبد نمونه اضافه کنید.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              add(PRODUCTS[0]);
              add(PRODUCTS[3]);
            }}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            افزودن سبد نمونه
          </button>
          <Link
            href="/"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_18rem]">
      <section className="rounded-3xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-bold text-slate-900">سبد خرید</h1>
        <ul className="mt-4 divide-y divide-slate-100">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-4">
              <span
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                style={{ background: `hsl(${item.imageHue ?? 240} 70% 93%)` }}
              >
                🛍️
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{item.name}</p>
                <p className="text-sm text-slate-500">{formatToman(item.unitPrice)}</p>
              </div>
              <label className="sr-only" htmlFor={`qty-${item.id}`}>
                تعداد {item.name}
              </label>
              <input
                id={`qty-${item.id}`}
                type="number"
                min={1}
                max={9}
                value={item.quantity}
                onChange={(event) => setQuantity(item.id, Number(event.target.value))}
                className="w-16 rounded-xl border border-slate-200 px-2 py-1.5 text-center text-sm"
              />
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="text-xs text-rose-600 hover:underline"
              >
                حذف
              </button>
            </li>
          ))}
        </ul>
      </section>
      <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-500">جمع جزء</p>
        <p className="mt-1 text-xl font-bold text-slate-900">{formatToman(subtotal)}</p>
        <p className="mt-2 text-xs text-slate-400">مالیات و ارسال در مرحله پرداخت محاسبه می‌شود.</p>
        <Link
          href="/checkout"
          className="mt-5 block rounded-xl bg-indigo-600 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-500"
        >
          ادامه به پرداخت
        </Link>
      </aside>
    </div>
  );
}
