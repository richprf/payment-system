"use client";

import { Trash2 } from "lucide-react";
import type { SavedCard } from "../types";
import { CardBrandIcon } from "./CardBrandIcon";
import { maskSavedCard } from "../utils/format";
import { brandLabel } from "../utils/cardType";
import { cn } from "@/lib/cn";

interface SavedCardsListProps {
  cards: SavedCard[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

export function SavedCardsList({
  cards,
  selectedId,
  onSelect,
  onRemove,
  disabled,
}: SavedCardsListProps) {
  if (cards.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-700">کارت‌های ذخیره‌شده</p>
      <ul className="space-y-2">
        {cards.map((card) => {
          const selected = selectedId === card.id;
          return (
            <li key={card.id}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-3 transition",
                  selected
                    ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                    : "border-slate-200 bg-white",
                )}
              >
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelect(selected ? null : card.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-right"
                  aria-pressed={selected}
                >
                  <CardBrandIcon brand={card.brand} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-slate-900" dir="ltr">
                      {maskSavedCard(card.last4)}
                    </span>
                    <span className="text-xs text-slate-500">
                      {brandLabel(card.brand)} · انقضا {card.expiry} · {card.holderName}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  aria-label="حذف کارت ذخیره‌شده"
                  disabled={disabled}
                  onClick={() => onRemove(card.id)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {selectedId ? (
        <button
          type="button"
          className="text-xs font-medium text-indigo-600 hover:underline"
          onClick={() => onSelect(null)}
        >
          استفاده از کارت جدید
        </button>
      ) : null}
    </div>
  );
}
