"use client";

import { useCallback, useMemo, useReducer } from "react";
import {
  initialPaymentState,
  paymentReducer,
} from "../machine/paymentMachine";
import type { CardFormValues, ChargeRequest, OrderLine, SavedCard } from "../types";
import { processPayment } from "../utils/mockGateway";
import { calculatePricing } from "../utils/pricing";
import { detectCardBrand } from "../utils/cardType";
import { useDiscountCode } from "./useDiscountCode";
import { useSavedCards } from "./useSavedCards";
import { useTransactions } from "./useTransactions";
import { cardFormSchema } from "../schemas/card.schema";

interface UsePaymentFlowOptions {
  items: OrderLine[];
}

export function usePaymentFlow({ items }: UsePaymentFlowOptions) {
  const [state, dispatch] = useReducer(paymentReducer, initialPaymentState);
  const saved = useSavedCards();
  const history = useTransactions();
  const discount = useDiscountCode(dispatch);

  const pricing = useMemo(
    () => calculatePricing(items, state.appliedDiscount),
    [items, state.appliedDiscount],
  );

  const selectedSavedCard: SavedCard | null = useMemo(() => {
    if (!state.selectedSavedCardId) return null;
    return saved.cards.find((card) => card.id === state.selectedSavedCardId) ?? null;
  }, [saved.cards, state.selectedSavedCardId]);

  const patchCard = useCallback((patch: Partial<CardFormValues>) => {
    dispatch({ type: "PATCH_CARD", patch });
  }, []);

  const canContinueFromDetails = useMemo(() => {
    if (!state.method) return false;
    if (state.method === "cod") return true;
    if (state.method === "wallet") return Boolean(state.walletId);
    if (selectedSavedCard) return true;
    return cardFormSchema.safeParse(state.card).success;
  }, [selectedSavedCard, state.card, state.method, state.walletId]);

  const submit = useCallback(async () => {
    if (!state.method) return;
    dispatch({ type: "SUBMIT" });

    const request: ChargeRequest = {
      method: state.method,
      amount: pricing.total,
      pricing,
      items,
      walletId: state.walletId ?? undefined,
    };

    if (state.method === "card") {
      if (selectedSavedCard) {
        request.card = {
          number: selectedSavedCard.last4,
          expiry: selectedSavedCard.expiry,
          cvv: "",
          holderName: selectedSavedCard.holderName,
          saveCard: false,
          savedToken: selectedSavedCard.token,
          last4: selectedSavedCard.last4,
          brand: selectedSavedCard.brand,
        };
      } else {
        request.card = {
          ...state.card,
          brand: detectCardBrand(state.card.number),
        };
      }
    }

    const outcome = await processPayment(request);

    if (outcome.status === "success") {
      if (state.method === "card" && state.card.saveCard && !selectedSavedCard) {
        saved.addCard(state.card);
      }
      history.record(outcome.transaction);
      dispatch({ type: "SUCCESS", transaction: outcome.transaction });
      return;
    }

    if (outcome.status === "timeout") {
      dispatch({ type: "TIMEOUT", message: outcome.message });
      return;
    }

    dispatch({ type: "FAIL", code: outcome.code, message: outcome.message });
  }, [history, items, pricing, saved, selectedSavedCard, state]);

  return {
    state,
    dispatch,
    pricing,
    saved,
    history,
    discount,
    selectedSavedCard,
    patchCard,
    canContinueFromDetails,
    submit,
  };
}
