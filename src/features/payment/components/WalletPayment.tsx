"use client";

import { Wallet } from "lucide-react";
import type { WalletAccount } from "../types";
import { formatToman } from "../utils/format";
import { cn } from "@/lib/cn";

interface WalletPaymentProps {
  wallets: WalletAccount[];
  selectedId: string | null;
  amount: number;
  onSelect: (id: string) => void;
}

export function WalletPayment({ wallets, selectedId, amount, onSelect }: WalletPaymentProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-800">کیف پول خود را انتخاب کنید</p>
      <ul className="space-y-3">
        {wallets.map((wallet) => {
          const selected = selectedId === wallet.id;
          const enough = wallet.balance >= amount;
          return (
            <li key={wallet.id}>
              <button
                type="button"
                onClick={() => onSelect(wallet.id)}
                aria-pressed={selected}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border p-4 text-right transition",
                  selected
                    ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                    : "border-slate-200 bg-white hover:bg-slate-50",
                )}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white">
                  <Wallet className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-slate-900">{wallet.name}</span>
                  <span className="block text-xs text-slate-500">{wallet.subtitle}</span>
                </span>
                <span className="text-left">
                  <span className="block text-sm font-semibold text-slate-900">
                    {formatToman(wallet.balance)}
                  </span>
                  {!enough ? (
                    <span className="text-[11px] text-rose-600">موجودی ناکافی</span>
                  ) : (
                    <span className="text-[11px] text-emerald-600">آماده پرداخت</span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
