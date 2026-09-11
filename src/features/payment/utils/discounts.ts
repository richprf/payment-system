/**
 * Mock "catalog" of promo codes.
 *
 * STRIPE MIGRATION:
 * Replace with Stripe Coupons / Promotion Codes:
 *   stripe.promotionCodes.list({ code })
 * or your backend POST /api/discounts/validate
 */
export const MOCK_DISCOUNTS: Record<string, import("../types").DiscountCode> = {
  NOVA10: {
    code: "NOVA10",
    type: "percent",
    value: 10,
    label: "۱۰٪ تخفیف نوا",
  },
  WELCOME20: {
    code: "WELCOME20",
    type: "percent",
    value: 20,
    label: "۲۰٪ خوش‌آمدگویی",
  },
  FREESHIP: {
    code: "FREESHIP",
    type: "free_shipping",
    value: 0,
    label: "ارسال رایگان",
  },
  FLAT100: {
    code: "FLAT100",
    type: "flat",
    value: 100_000,
    label: "۱۰۰ هزار تومان تخفیف",
  },
};

export function lookupDiscount(raw: string) {
  const code = raw.trim().toUpperCase();
  return MOCK_DISCOUNTS[code] ?? null;
}
