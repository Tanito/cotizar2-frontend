import type { CustomerInfo } from "react-native-purchases";

import type {
  SubscriptionActionResult,
  SubscriptionSnapshot,
} from "./subscription.types";

export interface SubscriptionService {
  initialize(): Promise<SubscriptionSnapshot>;
  refreshSubscription(): Promise<SubscriptionSnapshot>;
  purchasePremium(): Promise<SubscriptionActionResult>;
  restorePurchases(): Promise<SubscriptionActionResult>;
}

