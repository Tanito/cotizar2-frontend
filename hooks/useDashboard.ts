import { useEffect, useMemo, useState } from "react";

import type { Client } from "@/lib/models/client";
import type { Quote } from "@/lib/models/quote";
import { normalizeText } from "@/lib/utils/normalizeText";
import { formatARS } from "@/lib/utils/quoteUtils";
import { clientRepository } from "@/services/clients/clientRepository";
import { quoteRepository } from "@/services/quotes/quoteRepository";

export type DashboardStat = {
  value: string;
  label: string;
  color: string;
};

export type DashboardActivity = {
  id: string;
  quoteNumber: string;
  client: string;
  amount: string;
  date: string;
};

type DashboardState = {
  quotes: Quote[];
  clients: Client[];
  isLoading: boolean;
};

function parseQuoteDate(value: string): Date {
  return new Date(value);
}

function isQuoteInMonth(quote: Quote, reference: Date): boolean {
  const createdAt = parseQuoteDate(quote.createdAt);
  return (
    createdAt.getFullYear() === reference.getFullYear() &&
    createdAt.getMonth() === reference.getMonth()
  );
}

function sortQuotesDesc(quotes: Quote[]): Quote[] {
  return [...quotes].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

function formatMonthVariation(current: number, previous: number): {
  value: string;
  color: string;
} {
  if (previous === 0) {
    if (current > 0) {
      return {
        value: "Nuevo",
        color: "#2563EB",
      };
    }

    return {
      value: "0%",
      color: "#64748B",
    };
  }

  const diff = ((current - previous) / previous) * 100;
  const rounded = Math.round(diff);
  const prefix = rounded > 0 ? "+" : "";

  return {
    value: `${prefix}${rounded}%`,
    color:
      rounded > 0 ? "#16A34A" : rounded < 0 ? "#DC2626" : "#64748B",
  };
}

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    quotes: [],
    clients: [],
    isLoading: true,
  });

  useEffect(() => {
    let cancelled = false;

    const loadData = async (showLoading: boolean) => {
      if (showLoading) {
        setState((current) => ({ ...current, isLoading: true }));
      }

      const [quotes, clients] = await Promise.all([
        quoteRepository.getAllQuotes(),
        clientRepository.getAllClients(),
      ]);

      if (cancelled) {
        return;
      }

      setState({
        quotes,
        clients,
        isLoading: false,
      });
    };

    void loadData(true);

    const unsubscribeQuotes = quoteRepository.subscribe(() => {
      void loadData(false);
    });

    const unsubscribeClients = clientRepository.subscribe(() => {
      void loadData(false);
    });

    return () => {
      cancelled = true;
      unsubscribeQuotes();
      unsubscribeClients();
    };
  }, []);

  const dashboard = useMemo(() => {
    const now = new Date();
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const clientNameLookup = state.clients.reduce<Record<string, string>>(
      (acc, client) => {
        acc[normalizeText(client.name)] = client.name;
        return acc;
      },
      {},
    );

    const currentMonthQuotes = state.quotes.filter((quote) =>
      isQuoteInMonth(quote, now),
    );
    const previousMonthQuotes = state.quotes.filter((quote) =>
      isQuoteInMonth(quote, previousMonth),
    );

    const currentMonthSentQuotes = currentMonthQuotes.filter(
      (quote) => quote.status === "sent",
    );

    const uniqueClientsThisMonth = new Set(
      currentMonthQuotes
        .map((quote) => normalizeText(quote.clientName))
        .filter(Boolean),
    );

    const recentActivity = sortQuotesDesc(
      state.quotes.filter((quote) => quote.status === "sent"),
    )
      .slice(0, 5)
      .map<DashboardActivity>((quote) => ({
        id: quote.id,
        quoteNumber: quote.quoteNumber,
        client:
          clientNameLookup[normalizeText(quote.clientName)] || quote.clientName,
        amount: formatARS(quote.total),
        date: new Intl.DateTimeFormat("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(quote.createdAt)),
      }));

    const variation = formatMonthVariation(
      currentMonthQuotes.length,
      previousMonthQuotes.length,
    );

    const stats: DashboardStat[] = [
      {
        value: String(currentMonthQuotes.length),
        label: "Presupuestos este mes",
        color: "#2563EB",
      },
      {
        value: String(uniqueClientsThisMonth.size),
        label: "Clientes este mes",
        color: "#16A34A",
      },
      {
        value: String(currentMonthSentQuotes.length),
        label: "Presupuestos enviados",
        color: "#7C3AED",
      },
      {
        value: variation.value,
        label: "Variación mensual",
        color: variation.color,
      },
    ];

    return {
      stats,
      recentActivity,
      isLoading: state.isLoading,
    };
  }, [state.clients, state.isLoading, state.quotes]);

  return dashboard;
}
