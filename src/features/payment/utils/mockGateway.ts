/**
 * Simulated payment gateway.
 *
 * ---------------------------------------------------------------------------
 * HOW TO REPLACE THIS WITH STRIPE (or any real PSP)
 * ---------------------------------------------------------------------------
 * 1. NEVER send raw card numbers to your Next.js server. Use Stripe.js /
 *    Payment Element so PAN/CVV stay inside Stripe's PCI-DSS iframe.
 *
 * 2. Backend (Route Handler or dedicated API):
 *      const intent = await stripe.paymentIntents.create({
 *        amount: pricing.total,          // smallest currency unit
 *        currency: "irr",                // or usd / eur
 *        automatic_payment_methods: { enabled: true },
 *        metadata: { orderId },
 *      });
 *      return { clientSecret: intent.client_secret };
 *
 * 3. Frontend:
 *      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);
 *      const { error, paymentIntent } = await stripe.confirmPayment({
 *        elements,                       // from <Elements>
 *        clientSecret,
 *        confirmParams: { return_url: `${origin}/orders/complete` },
 *      });
 *
 * 4. Webhook (source of truth): listen to `payment_intent.succeeded` /
 *    `payment_intent.payment_failed` and persist the order. Do not trust
 *    the browser redirect alone.
 *
 * 5. Saved cards: Stripe SetupIntent + Customer.paymentMethods.list.
 *    LocalStorage is a DEMO ONLY stand-in and is not PCI compliant.
 *
 * Test PANs below intentionally mirror Stripe's documented test cards:
 *   https://stripe.com/docs/testing
 * ---------------------------------------------------------------------------
 */

import type {
  CardBrand,
  ChargeRequest,
  DeclineCode,
  PaymentOutcome,
  Transaction,
} from "../types";
import { detectCardBrand } from "./cardType";
import { generateId, generateTrackingNumber, maskCardNumber } from "./format";
import { digitsOnly } from "./luhn";
import { debitWallet, loadWallets } from "./storage";

const NETWORK_DELAY_MS = { min: 1400, max: 2400 };

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function jitter(): number {
  const { min, max } = NETWORK_DELAY_MS;
  return min + Math.floor(Math.random() * (max - min));
}

/**
 * Last-4 (or full PAN) maps onto a simulated acquirer response,
 * matching Stripe's public test card table.
 */
function outcomeFromPan(pan: string): {
  kind: "success" | "error" | "timeout";
  code?: DeclineCode;
  message?: string;
} {
  const digits = digitsOnly(pan);
  const last4 = digits.slice(-4);

  if (digits.startsWith("4000000000003220") || last4 === "3220") {
    return { kind: "timeout", message: "پاسخی از درگاه دریافت نشد. اتصال را بررسی کنید." };
  }
  if (digits.startsWith("4000000000009995") || last4 === "9995") {
    return {
      kind: "error",
      code: "insufficient_funds",
      message: "موجودی کارت کافی نیست.",
    };
  }
  if (digits.startsWith("4000000000000002") || last4 === "0002") {
    return {
      kind: "error",
      code: "card_declined",
      message: "بانک صادرکننده کارت را رد کرد.",
    };
  }
  if (digits.startsWith("4000000000000069") || last4 === "0069") {
    return {
      kind: "error",
      code: "expired_card",
      message: "تاریخ انقضای کارت گذشته است.",
    };
  }
  if (digits.startsWith("4000000000000127") || last4 === "0127") {
    return {
      kind: "error",
      code: "invalid_card",
      message: "کد CVV نادرست است.",
    };
  }
  if (last4 === "0000") {
    return {
      kind: "error",
      code: "processing_error",
      message: "خطای موقت در پردازش تراکنش. دوباره تلاش کنید.",
    };
  }

  return { kind: "success" };
}

function buildTransaction(
  request: ChargeRequest,
  status: Transaction["status"],
  extras: Partial<Transaction> = {},
): Transaction {
  const brand: CardBrand | undefined =
    request.card?.brand ??
    (request.card?.number ? detectCardBrand(request.card.number) : undefined);

  return {
    id: generateId("txn"),
    trackingNumber: generateTrackingNumber(),
    createdAt: new Date().toISOString(),
    amount: request.amount,
    currency: "IRT",
    method: request.method,
    status,
    items: request.items,
    pricing: request.pricing,
    paymentMask: request.card
      ? request.card.number
        ? maskCardNumber(request.card.number)
        : request.card.last4
          ? `•••• •••• •••• ${request.card.last4}`
          : undefined
      : undefined,
    cardBrand: brand,
    walletName: extras.walletName,
    ...extras,
  };
}

export async function processPayment(request: ChargeRequest): Promise<PaymentOutcome> {
  await sleep(jitter());

  if (request.method === "cod") {
    return {
      status: "success",
      transaction: buildTransaction(request, "pending_cod"),
    };
  }

  if (request.method === "wallet") {
    const wallets = loadWallets();
    const wallet = wallets.find((item) => item.id === request.walletId);
    if (!wallet) {
      return {
        status: "error",
        code: "processing_error",
        message: "کیف پول انتخاب‌شده پیدا نشد.",
      };
    }
    if (wallet.balance < request.amount) {
      return {
        status: "error",
        code: "wallet_insufficient",
        message: "موجودی کیف پول برای این سفارش کافی نیست.",
      };
    }
    debitWallet(wallet.id, request.amount);
    return {
      status: "success",
      transaction: buildTransaction(request, "paid", { walletName: wallet.name }),
    };
  }

  const pan = request.card?.number ?? request.card?.last4 ?? "";
  const result = outcomeFromPan(pan);

  if (result.kind === "timeout") {
    return {
      status: "timeout",
      message: result.message ?? "زمان اتصال به درگاه به پایان رسید.",
    };
  }

  if (result.kind === "error") {
    return {
      status: "error",
      code: result.code ?? "card_declined",
      message: result.message ?? "پرداخت ناموفق بود.",
    };
  }

  return {
    status: "success",
    transaction: buildTransaction(request, "paid"),
  };
}

export const TEST_CARDS = [
  {
    number: "4242 4242 4242 4242",
    label: "پرداخت موفق",
    hint: "هر تاریخ آینده + هر CVV سه‌رقمی",
  },
  {
    number: "4000 0000 0000 0002",
    label: "کارت رد شده",
    hint: "شبیه‌سازی generic_decline",
  },
  {
    number: "4000 0000 0000 9995",
    label: "موجودی ناکافی",
    hint: "insufficient_funds",
  },
  {
    number: "4000 0000 0000 0069",
    label: "کارت منقضی",
    hint: "expired_card",
  },
  {
    number: "4000 0000 0000 3220",
    label: "تایم‌اوت درگاه",
    hint: "هیچ پاسخی برنمی‌گردد",
  },
] as const;
