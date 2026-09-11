"use client";

import { useCallback } from "react";
import { discountCodeSchema } from "../schemas/card.schema";
import { lookupDiscount } from "../utils/discounts";
import type { PaymentAction } from "../machine/paymentMachine";

export function useDiscountCode(dispatch: (action: PaymentAction) => void) {
  const apply = useCallback(
    (raw: string) => {
      const parsed = discountCodeSchema.safeParse(raw);
      if (!parsed.success) {
        dispatch({
          type: "DISCOUNT_ERROR",
          message: parsed.error.issues[0]?.message ?? "کد تخفیف نامعتبر است.",
        });
        return false;
      }
      const discount = lookupDiscount(parsed.data);
      if (!discount) {
        dispatch({
          type: "DISCOUNT_ERROR",
          message: "این کد تخفیف وجود ندارد یا منقضی شده.",
        });
        return false;
      }
      dispatch({ type: "APPLY_DISCOUNT", discount });
      return true;
    },
    [dispatch],
  );

  const clear = useCallback(() => {
    dispatch({ type: "CLEAR_DISCOUNT" });
  }, [dispatch]);

  return { apply, clear };
}
