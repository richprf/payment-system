import type { CardBrand } from "../types";
import { detectCardBrand } from "./cardType";
import { digitsOnly } from "./luhn";

export function formatCardNumber(raw: string): string {
  const digits = digitsOnly(raw).slice(0, 19);
  const brand = detectCardBrand(digits);

  if (brand === "amex") {
    const p1 = digits.slice(0, 4);
    const p2 = digits.slice(4, 10);
    const p3 = digits.slice(10, 15);
    return [p1, p2, p3].filter(Boolean).join(" ");
  }

  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatExpiry(raw: string): string {
  const digits = digitsOnly(raw).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function formatCvv(raw: string, brand: CardBrand): string {
  const max = brand === "amex" ? 4 : 3;
  return digitsOnly(raw).slice(0, max);
}

export function maskCardNumber(number: string): string {
  const digits = digitsOnly(number);
  const last4 = digits.slice(-4).padStart(4, "•");
  return `•••• •••• •••• ${last4}`;
}

export function maskSavedCard(last4: string): string {
  return `•••• •••• •••• ${last4}`;
}

export function formatToman(amount: number): string {
  const formatted = new Intl.NumberFormat("fa-IR").format(Math.round(amount));
  return `${formatted} تومان`;
}

export function formatDateFa(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function parseExpiry(expiry: string): { month: number; year: number } | null {
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry);
  if (!match) return null;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return null;
  return { month, year };
}

export function isExpiryValid(expiry: string, now: Date = new Date()): boolean {
  const parsed = parseExpiry(expiry);
  if (!parsed) return false;
  const end = new Date(parsed.year, parsed.month, 0, 23, 59, 59);
  return end >= now;
}

export function generateTrackingNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NV-${stamp}${rand}`;
}

export function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}
