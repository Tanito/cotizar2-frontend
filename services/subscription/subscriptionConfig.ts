import { Platform } from "react-native";

export const REVENUECAT_CONFIG = {
  entitlementId: "premium",
  offeringId: "default",
  productId: "cotizar_premium_monthly",
} as const;

const ANDROID_API_KEY =
  process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ?? "";
const IOS_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? "";

export function getRevenueCatApiKey(): string {
  const key = Platform.select({
    android: ANDROID_API_KEY,
    ios: IOS_API_KEY,
    default: ANDROID_API_KEY || IOS_API_KEY,
  });

  return key ?? "";
}

