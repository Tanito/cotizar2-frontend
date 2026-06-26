import { useSubscriptionStore } from "./subscriptionStore";

export function useSubscription() {
  const {
    isPremium,
    isLoading,
    initialized,
    error,
    initializeSubscription,
    refreshSubscription,
    purchasePremium,
    restorePurchases,
  } = useSubscriptionStore((state) => state);

  return {
    isPremium,
    isLoading,
    initialized,
    error,
    initializeSubscription,
    refreshSubscription,
    purchasePremium,
    restorePurchases,
  };
}

