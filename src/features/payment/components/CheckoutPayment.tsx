"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import type { OrderLine, WalletAccount } from "../types";
import { usePaymentFlow } from "../hooks/usePaymentFlow";
import { CardInput } from "./CardInput";
import { CashOnDelivery } from "./CashOnDelivery";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { PaymentStatus } from "./PaymentStatus";
import { PaymentStepper } from "./PaymentStepper";
import { PaymentSummary } from "./PaymentSummary";
import { SavedCardsList } from "./SavedCardsList";
import { TestCardsHint } from "./TestCardsHint";
import { TrustBadges } from "./TrustBadges";
import { WalletPayment } from "./WalletPayment";
import { loadWallets } from "../utils/storage";
import { formatCardNumber } from "../utils/format";
import { getPaymentMethod } from "../registry";
import { maskCardNumber, maskSavedCard } from "../utils/format";

interface CheckoutPaymentProps {
  items: OrderLine[];
  onPaid?: () => void;
}

export function CheckoutPayment({ items, onPaid }: CheckoutPaymentProps) {
  const flow = usePaymentFlow({ items });
  const [wallets, setWallets] = useState<WalletAccount[]>([]);

  useEffect(() => {
    setWallets(loadWallets());
  }, [flow.state.phase]);

  useEffect(() => {
    if (flow.state.phase === "success") {
      onPaid?.();
    }
  }, [flow.state.phase, onPaid]);

  const { state, dispatch } = flow;
  const busy = state.phase === "processing";

  function goNext() {
    if (state.step === "method" && state.method) {
      dispatch({ type: "GO_TO", step: "details" });
      return;
    }
    if (state.step === "details" && flow.canContinueFromDetails) {
      dispatch({ type: "GO_TO", step: "review" });
    }
  }

  function goBack() {
    if (state.step === "details") dispatch({ type: "GO_TO", step: "method" });
    if (state.step === "review") dispatch({ type: "GO_TO", step: "details" });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <PaymentStepper
          current={state.step}
          onJump={(step) => dispatch({ type: "GO_TO", step })}
        />

        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              {state.step === "method" ? (
                <PaymentMethodSelector
                  value={state.method}
                  onChange={(method) => dispatch({ type: "SELECT_METHOD", method })}
                />
              ) : null}

              {state.step === "details" ? (
                <DetailsStep
                  flow={flow}
                  wallets={wallets}
                />
              ) : null}

              {state.step === "review" ? <ReviewStep flow={flow} wallets={wallets} /> : null}

              {state.step === "processing" || state.step === "result" ? (
                <PaymentStatus
                  processing={state.step === "processing"}
                  outcome={state.outcome}
                  onRetry={() => dispatch({ type: "RETRY" })}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>

        {state.step !== "processing" && state.step !== "result" ? (
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            {state.step === "method" ? (
              <span />
            ) : (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                بازگشت
              </button>
            )}

            {state.step === "review" ? (
              <button
                type="button"
                onClick={() => void flow.submit()}
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
              >
                <Lock className="h-4 w-4" aria-hidden="true" />
                پرداخت امن {flow.pricing.total.toLocaleString("fa-IR")} تومان
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                disabled={
                  (state.step === "method" && !state.method) ||
                  (state.step === "details" && !flow.canContinueFromDetails)
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ادامه
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        ) : null}

        {state.step !== "result" ? (
          <div className="mt-8 border-t border-slate-100 pt-5">
            <TrustBadges />
          </div>
        ) : null}
      </section>

      <PaymentSummary
        items={items}
        pricing={flow.pricing}
        discountInput={state.discountInput}
        discountError={state.discountError}
        locked={busy || state.step === "result"}
        onDiscountInput={(value) => dispatch({ type: "SET_DISCOUNT_INPUT", value })}
        onApplyDiscount={() => flow.discount.apply(state.discountInput)}
        onClearDiscount={() => flow.discount.clear()}
      />
    </div>
  );
}

function DetailsStep({
  flow,
  wallets,
}: {
  flow: ReturnType<typeof usePaymentFlow>;
  wallets: WalletAccount[];
}) {
  const { state } = flow;

  if (state.method === "wallet") {
    return (
      <WalletPayment
        wallets={wallets}
        selectedId={state.walletId}
        amount={flow.pricing.total}
        onSelect={(id) => flow.dispatch({ type: "SELECT_WALLET", id })}
      />
    );
  }

  if (state.method === "cod") {
    return <CashOnDelivery />;
  }

  return (
    <div className="space-y-5">
      <SavedCardsList
        cards={flow.saved.cards}
        selectedId={state.selectedSavedCardId}
        onSelect={(id) => flow.dispatch({ type: "SELECT_SAVED_CARD", id })}
        onRemove={flow.saved.removeCard}
      />
      {!state.selectedSavedCardId ? (
        <>
          <CardInput values={state.card} onChange={flow.patchCard} />
          <TestCardsHint
            onFill={(number) =>
              flow.patchCard({
                number: formatCardNumber(number),
                holderName: state.card.holderName || "NOVA TEST USER",
                expiry: state.card.expiry || "12/28",
                cvv: state.card.cvv || "123",
              })
            }
          />
        </>
      ) : null}
    </div>
  );
}

function ReviewStep({
  flow,
  wallets,
}: {
  flow: ReturnType<typeof usePaymentFlow>;
  wallets: WalletAccount[];
}) {
  const { state, selectedSavedCard } = flow;
  const method = state.method ? getPaymentMethod(state.method) : null;
  const wallet = wallets.find((item) => item.id === state.walletId);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">بازبینی و تایید پرداخت</h2>
      <p className="text-sm text-slate-500">
        لطفاً جزئیات را بررسی کنید. با زدن دکمه پرداخت، درخواست شبیه‌سازی‌شده به درگاه ارسال می‌شود.
      </p>
      <dl className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">روش</dt>
          <dd className="font-medium text-slate-900">{method?.label}</dd>
        </div>
        {state.method === "card" ? (
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">کارت</dt>
            <dd className="font-mono text-slate-900" dir="ltr">
              {selectedSavedCard
                ? maskSavedCard(selectedSavedCard.last4)
                : maskCardNumber(state.card.number)}
            </dd>
          </div>
        ) : null}
        {state.method === "wallet" && wallet ? (
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">کیف پول</dt>
            <dd className="font-medium text-slate-900">{wallet.name}</dd>
          </div>
        ) : null}
        {state.method === "cod" ? (
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">زمان پرداخت</dt>
            <dd className="font-medium text-slate-900">هنگام تحویل سفارش</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
