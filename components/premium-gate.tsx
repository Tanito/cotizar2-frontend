import type { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { PremiumUpgradeScreen } from "@/components/premium-upgrade-screen";
import { useSubscription } from "@/services/subscription/useSubscription";

export function PremiumGate({ children }: { children: ReactNode }) {
  const { initialized, isLoading, isPremium } = useSubscription();

  if (!initialized || isLoading) {
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
