import { Lock, ShieldCheck, BadgeCheck } from "lucide-react";

export function TrustBadges() {
  return (
    <div className="space-y-3">
      <p className="text-center text-xs text-slate-500">
        پرداخت شما در یک کانال امن شبیه‌سازی می‌شود. در نسخه واقعی، Stripe.js توکن‌سازی را داخل iframe مطابق PCI-DSS انجام می‌دهد.
      </p>
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <Badge icon={Lock} label="SSL Secure" />
        <Badge icon={ShieldCheck} label="PCI-DSS" />
        <Badge icon={BadgeCheck} label="3-D Secure" />
      </ul>
    </div>
  );
}

function Badge({
  icon: Icon,
  label,
}: {
  icon: typeof Lock;
  label: string;
}) {
  return (
    <li className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600">
      <Icon className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
      {label}
    </li>
  );
}
