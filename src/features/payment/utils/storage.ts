import type { SavedCard, Transaction, WalletAccount } from "../types";

const CARDS_KEY = "nova.payment.savedCards.v1";
const TX_KEY = "nova.payment.transactions.v1";
const WALLET_KEY = "nova.payment.wallets.v1";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadSavedCards(): SavedCard[] {
  return readJson<SavedCard[]>(CARDS_KEY, []);
}

export function saveSavedCards(cards: SavedCard[]): void {
  writeJson(CARDS_KEY, cards);
}

export function loadTransactions(): Transaction[] {
  return readJson<Transaction[]>(TX_KEY, []);
}

export function saveTransactions(txs: Transaction[]): void {
  writeJson(TX_KEY, txs);
}

export const DEFAULT_WALLETS: WalletAccount[] = [
  {
    id: "nova-pay",
    name: "نوا پی",
    subtitle: "کیف پول اصلی فروشگاه",
    balance: 50_000_000,
  },
  {
    id: "gift",
    name: "کارت هدیه",
    subtitle: "موجودی محدود — برای تست عدم‌کفایت",
    balance: 80_000,
  },
];

export function loadWallets(): WalletAccount[] {
  return readJson<WalletAccount[]>(WALLET_KEY, DEFAULT_WALLETS);
}

export function saveWallets(wallets: WalletAccount[]): void {
  writeJson(WALLET_KEY, wallets);
}

export function debitWallet(walletId: string, amount: number): WalletAccount[] {
  const wallets = loadWallets().map((wallet) =>
    wallet.id === walletId
      ? { ...wallet, balance: Math.max(0, wallet.balance - amount) }
      : wallet,
  );
  saveWallets(wallets);
  return wallets;
}
