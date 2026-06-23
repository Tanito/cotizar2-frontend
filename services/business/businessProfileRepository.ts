import AsyncStorage from "@react-native-async-storage/async-storage";

import type { BusinessProfile } from "@/lib/models/businessProfile";

export interface BusinessProfileRepository {
  getProfile(): Promise<BusinessProfile | null>;
  saveProfile(profile: BusinessProfile): Promise<void>;
  subscribe(listener: () => void): () => void;
}

type BusinessProfilePayload = {
  profile: BusinessProfile | null;
};

const STORAGE_KEY = "@cotizar/business-profile";

function isBusinessProfile(value: unknown): value is BusinessProfile {
  if (typeof value !== "object" || value === null) return false;

  const profile = value as Partial<BusinessProfile>;

  return (
    typeof profile.businessName === "string" &&
    typeof profile.businessType === "string" &&
    typeof profile.phone === "string" &&
    typeof profile.email === "string" &&
    typeof profile.createdAt === "string" &&
    typeof profile.updatedAt === "string" &&
    (typeof profile.address === "string" || profile.address === undefined) &&
    (typeof profile.website === "string" || profile.website === undefined) &&
    (typeof profile.cuit === "string" || profile.cuit === undefined) &&
    (typeof profile.ivaCondition === "string" ||
      profile.ivaCondition === undefined)
  );
}

class LocalBusinessProfileRepository implements BusinessProfileRepository {
  private cache: BusinessProfile | null = null;
  private loaded = false;
  private readonly listeners = new Set<() => void>();
  private operationQueue: Promise<void> = Promise.resolve();

  private async loadFromStorage(): Promise<BusinessProfile | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.cache = null;
        this.loaded = true;
        return null;
      }

      const parsed = JSON.parse(raw) as Partial<BusinessProfilePayload>;
      const profile = parsed.profile && isBusinessProfile(parsed.profile)
        ? parsed.profile
        : null;

      this.cache = profile;
      this.loaded = true;
      return profile;
    } catch {
      this.cache = null;
      this.loaded = true;
      return null;
    }
  }

  private async ensureLoaded(): Promise<BusinessProfile | null> {
    if (this.loaded) {
      return this.cache;
    }

    return this.loadFromStorage();
  }

  private async writeCache(): Promise<void> {
    const payload: BusinessProfilePayload = {
      profile: this.cache,
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

  async getProfile(): Promise<BusinessProfile | null> {
    return this.enqueue(async () => this.ensureLoaded());
  }

  async saveProfile(profile: BusinessProfile): Promise<void> {
    await this.enqueue(async () => {
      this.cache = profile;
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

export const businessProfileRepository: BusinessProfileRepository =
  new LocalBusinessProfileRepository();

