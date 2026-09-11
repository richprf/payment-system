"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { PaymentReceipt, useTransactions } from "@/features/payment";

export default function OrderReceiptPage() {
  const params = useParams<{ id: string }>();
  const { transactions, hydrated } = useTransactions();
  const tx = transactions.find((item) => item.id === params.id);

  if (!hydrated) {
    return <p className="text-sm text-slate-500">در حال بارگذاری رسید…</p>;
  }

  if (!tx) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
        <h1 className="text-xl font-bold">رسید پیدا نشد</h1>
        <p className="mt-2 text-sm text-slate-500">
          این تراکنش در این مرورگر ذخیره نشده است.
        </p>
        <Link href="/orders" className="mt-4 inline-block text-sm text-indigo-600">
          تاریخچه سفارش‌ها
        </Link>
      </div>
    );
  }

  return <PaymentReceipt transaction={tx} />;
}
