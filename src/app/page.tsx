import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-white sm:px-10 sm:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-300">
          Nova Payments
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
          چک‌اوت در سطح استرایپ، بدون درگاه واقعی
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
          کارت زنده با انیمیشن، اعتبارسنجی Luhn، کیف پول، پرداخت در محل، کد تخفیف، رسید قابل چاپ و تاریخچه تراکنش — همه شبیه‌سازی‌شده و آماده اتصال به Stripe.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/checkout"
            className="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold hover:bg-indigo-400"
          >
            رفتن به پرداخت
          </Link>
          <Link
            href="/cart"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium hover:bg-white/10"
          >
            مشاهده سبد
          </Link>
        </div>
      </section>

      <h2 className="mt-10 text-xl font-bold text-slate-900">محصولات منتخب</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
