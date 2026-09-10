import { createUuid } from "@/lib/utils/createUuid";
import {
  getQuoteTotalsByCurrency,
  getTotalAmounts,
  type QuoteCurrency,
} from "@/lib/utils/quoteUtils";

import type { Quote, QuoteStatus } from "@/lib/models/quote";
import { quoteRepository } from "./quoteRepository";

type QuoteDraftSource = {
  customerName: string;
  items: { quantity: number; unitPrice: number; currency?: QuoteCurrency }[];
  depositPercentage: number;
};

type DraftContext = {
  id: string;
  quoteNumber: string;
  createdAt: string;
  status: QuoteStatus;
};

let currentDraftContext: DraftContext | null = null;

function buildQuoteNumber(id: string): string {
  return `COT-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

function getDraftContext(): DraftContext {
  if (currentDraftContext) {
    return currentDraftContext;
  }

  const id = createUuid();
  currentDraftContext = {
    id,
    quoteNumber: buildQuoteNumber(id),
    createdAt: new Date().toISOString(),
    status: "draft",
  };

  return currentDraftContext;
}

function buildQuoteRecord(
  quote: QuoteDraftSource,
  status: QuoteStatus,
): Quote {
  const context = getDraftContext();
  const totals = getQuoteTotalsByCurrency(quote.items, quote.depositPercentage);
  const currencyTotals = getTotalAmounts(totals);

  currentDraftContext = {
    ...context,
    status,
  };

  return {
    id: context.id,
    quoteNumber: context.quoteNumber,
    clientName: quote.customerName.trim(),
    total: currencyTotals.ARS,
    currencyTotals,
    createdAt: context.createdAt,
    status,
  };
}

export async function persistCurrentQuoteDraft(
  quote: QuoteDraftSource,
): Promise<void> {
  const status = currentDraftContext?.status ?? "draft";

  await quoteRepository.updateQuote(
    buildQuoteRecord(quote, status),
  );
}

export async function markCurrentQuoteAsSent(
  quote: QuoteDraftSource,
): Promise<void> {
  await quoteRepository.updateQuote(buildQuoteRecord(quote, "sent"));
}

export function resetCurrentQuoteDraftContext(): void {
  currentDraftContext = null;
}
