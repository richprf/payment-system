# نوا استور — سیستم پرداخت شبیه‌سازی‌شده

فروشگاه دموی **Next.js (App Router)** با یک ماژول پرداخت کامل در `src/features/payment`. از نظر UI/UX، اعتبارسنجی و جریان کار شبیه Stripe Checkout / Shopify Payments است، اما **هیچ درگاه واقعی، بک‌اند یا مبلغ بانکی‌ای در کار نیست**. همه چیز روی کلاینت و `localStorage` اجرا می‌شود.

```bash
npm install
npm run dev
```

سپس [http://localhost:3000](http://localhost:3000) را باز کنید، محصولی به سبد اضافه کنید و به `/checkout` بروید. اگر سبد خالی باشد، چک‌اوت یک سفارش نمونه می‌سازد.

---

## چه چیزهایی mock هستند؟

| بخش | رفتار فعلی (دمو) | جایگزین واقعی |
| --- | --- | --- |
| شارژ کارت / کیف پول | `processPayment()` با `setTimeout` | Stripe PaymentIntent + Stripe.js `confirmPayment` |
| شماره کارت، CVV، انقضا | در مرورگر اعتبارسنجی و ارسال می‌شوند | Stripe Elements / Payment Element (PCI iframe) — PAN هرگز به سرور شما نرسد |
| ذخیره کارت | توکن ساختگی در `localStorage` | Stripe Customer + SetupIntent + `paymentMethods.list` |
| موجودی کیف پول | عدد ثابت در `localStorage` | سرویس wallet داخلی یا PSP |
| پرداخت در محل | ثبت سفارش با وضعیت `pending_cod` | سیستم سفارش/ناوگان شما؛ معمولاً PaymentIntent ندارد |
| کد تخفیف | کاتالوگ ثابت `NOVA10` و … | Stripe Coupons / Promotion Codes یا API خودتان |
| مالیات ۹٪ و هزینه ارسال | فرمول ثابت در `pricing.ts` | موتور مالیاتی / نرخ ارسال واقعی |
| تاریخچه و رسید | `localStorage` + چاپ مرورگر (Save as PDF) | دیتابیس سفارش + وب‌هوک `payment_intent.succeeded` |
| SSL / PCI-DSS badges | صرفاً نمایشی | گواهی TLS واقعی + SAQ/PCI از Stripe |

فایل راهنمای مهاجرت همان `src/features/payment/utils/mockGateway.ts` است؛ کامنت بالای آن قدم‌به‌قدم اتصال به Stripe را توضیح می‌دهد.

---

## کارت‌های آزمایشی

مثل [Stripe test cards](https://docs.stripe.com/testing):

| شماره | نتیجه |
| --- | --- |
| `4242 4242 4242 4242` | موفق |
| `4000 0000 0000 0002` | کارت رد شده |
| `4000 0000 0000 9995` | موجودی ناکافی |
| `4000 0000 0000 0069` | کارت منقضی |
| `4000 0000 0000 3220` | تایم‌اوت درگاه |

هر تاریخ آینده (مثلاً `12/28`) و هر CVV سه‌رقمی معتبر است. الگوریتم Luhn روی شماره کارت اجرا می‌شود.

کدهای تخفیف: `NOVA10` (۱۰٪)، `WELCOME20` (۲۰٪)، `FREESHIP` (ارسال رایگان)، `FLAT100` (۱۰۰ هزار تومان).

کیف پول «کارت هدیه» موجودی کمی دارد تا سناریوی عدم‌کفایت را ببینید.

---

## معماری ماژول پرداخت

```
src/features/payment/
  components/     CardInput, CardPreview, PaymentMethodSelector,
                  PaymentSummary, PaymentStatus, CheckoutPayment, …
  hooks/          usePaymentFlow, useCardValidation, useSavedCards, …
  machine/        useReducer state machine
                  idle → method → details → review → processing → success|error|timeout
  schemas/        Zod (Luhn، انقضا، طول CVV بر اساس برند)
  utils/          luhn, cardType, format, pricing, mockGateway, storage
  registry.ts     افزودن روش پرداخت جدید (extensible)
  types.ts
```

کامپوننت‌های reusable از `@/features/payment` export می‌شوند:

- `CardInput`
- `PaymentMethodSelector`
- `PaymentSummary`
- `PaymentStatus`
- `CheckoutPayment`

برای افزودن روش جدید (مثلاً Apple Pay): `PaymentMethodId` را گسترش دهید، آیتم را در `registry.ts` ثبت کنید، پنل جزئیات را در `CheckoutPayment` بگذارید و شاخه شارژ را در `mockGateway` (یا Stripe `payment_method_types`) اضافه کنید.

---

## امنیت (ظاهری در دمو / واقعی در پروداکشن)

دمو: ماسک `•••• •••• •••• 4242`، ذخیرهٔ last4 بدون CVV، پیام‌ها و badgeهای اعتماد.

پروداکشن: هرگز PAN/CVV را در Next.js Route Handler لاگ یا ذخیره نکنید. منبع حقیقت سفارش، وب‌هوک Stripe است نه ریدایرکت مرورگر.

---

## مسیرها

- `/` فروشگاه
- `/cart` سبد
- `/checkout` جریان پرداخت
- `/orders` تاریخچه
- `/orders/[id]` رسید قابل چاپ / PDF
