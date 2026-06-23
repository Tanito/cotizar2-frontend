import { createUuid } from "@/lib/utils/createUuid";
import { getQuoteTotals } from "@/lib/utils/quoteUtils";

import type { Quote, QuoteStatus } from "@/lib/models/quote";
import { quoteRepository } from "./quoteRepository";

type QuoteDraftSource = {
  customerName: string;
  items: { quantity: number; unitPrice: number }[];
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
  const totals = getQuoteTotals(quote.items, quote.depositPercentage);

  currentDraftContext = {
    ...context,
    status,
  };

  return {
    id: context.id,
    quoteNumber: context.quoteNumber,
    clientName: quote.customerName.trim(),
    total: totals.total,
    createdAt: context.createdAt,
    status,
  };
}

export async function persistCurrentQuoteDraft(
  quote: QuoteDraftSource,
): Promise<void> {
  await quoteRepository.saveQuote(
    buildQuoteRecord(quote, currentDraftContext?.status ?? "draft"),
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

