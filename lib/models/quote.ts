import type { CurrencyAmounts } from "@/lib/utils/quoteUtils";

export type QuoteStatus = "draft" | "sent";

export type Quote = {
  id: string;
  quoteNumber: string;
  clientName: string;
  /** @deprecated Solo se conserva para migrar presupuestos guardados. */
  total: number;
  currencyTotals?: CurrencyAmounts;
  createdAt: string;
  status: QuoteStatus;
};

export type QuoteFilter = "all" | QuoteStatus;
export type QuoteSortOrder = "desc" | "asc";
