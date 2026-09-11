"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Clock, Loader2, RotateCcw } from "lucide-react";
import Link from "next/link";
import type { PaymentOutcome } from "../types";
import { formatDateFa, formatToman } from "../utils/format";
import { getPaymentMethod } from "../registry";

interface PaymentStatusProps {
  outcome: PaymentOutcome | null;
  processing: boolean;
  onRetry: () => void;
}

export function PaymentStatus({ outcome, processing, onRetry }: PaymentStatusProps) {
  if (processing || !outcome) {
    return (
      <div
        className="flex flex-col items-center py-12 text-center"
        role="status"
        aria-live="polite"
      >
        <motion.div
          className="relative flex h-20 w-20 items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        >
          <span className="absolute inset-0 rounded-full border-4 border-indigo-100" />
          <span className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent" />
          <Loader2 className="h-7 w-7 text-indigo-600" aria-hidden="true" />
        </motion.div>
        <h2 className="mt-6 text-lg font-semibold text-slate-900">در حال اتصال به درگاه امن…</h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          تاخیر شبکه شبیه‌سازی شده است. در دنیای واقعی این مرحله confirmPayment در Stripe.js است.
        </p>
      </div>
    );
  }

  if (outcome.status === "success") {
    const tx = outcome.transaction;
    const method = getPaymentMethod(tx.method);
    const pending = tx.status === "pending_cod";
    return (
      <div className="text-center" role="status" aria-live="polite">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
            pending ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
          }`}
        >
          {pending ? <Clock className="h-8 w-8" /> : <CheckCircle2 className="h-8 w-8" />}
        </motion.div>
        <h2 className="mt-4 text-xl font-bold text-slate-900">
          {pending ? "سفارش با پرداخت در محل ثبت شد" : "پرداخت با موفقیت انجام شد"}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          رسید دیجیتال آماده است. جزئیات تراکنش در تاریخچه سفارش‌ها ذخیره شد.
        </p>

        <dl className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
          <Info label="شماره پیگیری" value={tx.trackingNumber} ltr />
          <Info label="شناسه تراکنش" value={tx.id} ltr />
          <Info label="تاریخ" value={formatDateFa(tx.createdAt)} />
          <Info label="مبلغ" value={formatToman(tx.amount)} />
          <Info label="روش پرداخت" value={method?.label ?? tx.method} />
          {tx.paymentMask ? <Info label="کارت" value={tx.paymentMask} ltr /> : null}
          {tx.walletName ? <Info label="کیف پول" value={tx.walletName} /> : null}
          <Info
            label="وضعیت"
            value={pending ? "در انتظار پرداخت هنگام تحویل" : "پرداخت‌شده"}
          />
        </dl>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <a
            href={`/orders/${tx.id}`}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            مشاهده و چاپ رسید
          </a>
          <a
            href="/orders"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            تاریخچه سفارش‌ها
          </a>
          <a
            href="/"
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-800"
          >
            بازگشت به فروشگاه
          </a>
        </div>
      </div>
    );
  }

  const isTimeout = outcome.status === "timeout";
  const message = outcome.message;

  return (
    <div className="text-center" role="alert" aria-live="assertive">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600"
      >
        <AlertTriangle className="h-8 w-8" />
      </motion.div>
      <h2 className="mt-4 text-xl font-bold text-slate-900">
        {isTimeout ? "زمان اتصال به پایان رسید" : "پرداخت ناموفق بود"}
      </h2>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
      <p className="mt-2 text-xs text-slate-400">
        در Stripe این حالت معادل payment_intent.payment_failed یا client-side timeout است.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        تلاش مجدد
      </button>
    </div>
  );
}

function Info({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800" dir={ltr ? "ltr" : undefined}>
        {value}
      </dd>
    </div>
  );
}
