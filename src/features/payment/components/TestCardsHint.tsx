"use client";

import { TEST_CARDS } from "../utils/mockGateway";

interface TestCardsHintProps {
  onFill: (number: string) => void;
}

export function TestCardsHint({ onFill }: TestCardsHintProps) {
  return (
    <details className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 p-3">
      <summary className="cursor-pointer text-sm font-medium text-indigo-800">
        کارت‌های آزمایشی (شبیه Stripe Test Cards)
      </summary>
      <ul className="mt-3 space-y-2">
        {TEST_CARDS.map((card) => (
          <li key={card.number}>
            <button
              type="button"
              onClick={() => onFill(card.number)}
              className="flex w-full items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-right text-xs hover:bg-indigo-50"
            >
              <span>
                <span className="block font-medium text-slate-800">{card.label}</span>
                <span className="text-slate-500">{card.hint}</span>
              </span>
              <span className="font-mono text-[11px] text-indigo-700" dir="ltr">
                {card.number}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}
