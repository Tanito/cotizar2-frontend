import { useSyncExternalStore } from "react";

import type { QuoteItemForm, QuoteMetaForm } from "@/lib/utils/freeValidators";

export type QuoteItem = QuoteItemForm & {
  id: string;
};

export type FreeQuote = QuoteMetaForm & {
  items: QuoteItem[];
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

function createItemId() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const freeQuoteStore = {
  getQuote: getSnapshot,
  setQuoteMeta(meta: QuoteMetaForm) {
    quote = { ...quote, ...meta };
    emit();
  },
  addItem(item: QuoteItemForm) {
    quote = {
      ...quote,
      items: [...quote.items, { ...item, id: createItemId() }],
    };
    emit();
  },
  updateItem(id: string, item: QuoteItemForm) {
    quote = {
      ...quote,
      items: quote.items.map((existing) =>
        existing.id === id ? { ...existing, ...item } : existing,
      ),
    };
    emit();
  },
  removeItem(id: string) {
    quote = {
      ...quote,
      items: quote.items.filter((item) => item.id !== id),
    };
    emit();
  },
  reset() {
    quote = { ...defaultQuote, items: [] };
    emit();
  },
};

export function useFreeQuoteStore<T>(
  selector: (state: {
    quote: FreeQuote;
    setQuoteMeta: (meta: QuoteMetaForm) => void;
    addItem: (item: QuoteItemForm) => void;
    updateItem: (id: string, item: QuoteItemForm) => void;
    removeItem: (id: string) => void;
  }) => T,
): T {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return selector({
    quote: snapshot,
    setQuoteMeta: freeQuoteStore.setQuoteMeta,
    addItem: freeQuoteStore.addItem,
    updateItem: freeQuoteStore.updateItem,
    removeItem: freeQuoteStore.removeItem,
  });
}
