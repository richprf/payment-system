"use client";

import { Tag, X } from "lucide-react";

interface DiscountCodeInputProps {
  value: string;
  error: string | null;
  applied?: string;
  appliedLabel?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
}

export function DiscountCodeInput({
  value,
  error,
  applied,
  appliedLabel,
  disabled,
  onChange,
  onApply,
  onClear,
}: DiscountCodeInputProps) {
  return (
    <div>
      <label htmlFor="discount-code" className="mb-1.5 block text-xs font-medium text-slate-600">
        کد تخفیف
      </label>
      {applied ? (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          <span className="flex items-center gap-2">
            <Tag className="h-4 w-4" aria-hidden="true" />
            <span>
              <span className="font-semibold" dir="ltr">
                {applied}
              </span>
              {appliedLabel ? ` — ${appliedLabel}` : null}
            </span>
          </span>
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            className="rounded-full p-1 hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="حذف کد تخفیف"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            id="discount-code"
            dir="ltr"
            value={value}
            disabled={disabled}
            placeholder="NOVA10"
            autoComplete="off"
            aria-invalid={Boolean(error)}
            onChange={(event) => onChange(event.target.value.toUpperCase())}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onApply();
              }
            }}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <button
            type="button"
            onClick={onApply}
            disabled={disabled || !value.trim()}
            className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            اعمال
          </button>
        </div>
      )}
      {error ? (
        <p role="alert" className="mt-1.5 text-xs text-rose-600">
          {error}
        </p>
      ) : !applied ? (
        <p className="mt-1.5 text-[11px] text-slate-400">
          نمونه: NOVA10 ، WELCOME20 ، FREESHIP ، FLAT100
        </p>
      ) : null}
    </div>
  );
}
