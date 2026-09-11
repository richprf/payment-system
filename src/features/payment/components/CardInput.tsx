"use client";

import { useId, useState, type ReactNode } from "react";
import type { CardFormValues } from "../types";
import { useCardValidation } from "../hooks/useCardValidation";
import { CardPreview } from "./CardPreview";
import { CardBrandIcon } from "./CardBrandIcon";
import { cn } from "@/lib/cn";

interface CardInputProps {
  values: CardFormValues;
  onChange: (patch: Partial<CardFormValues>) => void;
  disabled?: boolean;
}

export function CardInput({ values, onChange, disabled }: CardInputProps) {
  const ids = {
    name: useId(),
    number: useId(),
    expiry: useId(),
    cvv: useId(),
    save: useId(),
  };
  const [flipped, setFlipped] = useState(false);
  const { brand, fieldErrors, formatField } = useCardValidation(values);

  function setField<K extends keyof CardFormValues>(key: K, value: CardFormValues[K]) {
    onChange({ [key]: value } as Partial<CardFormValues>);
  }

  return (
    <div className="space-y-5">
      <CardPreview values={values} brand={brand} flipped={flipped} />

      <div className="grid gap-4">
        <Field
          id={ids.number}
          label="شماره کارت"
          error={values.number ? fieldErrors.number : undefined}
          hint="۱۶ رقم، با فاصله‌گذاری خودکار"
        >
          <div className="relative">
            <input
              id={ids.number}
              name="cardNumber"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              dir="ltr"
              disabled={disabled}
              value={values.number}
              aria-invalid={Boolean(values.number && fieldErrors.number)}
              aria-describedby={fieldErrors.number ? `${ids.number}-error` : `${ids.number}-hint`}
              onChange={(event) => setField("number", formatField("number", event.target.value))}
              className={cn(inputClass(Boolean(values.number && fieldErrors.number)), "pr-12")}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <CardBrandIcon brand={brand} className="h-6 w-10" />
            </span>
          </div>
        </Field>

        <Field
          id={ids.name}
          label="نام دارنده کارت"
          error={values.holderName ? fieldErrors.holderName : undefined}
        >
          <input
            id={ids.name}
            name="cardName"
            autoComplete="cc-name"
            placeholder="مثال: ALI REZAIE"
            disabled={disabled}
            value={values.holderName}
            aria-invalid={Boolean(values.holderName && fieldErrors.holderName)}
            onChange={(event) => setField("holderName", event.target.value.toUpperCase())}
            className={inputClass(Boolean(values.holderName && fieldErrors.holderName))}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field
            id={ids.expiry}
            label="تاریخ انقضا"
            error={values.expiry.length >= 5 ? fieldErrors.expiry : undefined}
          >
            <input
              id={ids.expiry}
              name="cardExpiry"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              dir="ltr"
              disabled={disabled}
              value={values.expiry}
              aria-invalid={Boolean(values.expiry.length >= 5 && fieldErrors.expiry)}
              onChange={(event) => setField("expiry", formatField("expiry", event.target.value))}
              className={inputClass(Boolean(values.expiry.length >= 5 && fieldErrors.expiry))}
            />
          </Field>

          <Field
            id={ids.cvv}
            label="CVV"
            error={values.cvv ? fieldErrors.cvv : undefined}
            hint="۳ رقم پشت کارت (امکس: ۴ رقم)"
          >
            <input
              id={ids.cvv}
              name="cardCvc"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              dir="ltr"
              disabled={disabled}
              value={values.cvv}
              aria-invalid={Boolean(values.cvv && fieldErrors.cvv)}
              onFocus={() => setFlipped(true)}
              onBlur={() => setFlipped(false)}
              onChange={(event) => setField("cvv", formatField("cvv", event.target.value))}
              className={inputClass(Boolean(values.cvv && fieldErrors.cvv))}
            />
          </Field>
        </div>

        <label htmlFor={ids.save} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
          <input
            id={ids.save}
            type="checkbox"
            checked={values.saveCard}
            disabled={disabled}
            onChange={(event) => setField("saveCard", event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span>
            <span className="block text-sm font-medium text-slate-800">
              ذخیره اطلاعات کارت برای خریدهای بعدی
            </span>
            <span className="mt-0.5 block text-xs leading-5 text-slate-500">
              در نسخه واقعی این گزینه یک SetupIntent در Stripe می‌سازد. اینجا فقط توکن ساختگی در localStorage ذخیره می‌شود — هرگز CVV ذخیره نمی‌شود.
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}

function inputClass(invalid: boolean): string {
  return cn(
    "w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition",
    "placeholder:text-slate-400 focus:ring-2",
    invalid
      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
      : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-200",
  );
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-rose-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
