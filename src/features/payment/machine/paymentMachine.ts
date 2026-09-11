import type {
  CardFormValues,
  DeclineCode,
  DiscountCode,
  PaymentMethodId,
  PaymentOutcome,
  PaymentPhase,
  PaymentStep,
  Transaction,
} from "../types";
import { EMPTY_CARD as EMPTY } from "../types";

export interface PaymentState {
  step: PaymentStep;
  phase: PaymentPhase;
  method: PaymentMethodId | null;
  card: CardFormValues;
  selectedSavedCardId: string | null;
  walletId: string | null;
  discountInput: string;
  appliedDiscount: DiscountCode | null;
  discountError: string | null;
  outcome: PaymentOutcome | null;
  lastError: string | null;
  lastDeclineCode: DeclineCode | null;
}

export const initialPaymentState: PaymentState = {
  step: "method",
  phase: "idle",
  method: "card",
  card: { ...EMPTY },
  selectedSavedCardId: null,
  walletId: "nova-pay",
  discountInput: "",
  appliedDiscount: null,
  discountError: null,
  outcome: null,
  lastError: null,
  lastDeclineCode: null,
};

export type PaymentAction =
  | { type: "SELECT_METHOD"; method: PaymentMethodId }
  | { type: "PATCH_CARD"; patch: Partial<CardFormValues> }
  | { type: "SELECT_SAVED_CARD"; id: string | null }
  | { type: "SELECT_WALLET"; id: string }
  | { type: "SET_DISCOUNT_INPUT"; value: string }
  | { type: "APPLY_DISCOUNT"; discount: DiscountCode }
  | { type: "CLEAR_DISCOUNT" }
  | { type: "DISCOUNT_ERROR"; message: string }
  | { type: "GO_TO"; step: PaymentStep }
  | { type: "SUBMIT" }
  | { type: "SUCCESS"; transaction: Transaction }
  | { type: "FAIL"; code: DeclineCode; message: string }
  | { type: "TIMEOUT"; message: string }
  | { type: "RETRY" };

const STEP_ORDER: PaymentStep[] = ["method", "details", "review", "processing", "result"];

export function canJumpTo(from: PaymentStep, to: PaymentStep, state: PaymentState): boolean {
  if (to === from) return true;
  if (to === "processing" || to === "result") return false;
  const fromIdx = STEP_ORDER.indexOf(from);
  const toIdx = STEP_ORDER.indexOf(to);
  if (toIdx < fromIdx) return true;
  if (to === "details") return state.method !== null;
  if (to === "review") return state.method !== null;
  return false;
}

export function paymentReducer(state: PaymentState, action: PaymentAction): PaymentState {
  switch (action.type) {
    case "SELECT_METHOD":
      return {
        ...state,
        method: action.method,
        lastError: null,
        selectedSavedCardId:
          action.method === "card" ? state.selectedSavedCardId : null,
      };
    case "PATCH_CARD":
      return {
        ...state,
        card: { ...state.card, ...action.patch },
        selectedSavedCardId: null,
      };
    case "SELECT_SAVED_CARD":
      return {
        ...state,
        selectedSavedCardId: action.id,
        card: action.id ? { ...EMPTY, saveCard: false } : state.card,
      };
    case "SELECT_WALLET":
      return { ...state, walletId: action.id };
    case "SET_DISCOUNT_INPUT":
      return { ...state, discountInput: action.value, discountError: null };
    case "APPLY_DISCOUNT":
      return {
        ...state,
        appliedDiscount: action.discount,
        discountInput: action.discount.code,
        discountError: null,
      };
    case "CLEAR_DISCOUNT":
      return {
        ...state,
        appliedDiscount: null,
        discountInput: "",
        discountError: null,
      };
    case "DISCOUNT_ERROR":
      return { ...state, discountError: action.message, appliedDiscount: null };
    case "GO_TO":
      if (!canJumpTo(state.step, action.step, state)) return state;
      return { ...state, step: action.step, lastError: null };
    case "SUBMIT":
      return {
        ...state,
        step: "processing",
        phase: "processing",
        lastError: null,
        lastDeclineCode: null,
        outcome: null,
      };
    case "SUCCESS":
      return {
        ...state,
        step: "result",
        phase: "success",
        outcome: { status: "success", transaction: action.transaction },
      };
    case "FAIL":
      return {
        ...state,
        step: "result",
        phase: "error",
        lastError: action.message,
        lastDeclineCode: action.code,
        outcome: { status: "error", code: action.code, message: action.message },
      };
    case "TIMEOUT":
      return {
        ...state,
        step: "result",
        phase: "timeout",
        lastError: action.message,
        lastDeclineCode: "timeout",
        outcome: { status: "timeout", message: action.message },
      };
    case "RETRY":
      return {
        ...state,
        step: "review",
        phase: "idle",
        outcome: null,
        lastError: null,
        lastDeclineCode: null,
      };
    default: {
      const _exhaustive: never = action;
      void _exhaustive;
      return state;
    }
  }
}
