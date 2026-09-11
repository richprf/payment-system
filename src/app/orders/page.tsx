"use client";

import Link from "next/link";
import { useTransactions } from "@/features/payment";
import { formatDateFa, formatToman } from "@/features/payment/utils/format";
import { getPaymentMethod } from "@/features/payment/registry";

export default function OrdersPage() {
  const { transactions, hydrated } = useTransactions();

  if (!hydrated) {
    return <p className="text-sm text-slate-500">در حال خواندن تاریخچه…</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">تاریخچه سفارش‌ها</h1>
      <p className="mt-1 text-sm text-slate-500">
        تراکنش‌ها در localStorage مرورگر شما ذخیره شده‌اند.
      </p>

      {transactions.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-600">هنوز سفارشی ثبت نشده.</p>
          <Link href="/checkout" className="mt-4 inline-block text-sm font-medium text-indigo-600">
            شروع یک پرداخت آزمایشی
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {transactions.map((tx) => {
            const method = getPaymentMethod(tx.method);
            return (
              <li key={tx.id}>
                <Link
                  href={`/orders/${tx.id}`}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-900" dir="ltr">
                      {tx.trackingNumber}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDateFa(tx.createdAt)} · {method?.label} ·{" "}
                      {tx.status === "pending_cod"
                        ? "در انتظار پرداخت"
                        : tx.status === "paid"
                          ? "پرداخت‌شده"
                          : "ناموفق"}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{formatToman(tx.amount)}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
