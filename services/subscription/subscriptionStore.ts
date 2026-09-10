import { useSyncExternalStore } from "react";

import type {
  SubscriptionActionResult,
  SubscriptionState,
} from "./subscription.types";

type SubscriptionStore = SubscriptionState & {
  initializeSubscription: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  purchasePremium: () => Promise<SubscriptionActionResult>;
  restorePurchases: () => Promise<SubscriptionActionResult>;
};

let state: SubscriptionState = {
  isPremium: true,
  isLoading: false,
  initialized: true,
  error: null,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(nextState: Partial<SubscriptionState>) {
  state = { ...state, ...nextState };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

async function initializeSubscription(): Promise<void> {
  setState({
    isPremium: true,
    isLoading: false,
    initialized: true,
    error: null,
  });
}

async function refreshSubscription(): Promise<void> {
  await initializeSubscription();
}

async function purchasePremium(): Promise<SubscriptionActionResult> {
  await initializeSubscription();
  return {
    isPremium: true,
    message: "Premium está habilitado en esta versión personal.",
  };
}

async function restorePurchases(): Promise<SubscriptionActionResult> {
  return purchasePremium();
}

export const subscriptionStore = {
  getState: getSnapshot,
  initializeSubscription,
  refreshSubscription,
  purchasePremium,
  restorePurchases,
};

export function useSubscriptionStore<T>(
  selector: (state: SubscriptionStore) => T,
): T {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return selector({
    ...snapshot,
    initializeSubscription,
    refreshSubscription,
    purchasePremium,
    restorePurchases,
  });
}
