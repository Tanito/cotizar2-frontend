export type SubscriptionState = {
  isPremium: boolean;
  isLoading: boolean;
  initialized: boolean;
  error: string | null;
};

export type SubscriptionActionResult = {
  isPremium: boolean;
  message: string;
};

export type SubscriptionSnapshot = SubscriptionState;

