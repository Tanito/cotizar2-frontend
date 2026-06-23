import { useEffect, useMemo, useState } from "react";

import type { Client, ClientWithQuoteCount } from "@/lib/models/client";
import { normalizeText } from "@/lib/utils/normalizeText";
import { quoteRepository } from "@/services/quotes/quoteRepository";
import { clientRepository } from "@/services/clients/clientRepository";

function matchesSearch(client: Client, searchQuery: string): boolean {
  if (!searchQuery.trim()) return true;

  const normalizedQuery = normalizeText(searchQuery);
  const fullName = normalizeText(client.name);
  return fullName.includes(normalizedQuery);
}

function sortClients(clients: ClientWithQuoteCount[]): ClientWithQuoteCount[] {
  return [...clients].sort((left, right) =>
    left.name.localeCompare(right.name, "es", { sensitivity: "base" }),
  );
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [quoteCounts, setQuoteCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadData = async (showLoading: boolean) => {
      if (showLoading) {
        setIsLoading(true);
      }

      const [nextClients, nextQuotes] = await Promise.all([
        clientRepository.getAllClients(),
        quoteRepository.getAllQuotes(),
      ]);

      if (cancelled) {
        return;
      }

      const counts = nextQuotes.reduce<Record<string, number>>((acc, quote) => {
        const key = normalizeText(quote.clientName);
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      }, {});

      setClients(nextClients);
      setQuoteCounts(counts);
      setIsLoading(false);
    };

    void loadData(true);
    const unsubscribeClients = clientRepository.subscribe(() => {
      void loadData(false);
    });
    const unsubscribeQuotes = quoteRepository.subscribe(() => {
      void loadData(false);
    });

    return () => {
      cancelled = true;
      unsubscribeClients();
      unsubscribeQuotes();
    };
  }, []);

  const visibleClients = useMemo(() => {
    const mapped = clients
      .filter((client) => matchesSearch(client, searchQuery))
      .map<ClientWithQuoteCount>((client) => ({
        ...client,
        quoteCount: quoteCounts[normalizeText(client.name)] ?? 0,
      }));

    return sortClients(mapped);
  }, [clients, quoteCounts, searchQuery]);

  return {
    clients,
    visibleClients,
    isLoading,
    searchQuery,
    setSearchQuery,
  };
}

