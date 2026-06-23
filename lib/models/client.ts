export type Client = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  createdAt: string;
};

export type ClientWithQuoteCount = Client & {
  quoteCount: number;
};

