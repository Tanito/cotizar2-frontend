import { useEffect, useMemo, useState } from "react";

import type { CatalogItem, CatalogItemType } from "@/lib/models/catalog";
import { normalizeText } from "@/lib/utils/normalizeText";
import { catalogRepository } from "@/services/catalog/catalogRepository";

export type CatalogTab = "Productos" | "Servicios";

function toCatalogType(tab: CatalogTab): CatalogItemType {
  return tab === "Productos" ? "product" : "service";
}

function matchesSearch(item: CatalogItem, searchQuery: string): boolean {
  if (!searchQuery.trim()) return true;

  const normalizedQuery = normalizeText(searchQuery);
  const haystack = normalizeText(
    `${item.name} ${item.description ?? ""}`.trim(),
  );
  return haystack.includes(normalizedQuery);
}

function sortItems(items: CatalogItem[]): CatalogItem[] {
  return [...items].sort((left, right) =>
    left.name.localeCompare(right.name, "es", { sensitivity: "base" }),
  );
}

export function useCatalog() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<CatalogTab>("Productos");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadItems = async (showLoading: boolean) => {
      if (showLoading) {
        setIsLoading(true);
      }

      const nextItems = await catalogRepository.getAllItems();
      if (!cancelled) {
        setItems(nextItems);
        setIsLoading(false);
      }
    };

    void loadItems(true);
    const unsubscribe = catalogRepository.subscribe(() => {
      void loadItems(false);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const visibleItems = useMemo(() => {
    const currentType = toCatalogType(activeTab);

    return sortItems(
      items.filter(
        (item) =>
          item.type === currentType && matchesSearch(item, searchQuery),
      ),
    );
  }, [activeTab, items, searchQuery]);

  return {
    items,
    visibleItems,
    isLoading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    saveItem: (item: CatalogItem) => catalogRepository.saveItem(item),
    updateItem: (item: CatalogItem) => catalogRepository.updateItem(item),
    deleteItem: (id: string) => catalogRepository.deleteItem(id),
    adjustPricesByPercentage: (percentage: number) =>
      catalogRepository.adjustPricesByPercentage(percentage),
  };
}

