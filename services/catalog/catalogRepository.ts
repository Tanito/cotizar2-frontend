import AsyncStorage from "@react-native-async-storage/async-storage";

import type { CatalogItem } from "@/lib/models/catalog";
import { normalizeText } from "@/lib/utils/normalizeText";

type CatalogPayload = {
  items: CatalogItem[];
};

export interface CatalogRepository {
  getAllItems(): Promise<CatalogItem[]>;
  searchItems(
    query: string,
    options?: {
      limit?: number;
      types?: Array<CatalogItem["type"]>;
    },
  ): Promise<CatalogItem[]>;
  saveItem(item: CatalogItem): Promise<void>;
  updateItem(item: CatalogItem): Promise<void>;
  deleteItem(id: string): Promise<void>;
  adjustPricesByPercentage(percentage: number): Promise<void>;
  subscribe(listener: () => void): () => void;
}

const STORAGE_KEY = "@cotizar/catalog";

function isCatalogItem(value: unknown): value is CatalogItem {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Partial<CatalogItem>;
  return (
    typeof item.id === "string" &&
    (item.type === "product" || item.type === "service") &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    typeof item.createdAt === "string" &&
    typeof item.updatedAt === "string" &&
    (typeof item.description === "string" || item.description === undefined)
  );
}

function sortByName(items: CatalogItem[]): CatalogItem[] {
  return [...items].sort((left, right) =>
    left.name.localeCompare(right.name, "es", { sensitivity: "base" }),
  );
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

class LocalCatalogRepository implements CatalogRepository {
  private cache: CatalogItem[] | null = null;
  private loaded = false;
  private readonly listeners = new Set<() => void>();
  private operationQueue: Promise<void> = Promise.resolve();

  private async ensureSeeded(items: CatalogItem[] | null): Promise<CatalogItem[]> {
    if (items && items.length > 0) {
      return items;
    }

    const now = new Date().toISOString();
    const seed: CatalogItem[] = [
      {
        id: "seed-1",
        type: "service",
        name: "Instalación Split 3500",
        price: 120000,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "seed-2",
        type: "service",
        name: "Instalación Split 5000",
        price: 135000,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "seed-3",
        type: "service",
        name: "Instalación Split 7000",
        price: 150000,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "seed-4",
        type: "product",
        name: 'Caño de cobre 1/4"',
        price: 2500,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "seed-5",
        type: "product",
        name: "Cable 4 x 1,5 mm²",
        price: 1800,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "seed-6",
        type: "product",
        name: "Gas R410A (kg)",
        price: 8500,
        createdAt: now,
        updatedAt: now,
      },
    ];

    return seed;
  }

  private async loadFromStorage(): Promise<CatalogItem[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const seeded = await this.ensureSeeded(null);
        this.cache = sortByName(seeded);
        this.loaded = true;
        await this.writeCache();
        return this.cache;
      }

      const parsed = JSON.parse(raw) as Partial<CatalogPayload>;
      const items = Array.isArray(parsed.items)
        ? parsed.items.filter(isCatalogItem)
        : [];

      const nextItems = await this.ensureSeeded(items);
      this.cache = sortByName(nextItems);
      this.loaded = true;
      return this.cache;
    } catch {
      const seeded = await this.ensureSeeded(null);
      this.cache = sortByName(seeded);
      this.loaded = true;
      await this.writeCache();
      return this.cache;
    }
  }

  private async ensureLoaded(): Promise<CatalogItem[]> {
    if (this.loaded) {
      return this.cache ?? [];
    }

    return this.loadFromStorage();
  }

  private async writeCache(): Promise<void> {
    const payload: CatalogPayload = {
      items: sortByName(this.cache ?? []),
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  private enqueue<T>(task: () => Promise<T>): Promise<T> {
    const next = this.operationQueue.then(task, task);
    this.operationQueue = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  }

  private emit() {
    this.listeners.forEach((listener) => listener());
  }

  private async upsertItem(item: CatalogItem): Promise<void> {
    await this.ensureLoaded();

    const currentItems = this.cache ?? [];
    const nextItems = currentItems.filter((entry) => entry.id !== item.id);
    nextItems.push(item);
    this.cache = sortByName(nextItems);
    await this.writeCache();
  }

  private searchInCache(
    query: string,
    options?: {
      limit?: number;
      types?: Array<CatalogItem["type"]>;
    },
  ): CatalogItem[] {
    const normalizedQuery = normalizeText(query);
    const limit = options?.limit ?? 6;
    const types = options?.types ?? ["product", "service"];

    return sortByName(this.cache ?? [])
      .filter((item) => types.includes(item.type))
      .filter((item) => {
        if (!normalizedQuery) {
          return true;
        }

        const haystack = normalizeText(`${item.name} ${item.description ?? ""}`);
        return haystack.includes(normalizedQuery);
      })
      .slice(0, limit);
  }

  async getAllItems(): Promise<CatalogItem[]> {
    return this.enqueue(async () => {
      const items = await this.ensureLoaded();
      return sortByName(items);
    });
  }

  async searchItems(
    query: string,
    options?: {
      limit?: number;
      types?: Array<CatalogItem["type"]>;
    },
  ): Promise<CatalogItem[]> {
    return this.enqueue(async () => {
      await this.ensureLoaded();
      return this.searchInCache(query, options);
    });
  }

  async saveItem(item: CatalogItem): Promise<void> {
    await this.enqueue(async () => {
      await this.upsertItem(item);
      this.emit();
    });
  }

  async updateItem(item: CatalogItem): Promise<void> {
    await this.enqueue(async () => {
      await this.upsertItem(item);
      this.emit();
    });
  }

  async deleteItem(id: string): Promise<void> {
    await this.enqueue(async () => {
      await this.ensureLoaded();
      this.cache = (this.cache ?? []).filter((item) => item.id !== id);
      await this.writeCache();
      this.emit();
    });
  }

  async adjustPricesByPercentage(percentage: number): Promise<void> {
    await this.enqueue(async () => {
      await this.ensureLoaded();
      const factor = 1 + percentage / 100;
      const now = new Date().toISOString();

      this.cache = sortByName(
        (this.cache ?? []).map((item) => ({
          ...item,
          price: roundToTwoDecimals(item.price * factor),
          updatedAt: now,
        })),
      );

      await this.writeCache();
      this.emit();
    });
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const catalogRepository: CatalogRepository = new LocalCatalogRepository();
