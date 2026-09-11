"use client";

import { useCallback, useEffect, useState } from "react";
import type { Transaction } from "../types";
import { loadTransactions, saveTransactions } from "../utils/storage";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTransactions(loadTransactions());
    setHydrated(true);
  }, []);

  const record = useCallback((tx: Transaction) => {
    setTransactions((current) => {
      const next = [tx, ...current.filter((item) => item.id !== tx.id)];
      saveTransactions(next);
      return next;
    });
  }, []);

  const getById = useCallback(
    (id: string) => transactions.find((item) => item.id === id),
    [transactions],
  );

  return { transactions, hydrated, record, getById };
}
