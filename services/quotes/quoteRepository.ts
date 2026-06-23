import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Quote } from "@/lib/models/quote";

type QuoteStoragePayload = {
  quotes: Quote[];
};

export interface QuoteRepository {
  getAllQuotes(): Promise<Quote[]>;
  saveQuote(quote: Quote): Promise<void>;
  updateQuote(quote: Quote): Promise<void>;
  deleteQuote(id: string): Promise<void>;
  subscribe(listener: () => void): () => void;
}

const STORAGE_KEY = "@cotizar/quotes";

function isQuote(value: unknown): value is Quote {
  if (typeof value !== "object" || value === null) return false;

  const quote = value as Partial<Quote>;

  return (
    typeof quote.id === "string" &&
    typeof quote.quoteNumber === "string" &&
    typeof quote.clientName === "string" &&
    typeof quote.total === "number" &&
    typeof quote.createdAt === "string" &&
    (quote.status === "draft" || quote.status === "sent")
  );
}

function sortByCreatedAt(quotes: Quote[]): Quote[] {
  return [...quotes].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() -
      new Date(left.createdAt).getTime()
  );
}

class LocalQuoteRepository implements QuoteRepository {
  private cache: Quote[] | null = null;

  private readonly listeners = new Set<() => void>();

  private operationQueue: Promise<void> = Promise.resolve();

  private async loadQuotesFromStorage(): Promise<Quote[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);

      if (!raw) {
        this.cache = [];
        return [];
      }

      const parsed =
        JSON.parse(raw) as Partial<QuoteStoragePayload>;

      const quotes = Array.isArray(parsed.quotes)
        ? parsed.quotes.filter(isQuote)
        : [];

      this.cache = sortByCreatedAt(quotes);

      return this.cache;
    } catch {
      this.cache = [];
      return [];
    }
  }

  private async ensureLoaded(): Promise<Quote[]> {
    if (this.cache !== null) {
      return this.cache;
    }

    return this.loadQuotesFromStorage();
  }

  private async writeCache(): Promise<void> {
    const payload: QuoteStoragePayload = {
      quotes: sortByCreatedAt(this.cache ?? []),
    };

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(payload)
    );
  }

  private enqueue<T>(
    task: () => Promise<T>
  ): Promise<T> {
    const next = this.operationQueue.then(
      task,
      task
    );

    this.operationQueue = next.then(
      () => undefined,
      () => undefined
    );

    return next;
  }

  private emit() {
    this.listeners.forEach((listener) =>
      listener()
    );
  }

  private async upsertQuote(
    quote: Quote
  ): Promise<void> {
    await this.ensureLoaded();

    const currentQuotes = this.cache ?? [];

    const nextQuotes = currentQuotes.filter(
      (entry) => entry.id !== quote.id
    );

    nextQuotes.push(quote);

    this.cache = sortByCreatedAt(nextQuotes);

    await this.writeCache();
  }

  async getAllQuotes(): Promise<Quote[]> {
    return this.enqueue(async () => {
      const quotes = await this.ensureLoaded();

      return sortByCreatedAt(quotes);
    });
  }

  async saveQuote(
    quote: Quote
  ): Promise<void> {
    await this.enqueue(async () => {
      await this.upsertQuote(quote);
      this.emit();
    });
  }

  async updateQuote(
    quote: Quote
  ): Promise<void> {
    await this.enqueue(async () => {
      await this.upsertQuote(quote);
      this.emit();
    });
  }

  async deleteQuote(id: string): Promise<void> {
    await this.enqueue(async () => {
      await this.ensureLoaded();

      this.cache = (this.cache ?? []).filter(
        (quote) => quote.id !== id
      );

      await this.writeCache();

      this.emit();
    });
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);

    return () =>
      this.listeners.delete(listener);
  }
}

export const quoteRepository: QuoteRepository =
  new LocalQuoteRepository();
