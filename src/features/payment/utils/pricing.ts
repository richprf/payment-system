import type { DiscountCode, OrderLine, PricingBreakdown } from "../types";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, TAX_RATE } from "../types";

export function calculatePricing(
  items: OrderLine[],
  discount: DiscountCode | null,
): PricingBreakdown {
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  let shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  let shippingWasFree = shipping === 0;
  let discountAmount = 0;

  if (discount) {
    if (discount.type === "percent") {
      discountAmount = Math.round((subtotal * discount.value) / 100);
    } else if (discount.type === "flat") {
      discountAmount = Math.min(discount.value, subtotal);
    } else if (discount.type === "free_shipping") {
      shipping = 0;
      shippingWasFree = true;
    }
  }

  const taxable = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(taxable * TAX_RATE);
  const total = Math.max(0, taxable + tax + shipping);

  return {
    subtotal,
    discount: discountAmount,
    discountCode: discount?.code,
    discountLabel: discount?.label,
    shipping,
    shippingWasFree,
    tax,
    total,
  };
}
