import type { PaymentMethodDefinition, PaymentMethodId } from "./types";

/**
 * Extensible payment-method registry.
 *
 * To add a method (Apple Pay, Klarna, crypto, …):
 *  1. Extend `PaymentMethodId` in types.ts
 *  2. Push a definition here
 *  3. Render a details panel in CheckoutPayment
 *  4. Handle the charge in mockGateway.processPayment (or Stripe PM types)
 *
 * Stripe equivalent: `payment_method_types: ['card', 'klarna', ...]`
 */
export const PAYMENT_METHODS: PaymentMethodDefinition[] = [
  {
    id: "card",
    label: "کارت بانکی",
    description: "ویزا، مسترکارت و شتاب — رمزنگاری‌شده",
    badge: "پیشنهادی",
  },
  {
    id: "wallet",
    label: "کیف پول دیجیتال",
    description: "پرداخت آنی از نوا پی یا کارت هدیه",
  },
  {
    id: "cod",
    label: "پرداخت در محل",
    description: "نقد یا کارت‌خوان هنگام تحویل سفارش",
  },
];

export function getPaymentMethod(id: PaymentMethodId): PaymentMethodDefinition | undefined {
  return PAYMENT_METHODS.find((method) => method.id === id);
}
