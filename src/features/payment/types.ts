/**
 * Payment domain types.
 *
 * STRIPE MIGRATION:
 * These types are intentionally close to PaymentIntent / PaymentMethod shapes.
 * When you switch to a real gateway, keep this public contract and swap the
 * mock gateway implementation — UI components should not need to change.
 */

export type PaymentMethodId = "card" | "wallet" | "cod";

export type CardBrand =
  | "visa"
  | "mastercard"
  | "amex"
  | "discover"
  | "unionpay"
  | "jcb"
  | "unknown";

export type PaymentStep =
  | "method"
  | "details"
  | "review"
  | "processing"
  | "result";

export type PaymentPhase = "idle" | "processing" | "success" | "error" | "timeout";

export type DeclineCode =
  | "insufficient_funds"
  | "card_declined"
  | "expired_card"
  | "invalid_card"
  | "processing_error"
  | "timeout"
  | "wallet_insufficient";

export interface CardFormValues {
  holderName: string;
  number: string;
  expiry: string;
  cvv: string;
  saveCard: boolean;
}

export interface SavedCard {
  id: string;
  brand: CardBrand;
  last4: string;
  expiry: string;
  holderName: string;
  /**
   * Opaque token. In production this is a Stripe PaymentMethod id (pm_xxx).
   * Never persist PAN or CVV — the mock stores only last4 + a fake token.
   */
  token: string;
  createdAt: string;
}

export interface WalletAccount {
  id: string;
  name: string;
  subtitle: string;
  balance: number;
}

export interface OrderLine {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  imageHue?: number;
}

export type DiscountType = "percent" | "flat" | "free_shipping";

export interface DiscountCode {
  code: string;
  type: DiscountType;
  value: number;
  label: string;
}

export interface PricingBreakdown {
  subtotal: number;
  discount: number;
  discountCode?: string;
  discountLabel?: string;
  shipping: number;
  shippingWasFree: boolean;
  tax: number;
  total: number;
}

export type TransactionStatus = "paid" | "pending_cod" | "failed";

export interface Transaction {
  id: string;
  trackingNumber: string;
  createdAt: string;
  amount: number;
  currency: "IRT";
  method: PaymentMethodId;
  status: TransactionStatus;
  items: OrderLine[];
  pricing: PricingBreakdown;
  paymentMask?: string;
  cardBrand?: CardBrand;
  walletName?: string;
  declineCode?: DeclineCode;
  declineMessage?: string;
}

export type PaymentOutcome =
  | { status: "success"; transaction: Transaction }
  | { status: "error"; code: DeclineCode; message: string }
  | { status: "timeout"; message: string };

export interface PaymentMethodDefinition {
  id: PaymentMethodId;
  label: string;
  description: string;
  badge?: string;
}

export interface ChargeRequest {
  method: PaymentMethodId;
  amount: number;
  pricing: PricingBreakdown;
  items: OrderLine[];
  card?: {
    number: string;
    expiry: string;
    cvv: string;
    holderName: string;
    saveCard: boolean;
    savedToken?: string;
    last4?: string;
    brand?: CardBrand;
  };
  walletId?: string;
}

export const EMPTY_CARD: CardFormValues = {
  holderName: "",
  number: "",
  expiry: "",
  cvv: "",
  saveCard: false,
};

export const CURRENCY_CODE = "IRT" as const;
export const TAX_RATE = 0.09;
export const SHIPPING_FEE = 45_000;
export const FREE_SHIPPING_THRESHOLD = 2_000_000;
