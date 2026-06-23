import type { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { PremiumUpgradeScreen } from "@/components/premium-upgrade-screen";
import { useSubscriptionStore } from "@/store/subscriptionStore";

export function PremiumGate({ children }: { children: ReactNode }) {
  const { isLoading, isPremium } = useSubscriptionStore((state) => ({
    isLoading: state.isLoading,
    isPremium: state.isPremium,
  }));

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!isPremium) {
    return <PremiumUpgradeScreen />;
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
});
