import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Client } from "@/lib/models/client";
import { normalizeText } from "@/lib/utils/normalizeText";

type ClientStoragePayload = {
  clients: Client[];
};

export interface ClientRepository {
  getAllClients(): Promise<Client[]>;
  searchClients(
    query: string,
    options?: {
      limit?: number;
    },
  ): Promise<Client[]>;
  saveClient(client: Client): Promise<void>;
  updateClient(client: Client): Promise<void>;
  deleteClient(id: string): Promise<void>;
  subscribe(listener: () => void): () => void;
}

const STORAGE_KEY = "@cotizar/clients";

function isClient(value: unknown): value is Client {
  if (typeof value !== "object" || value === null) return false;

  const client = value as Partial<Client>;

  return (
    typeof client.id === "string" &&
    typeof client.name === "string" &&
    typeof client.phone === "string" &&
    typeof client.createdAt === "string" &&
    (typeof client.email === "string" || client.email === undefined) &&
    (typeof client.company === "string" || client.company === undefined)
  );
}

function sortByName(clients: Client[]): Client[] {
  return [...clients].sort((left, right) =>
    left.name.localeCompare(right.name, "es", { sensitivity: "base" }),
  );
}

class LocalClientRepository implements ClientRepository {
  private cache: Client[] | null = null;

  private readonly listeners = new Set<() => void>();

  private operationQueue: Promise<void> = Promise.resolve();

  private async loadClientsFromStorage(): Promise<Client[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);

      if (!raw) {
        this.cache = [];
        return [];
      }

      const parsed = JSON.parse(raw) as Partial<ClientStoragePayload>;
      const clients = Array.isArray(parsed.clients)
        ? parsed.clients.filter(isClient)
        : [];

      this.cache = sortByName(clients);
      return this.cache;
    } catch {
      this.cache = [];
      return [];
    }
  }

  private async ensureLoaded(): Promise<Client[]> {
    if (this.cache !== null) {
      return this.cache;
    }

    return this.loadClientsFromStorage();
  }

  private async writeCache(): Promise<void> {
    const payload: ClientStoragePayload = {
      clients: sortByName(this.cache ?? []),
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

  private async upsertClient(client: Client): Promise<void> {
    await this.ensureLoaded();

    const currentClients = this.cache ?? [];
    const nextClients = currentClients.filter((entry) => entry.id !== client.id);
    nextClients.push(client);
    this.cache = sortByName(nextClients);
    await this.writeCache();
  }

  private searchInCache(
    query: string,
    options?: {
      limit?: number;
    },
  ): Client[] {
    const normalizedQuery = normalizeText(query);
    const limit = options?.limit ?? 5;

    return sortByName(this.cache ?? [])
      .filter((client) => {
        if (!normalizedQuery) {
          return true;
        }

        return normalizeText(client.name).includes(normalizedQuery);
      })
      .slice(0, limit);
  }

  async getAllClients(): Promise<Client[]> {
    return this.enqueue(async () => {
      const clients = await this.ensureLoaded();
      return sortByName(clients);
    });
  }

  async searchClients(
    query: string,
    options?: {
      limit?: number;
    },
  ): Promise<Client[]> {
    return this.enqueue(async () => {
      await this.ensureLoaded();
      return this.searchInCache(query, options);
    });
  }

  async saveClient(client: Client): Promise<void> {
    await this.enqueue(async () => {
      await this.upsertClient(client);
      this.emit();
    });
  }

  async updateClient(client: Client): Promise<void> {
    await this.enqueue(async () => {
      await this.upsertClient(client);
      this.emit();
    });
  }

  async deleteClient(id: string): Promise<void> {
    await this.enqueue(async () => {
      await this.ensureLoaded();
      this.cache = (this.cache ?? []).filter((client) => client.id !== id);
      await this.writeCache();
      this.emit();
    });
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const clientRepository: ClientRepository = new LocalClientRepository();
