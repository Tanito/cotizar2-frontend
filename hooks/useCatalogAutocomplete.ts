import { useEffect, useState } from "react";

import type { CatalogItem } from "@/lib/models/catalog";
import { catalogRepository } from "@/services/catalog/catalogRepository";

export function useCatalogAutocomplete(query: string, enabled: boolean) {
  const [suggestions, setSuggestions] = useState<CatalogItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    if (!enabled || !query.trim()) {
      setSuggestions([]);
      return () => {
        cancelled = true;
      };
    }

    const loadSuggestions = async () => {
      const nextSuggestions = await catalogRepository.searchItems(query, {
        limit: 6,
        types: ["product", "service"],
      });

      if (!cancelled) {
        setSuggestions(nextSuggestions);
      }
    };

    void loadSuggestions();
    const unsubscribe = catalogRepository.subscribe(() => {
      void loadSuggestions();
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [enabled, query]);

  return suggestions;
}
