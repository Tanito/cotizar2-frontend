import "react-native-reanimated";

import { useEffect, type ReactNode } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { subscriptionService } from "@/services/subscriptions/subscriptionService";
import { useSubscriptionStore } from "@/store/subscriptionStore";

function SubscriptionBootstrap({ children }: { children: ReactNode }) {
  const isLoading = useSubscriptionStore((state) => state.isLoading);

  useEffect(() => {
    void subscriptionService.initialize();
  }, []);

  if (isLoading) {
    return null;
  }

  return children;
}

export default function RootLayout() {
  return (
    <SubscriptionBootstrap>
      <>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="auto" />
      </>
    </SubscriptionBootstrap>
  );
}
