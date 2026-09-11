"use client";

import { useMemo } from "react";
import { cardFormSchema } from "../schemas/card.schema";
import type { CardFormValues } from "../types";
import { detectCardBrand, getBrandMeta } from "../utils/cardType";
import { formatCardNumber, formatCvv, formatExpiry } from "../utils/format";

export type CardField = keyof CardFormValues;

export function useCardValidation(values: CardFormValues) {
  const brand = useMemo(() => detectCardBrand(values.number), [values.number]);
  const brandMeta = useMemo(() => getBrandMeta(brand), [brand]);

  const parsed = useMemo(() => cardFormSchema.safeParse(values), [values]);

  const fieldErrors = useMemo(() => {
    const errors: Partial<Record<CardField, string>> = {};
    if (parsed.success) return errors;
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in errors)) {
        errors[key as CardField] = issue.message;
      }
    }
    return errors;
  }, [parsed]);

  function formatField(field: CardField, raw: string): string {
    if (field === "number") return formatCardNumber(raw);
    if (field === "expiry") return formatExpiry(raw);
    if (field === "cvv") return formatCvv(raw, brand);
    return raw;
  }

  return {
    brand,
    brandMeta,
    isValid: parsed.success,
    fieldErrors,
    formatField,
  };
}
