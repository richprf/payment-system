import type { CardBrand } from "../types";
import { digitsOnly } from "./luhn";

interface BrandRule {
  brand: CardBrand;
  pattern: RegExp;
  lengths: number[];
  cvvLength: number;
}

/**
 * BIN (Bank Identification Number) detection.
 * Stripe Card Element does this live from the first 6–8 digits via their
 * /v1/tokens/card BIN lookup. Here we use well-known IIN ranges.
 */
const RULES: BrandRule[] = [
  { brand: "amex", pattern: /^3[47]/, lengths: [15], cvvLength: 4 },
  { brand: "jcb", pattern: /^35/, lengths: [16], cvvLength: 3 },
  { brand: "unionpay", pattern: /^62/, lengths: [16, 17, 18, 19], cvvLength: 3 },
  { brand: "discover", pattern: /^(6011|65|64[4-9])/, lengths: [16], cvvLength: 3 },
  {
    brand: "mastercard",
    pattern: /^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/,
    lengths: [16],
    cvvLength: 3,
  },
  { brand: "visa", pattern: /^4/, lengths: [13, 16, 19], cvvLength: 3 },
];

export function detectCardBrand(number: string): CardBrand {
  const digits = digitsOnly(number);
  if (!digits) return "unknown";
  const match = RULES.find((rule) => rule.pattern.test(digits));
  return match?.brand ?? "unknown";
}

export function getBrandMeta(brand: CardBrand): {
  label: string;
  lengths: number[];
  cvvLength: number;
} {
  const rule = RULES.find((item) => item.brand === brand);
  return {
    label: brandLabel(brand),
    lengths: rule?.lengths ?? [16],
    cvvLength: rule?.cvvLength ?? 3,
  };
}

export function brandLabel(brand: CardBrand): string {
  switch (brand) {
    case "visa":
      return "Visa";
    case "mastercard":
      return "Mastercard";
    case "amex":
      return "American Express";
    case "discover":
      return "Discover";
    case "unionpay":
      return "UnionPay";
    case "jcb":
      return "JCB";
    default:
      return "کارت بانکی";
  }
}

export function isValidLengthForBrand(number: string, brand: CardBrand): boolean {
  const len = digitsOnly(number).length;
  return getBrandMeta(brand).lengths.includes(len);
}
