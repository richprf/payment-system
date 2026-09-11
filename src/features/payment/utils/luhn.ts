/**
 * Luhn checksum — the same algorithm card networks and Stripe use
 * to reject obviously invalid PANs before they hit the gateway.
 *
 * Real Stripe Elements run this inside their PCI iframe; you never
 * implement it against a raw number on your own server.
 */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function luhnCheck(pan: string): boolean {
  const digits = digitsOnly(pan);
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let doubleDigit = false;

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let n = Number(digits[i]);
    if (Number.isNaN(n)) return false;
    if (doubleDigit) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    doubleDigit = !doubleDigit;
  }

  return sum % 10 === 0;
}
