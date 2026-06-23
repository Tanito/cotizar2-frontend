import { useEffect, useState } from "react";

import type {
  Quote,
  QuoteFilter,
  QuoteSortOrder,
} from "@/lib/models/quote";
import { normalizeText } from "@/lib/utils/normalizeText";
import { quoteRepository } from "@/services/quotes/quoteRepository";

function matchesFilter(quote: Quote, filter: QuoteFilter): boolean {
  if (filter === "all") return true;
  return quote.status === filter;
}

function sortQuotes(quotes: Quote[], sortOrder: QuoteSortOrder): Quote[] {
  return [...quotes].sort((left, right) => {
    const diff =
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    return sortOrder === "desc" ? diff : -diff;
  });
}

function matchesSearch(quote: Quote, searchQuery: string): boolean {
  if (!searchQuery.trim()) return true;
  return normalizeText(quote.clientName).includes(normalizeText(searchQuery));
}

export function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<QuoteFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<QuoteSortOrder>("desc");

  useEffect(() => {
    let cancelled = false;

    const loadQuotes = async (showLoading: boolean) => {
      if (showLoading) {
        setIsLoading(true);
      }

      const nextQuotes = await quoteRepository.getAllQuotes();

      if (!cancelled) {
        setQuotes(nextQuotes);
        setIsLoading(false);
      }
    };

    void loadQuotes(true);
    const unsubscribe = quoteRepository.subscribe(() => {
      void loadQuotes(false);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const visibleQuotes = sortQuotes(
    quotes.filter(
      (quote) =>
        matchesFilter(quote, activeFilter) && matchesSearch(quote, searchQuery),
    ),
    sortOrder,
  );

  return {
    quotes,
    visibleQuotes,
    isLoading,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
  };
}
