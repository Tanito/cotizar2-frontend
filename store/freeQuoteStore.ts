import { useSyncExternalStore } from "react";

import type { QuoteMetaForm } from "@/lib/utils/freeValidators";

export type FreeQuote = QuoteMetaForm & {
  items: [];
};

const defaultQuote: FreeQuote = {
  customerName: "",
  customerPhone: "",
  serviceType: "",
  validityDays: 15,
  depositPercentage: 50,
  notes: "",
  items: [],
};

let quote: FreeQuote = { ...defaultQuote };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return quote;
}

export const freeQuoteStore = {
  getQuote: getSnapshot,
  setQuoteMeta(meta: QuoteMetaForm) {
    quote = { ...quote, ...meta };
    emit();
  },
  reset() {
    quote = { ...defaultQuote };
    emit();
  },
};

export function useFreeQuoteStore<T>(
  selector: (state: {
    quote: FreeQuote;
    setQuoteMeta: (meta: QuoteMetaForm) => void;
  }) => T,
): T {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return selector({
    quote: snapshot,
    setQuoteMeta: freeQuoteStore.setQuoteMeta,
  });
}
