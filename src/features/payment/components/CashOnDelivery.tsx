import { MapPin, Banknote } from "lucide-react";

export function CashOnDelivery() {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-amber-50/60 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
          <Banknote className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-semibold text-slate-900">پرداخت هنگام تحویل</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            سفارش ثبت می‌شود و مبلغ را نقدی یا با کارت‌خوان پیک پرداخت می‌کنید. تا زمان تحویل، تراکنش در وضعیت «در انتظار پرداخت» باقی می‌ماند.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-2 text-xs text-slate-600">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>
          در اتصال واقعی به درگاه، این روش معادل Stripe است نیست — معمولاً با ماژول سفارش و ناوگان ارسال خودتان پیاده می‌شود و PaymentIntent ساخته نمی‌شود.
        </p>
      </div>
    </div>
  );
}
