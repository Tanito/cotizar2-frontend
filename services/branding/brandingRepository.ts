import AsyncStorage from "@react-native-async-storage/async-storage";

import type { BrandingSettings } from "@/lib/models/branding";

export interface BrandingRepository {
  getBranding(): Promise<BrandingSettings | null>;
  saveBranding(settings: BrandingSettings): Promise<void>;
  subscribe(listener: () => void): () => void;
}

type BrandingPayload = {
  branding: BrandingSettings | null;
};

const STORAGE_KEY = "@cotizar/branding";

function isBrandingSettings(value: unknown): value is BrandingSettings {
  if (typeof value !== "object" || value === null) return false;

  const branding = value as Partial<BrandingSettings>;

  return (
    typeof branding.brandName === "string" &&
    typeof branding.updatedAt === "string" &&
    (typeof branding.logoUri === "string" || branding.logoUri === undefined)
  );
}

class LocalBrandingRepository implements BrandingRepository {
  private cache: BrandingSettings | null = null;
  private loaded = false;
  private readonly listeners = new Set<() => void>();
  private operationQueue: Promise<void> = Promise.resolve();

  private async loadFromStorage(): Promise<BrandingSettings | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.cache = null;
        this.loaded = true;
        return null;
      }

      const parsed = JSON.parse(raw) as Partial<BrandingPayload>;
      const branding = parsed.branding && isBrandingSettings(parsed.branding)
        ? parsed.branding
        : null;

      this.cache = branding;
      this.loaded = true;
      return branding;
    } catch {
      this.cache = null;
      this.loaded = true;
      return null;
    }
  }

  private async ensureLoaded(): Promise<BrandingSettings | null> {
    if (this.loaded) {
      return this.cache;
    }

    return this.loadFromStorage();
  }

  private async writeCache(): Promise<void> {
    const payload: BrandingPayload = {
      branding: this.cache,
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

  async getBranding(): Promise<BrandingSettings | null> {
    return this.enqueue(async () => this.ensureLoaded());
  }

  async saveBranding(settings: BrandingSettings): Promise<void> {
    await this.enqueue(async () => {
      this.cache = settings;
      this.loaded = true;
      await this.writeCache();
      this.emit();
    });
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const brandingRepository: BrandingRepository =
  new LocalBrandingRepository();

