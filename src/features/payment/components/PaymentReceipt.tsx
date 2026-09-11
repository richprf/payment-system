"use client";

import { Printer } from "lucide-react";
import Link from "next/link";
import type { Transaction } from "../types";
import { formatDateFa, formatToman } from "../utils/format";
import { getPaymentMethod } from "../registry";
import { brandLabel } from "../utils/cardType";

interface PaymentReceiptProps {
  transaction: Transaction;
}

export function PaymentReceipt({ transaction }: PaymentReceiptProps) {
  const method = getPaymentMethod(transaction.method);
  const pending = transaction.status === "pending_cod";

  return (
    <article className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm print:border-0 print:shadow-none sm:p-10">
      <header className="flex items-start justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Nova Store
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">رسید پرداخت</h1>
          <p className="mt-1 text-sm text-slate-500">
            {pending ? "سفارش ثبت شد — پرداخت هنگام تحویل" : "پرداخت با موفقیت تایید شد"}
          </p>
        </div>
        <div className="no-print flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Printer className="h-4 w-4" />
            چاپ / PDF
          </button>
        </div>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <Meta label="شماره پیگیری" value={transaction.trackingNumber} ltr />
        <Meta label="شناسه تراکنش" value={transaction.id} ltr />
        <Meta label="تاریخ" value={formatDateFa(transaction.createdAt)} />
        <Meta label="روش پرداخت" value={method?.label ?? transaction.method} />
        {transaction.paymentMask ? (
          <Meta
            label="کارت"
            value={`${transaction.cardBrand ? brandLabel(transaction.cardBrand) + " · " : ""}${transaction.paymentMask}`}
            ltr
          />
        ) : null}
        {transaction.walletName ? <Meta label="کیف پول" value={transaction.walletName} /> : null}
      </section>

      <table className="mt-8 w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="py-2 text-right font-medium">کالا</th>
            <th className="py-2 text-center font-medium">تعداد</th>
            <th className="py-2 text-left font-medium">مبلغ</th>
          </tr>
        </thead>
        <tbody>
          {transaction.items.map((item) => (
            <tr key={item.id} className="border-b border-slate-100">
              <td className="py-3 text-slate-800">{item.name}</td>
              <td className="py-3 text-center text-slate-600">{item.quantity}</td>
              <td className="py-3 text-left text-slate-800">
                {formatToman(item.unitPrice * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="mt-6 space-y-2 text-sm">
        <div className="flex justify-between text-slate-600">
          <dt>جمع جزء</dt>
          <dd>{formatToman(transaction.pricing.subtotal)}</dd>
        </div>
        {transaction.pricing.discount > 0 ? (
          <div className="flex justify-between text-emerald-700">
            <dt>{transaction.pricing.discountLabel ?? "تخفیف"}</dt>
            <dd>− {formatToman(transaction.pricing.discount)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between text-slate-600">
          <dt>ارسال</dt>
          <dd>
            {transaction.pricing.shippingWasFree
              ? "رایگان"
              : formatToman(transaction.pricing.shipping)}
          </dd>
        </div>
        <div className="flex justify-between text-slate-600">
          <dt>مالیات</dt>
          <dd>{formatToman(transaction.pricing.tax)}</dd>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
          <dt>جمع کل</dt>
          <dd>{formatToman(transaction.amount)}</dd>
        </div>
      </dl>

      <p className="mt-8 text-xs leading-6 text-slate-400">
        این رسید توسط ماژول پرداخت شبیه‌سازی‌شده نوا صادر شده است و ارزش بانکی ندارد. در اتصال به Stripe، شماره پیگیری همان PaymentIntent id (pi_…) خواهد بود.
      </p>

      <div className="no-print mt-6">
        <Link href="/orders" className="text-sm font-medium text-indigo-600 hover:underline">
          بازگشت به تاریخچه سفارش‌ها
        </Link>
      </div>
    </article>
  );
}

function Meta({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-900" dir={ltr ? "ltr" : undefined}>
        {value}
      </p>
    </div>
  );
}
