import { useSyncExternalStore } from "react";

import type { QuoteItemForm, QuoteMetaForm } from "@/lib/utils/freeValidators";
import { createUuid } from "@/lib/utils/createUuid";
import {
  markCurrentQuoteAsSent,
  persistCurrentQuoteDraft,
  resetCurrentQuoteDraftContext,
} from "@/services/quotes/quoteDraftSync";

export type QuoteItem = QuoteItemForm & {
  id: string;
};

export type FreeQuote = QuoteMetaForm & {
  items: QuoteItem[];
};

type StoreState = {
  quote: FreeQuote;
  pdfUrl: string | null;
  whatsappText: string | null;
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

let state: StoreState = {
  quote: { ...defaultQuote },
  pdfUrl: null,
  whatsappText: null,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function createItemId() {
  return createUuid();
}

export const freeQuoteStore = {
  getState: getSnapshot,
  setQuoteMeta(meta: QuoteMetaForm) {
    state = { ...state, quote: { ...state.quote, ...meta } };
    emit();
    void persistCurrentQuoteDraft(state.quote).catch((error) => {
      console.error("Failed to persist draft quote", error);
    });
  },
  addItem(item: QuoteItemForm) {
    state = {
      ...state,
      quote: {
        ...state.quote,
        items: [...state.quote.items, { ...item, id: createItemId() }],
      },
    };
    emit();
    void persistCurrentQuoteDraft(state.quote).catch((error) => {
      console.error("Failed to persist draft quote", error);
    });
  },
  updateItem(id: string, item: QuoteItemForm) {
    state = {
      ...state,
      quote: {
        ...state.quote,
        items: state.quote.items.map((existing) =>
          existing.id === id ? { ...existing, ...item } : existing,
        ),
      },
    };
    emit();
    void persistCurrentQuoteDraft(state.quote).catch((error) => {
      console.error("Failed to persist draft quote", error);
    });
  },
  removeItem(id: string) {
    state = {
      ...state,
      quote: {
        ...state.quote,
        items: state.quote.items.filter((item) => item.id !== id),
      },
    };
    emit();
    void persistCurrentQuoteDraft(state.quote).catch((error) => {
      console.error("Failed to persist draft quote", error);
    });
  },
  setPdfResult(pdfUri: string, whatsapp: string) {
    state = {
      ...state,
      pdfUrl: pdfUri,
      whatsappText: whatsapp,
    };
    emit();
  },
  async markAsSent() {
    try {
      await markCurrentQuoteAsSent(state.quote);
    } catch (error) {
      console.error("Failed to persist sent quote", error);
    }
  },
  reset() {
    state = {
      quote: { ...defaultQuote, items: [] },
      pdfUrl: null,
      whatsappText: null,
    };
    resetCurrentQuoteDraftContext();
    emit();
  },
  resetFlow() {
    this.reset();
  },
};

export function useFreeQuoteStore<T>(
  selector: (state: StoreState & {
    setQuoteMeta: (meta: QuoteMetaForm) => void;
    addItem: (item: QuoteItemForm) => void;
    updateItem: (id: string, item: QuoteItemForm) => void;
    removeItem: (id: string) => void;
    setPdfResult: (pdfUri: string, whatsapp: string) => void;
    markAsSent: () => Promise<void>;
    resetFlow: () => void;
  }) => T,
): T {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return selector({
    ...snapshot,
    setQuoteMeta: freeQuoteStore.setQuoteMeta,
    addItem: freeQuoteStore.addItem,
    updateItem: freeQuoteStore.updateItem,
    removeItem: freeQuoteStore.removeItem,
    setPdfResult: freeQuoteStore.setPdfResult,
    markAsSent: freeQuoteStore.markAsSent,
    resetFlow: freeQuoteStore.resetFlow,
  });
}
