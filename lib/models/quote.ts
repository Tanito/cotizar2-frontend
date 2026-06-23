export type QuoteStatus = "draft" | "sent";

export type Quote = {
  id: string;
  quoteNumber: string;
  clientName: string;
  total: number;
  createdAt: string;
  status: QuoteStatus;
};

export type QuoteFilter = "all" | QuoteStatus;
export type QuoteSortOrder = "desc" | "asc";

