import { useEffect, type ReactNode } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useSubscription } from "@/services/subscription/useSubscription";

function SubscriptionBootstrap({ children }: { children: ReactNode }) {
  const { initialized, initializeSubscription } = useSubscription();

  useEffect(() => {
    void initializeSubscription();
  }, [initializeSubscription]);

  if (!initialized) {
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
