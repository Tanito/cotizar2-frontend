import { useSyncExternalStore } from "react";

export type SubscriptionState = {
  isPremium: boolean;
  isLoading: boolean;
};

type SubscriptionStore = SubscriptionState & {
  setPremium: (isPremium: boolean) => void;
  setLoading: (isLoading: boolean) => void;
};

let state: SubscriptionState = {
  isPremium: false,
  isLoading: true,
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

export const subscriptionStore = {
  getState: getSnapshot,
  setPremium(isPremium: boolean) {
    setState({ isPremium });
  },
  setLoading(isLoading: boolean) {
    setState({ isLoading });
  },
};

export function useSubscriptionStore<T>(
  selector: (state: SubscriptionStore) => T,
): T {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return selector({
    ...snapshot,
    setPremium: subscriptionStore.setPremium,
    setLoading: subscriptionStore.setLoading,
  });
}
