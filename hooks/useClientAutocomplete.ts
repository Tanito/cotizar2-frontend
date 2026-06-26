import { useEffect, useState } from "react";

import type { Client } from "@/lib/models/client";
import { clientRepository } from "@/services/clients/clientRepository";

export function useClientAutocomplete(query: string, enabled: boolean) {
  const [suggestions, setSuggestions] = useState<Client[]>([]);

  useEffect(() => {
    let cancelled = false;

    if (!enabled || !query.trim()) {
      setSuggestions([]);
      return () => {
        cancelled = true;
      };
    }

    const loadSuggestions = async () => {
      const nextSuggestions = await clientRepository.searchClients(query, {
        limit: 5,
      });

      if (!cancelled) {
        setSuggestions(nextSuggestions);
      }
    };

    void loadSuggestions();
    const unsubscribe = clientRepository.subscribe(() => {
      void loadSuggestions();
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [enabled, query]);

  return suggestions;
}
