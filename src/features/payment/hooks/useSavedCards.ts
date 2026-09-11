"use client";

import { useCallback, useEffect, useState } from "react";
import type { SavedCard } from "../types";
import { detectCardBrand } from "../utils/cardType";
import { digitsOnly } from "../utils/luhn";
import { generateId } from "../utils/format";
import { loadSavedCards, saveSavedCards } from "../utils/storage";

/**
 * Saved cards live in localStorage for the demo.
 * Stripe replacement: Customer.listPaymentMethods({ type: "card" }).
 */
export function useSavedCards() {
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCards(loadSavedCards());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: SavedCard[]) => {
    setCards(next);
    saveSavedCards(next);
  }, []);

  const addCard = useCallback(
    (input: { holderName: string; number: string; expiry: string }) => {
      const last4 = digitsOnly(input.number).slice(-4);
      const brand = detectCardBrand(input.number);
      const duplicate = cards.find(
        (card) => card.last4 === last4 && card.expiry === input.expiry,
      );
      if (duplicate) return duplicate;

      const saved: SavedCard = {
        id: generateId("pm"),
        brand,
        last4,
        expiry: input.expiry,
        holderName: input.holderName,
        token: `tok_mock_${last4}_${Date.now().toString(36)}`,
        createdAt: new Date().toISOString(),
      };
      persist([saved, ...cards]);
      return saved;
    },
    [cards, persist],
  );

  const removeCard = useCallback(
    (id: string) => {
      persist(cards.filter((card) => card.id !== id));
    },
    [cards, persist],
  );

  return { cards, hydrated, addCard, removeCard };
}
