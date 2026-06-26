import { useSyncExternalStore } from "react";

import { revenueCatSubscriptionService } from "./revenueCatSubscriptionService";
import type {
  SubscriptionActionResult,
  SubscriptionSnapshot,
  SubscriptionState,
} from "./subscription.types";

type SubscriptionStore = SubscriptionState & {
  initializeSubscription: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  purchasePremium: () => Promise<SubscriptionActionResult>;
  restorePurchases: () => Promise<SubscriptionActionResult>;
};

let state: SubscriptionState = {
  isPremium: false,
  isLoading: true,
  initialized: false,
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

function applySnapshot(snapshot: SubscriptionSnapshot) {
  setState(snapshot);
}

async function initializeSubscription(): Promise<void> {
  setState({ isLoading: true, error: null });
  const snapshot = await revenueCatSubscriptionService.initialize();
  applySnapshot(snapshot);
}

async function refreshSubscription(): Promise<void> {
  setState({ isLoading: true, error: null });

  try {
    const snapshot = await revenueCatSubscriptionService.refreshSubscription();
    applySnapshot(snapshot);
  } catch (error) {
    setState({
      isLoading: false,
      initialized: true,
      isPremium: state.isPremium,
      error:
        error instanceof Error && error.message.trim()
          ? error.message
          : "No se pudo actualizar el estado de la suscripción.",
    });
  }
}

async function purchasePremium(): Promise<SubscriptionActionResult> {
  setState({ isLoading: true, error: null });

  try {
    const result = await revenueCatSubscriptionService.purchasePremium();
    setState({
      isLoading: false,
      initialized: true,
      isPremium: result.isPremium,
      error: null,
    });
    return result;
  } catch (error) {
    const message =
      error instanceof Error && error.message.trim()
        ? error.message
        : "No se pudo completar la compra.";
    setState({ isLoading: false, initialized: true, error: message });
    throw new Error(message);
  }
}

async function restorePurchases(): Promise<SubscriptionActionResult> {
  setState({ isLoading: true, error: null });

  try {
    const result = await revenueCatSubscriptionService.restorePurchases();
    setState({
      isLoading: false,
      initialized: true,
      isPremium: result.isPremium,
      error: null,
    });
    return result;
  } catch (error) {
    const message =
      error instanceof Error && error.message.trim()
        ? error.message
        : "No fue posible restaurar las compras.\nIntentá nuevamente más tarde.";
    setState({ isLoading: false, initialized: true, error: message });
    throw new Error(message);
  }
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
