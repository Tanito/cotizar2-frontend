import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { useSubscription } from "@/services/subscription/useSubscription";

export function PremiumUpgradeScreen() {
  const { restorePurchases } = useSubscription();
  const [isRestoring, setIsRestoring] = useState(false);

  const onRestorePurchases = async () => {
    setIsRestoring(true);
    try {
      const result = await restorePurchases();
      if (result.message.trim()) {
        Alert.alert("Compras restauradas", result.message);
      }
    } catch (error) {
      const message =
        error instanceof Error && error.message.trim()
          ? error.message
          : "No fue posible restaurar las compras.\nIntentá nuevamente más tarde.";
      Alert.alert("No se pudo restaurar", message);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <View style={styles.container}>
      <Link href="/" asChild>
        <Pressable style={styles.backButton} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </Pressable>
      </Link>

      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PREMIUM</Text>
        </View>

        <Text style={styles.title}>Esta función requiere suscripción</Text>

        <Text style={styles.description}>
          La app sigue funcionando sin cuenta. Para desbloquear lo Premium,
          restaurá tu compra o revisá los planes disponibles.
        </Text>

        <Pressable
          style={[styles.primaryButton, isRestoring && styles.buttonDisabled]}
          onPress={() => void onRestorePurchases()}
          disabled={isRestoring}
        >
          <Text style={styles.primaryButtonText}>
            {isRestoring ? "Restaurando..." : "Restaurar compras"}
          </Text>
        </Pressable>

        <Link href="/premium" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Ver planes Premium</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    width: 40,
    height: 40,
    marginBottom: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  card: {
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 18,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2563EB",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "800",
    color: "#0F172A",
  },
  description: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 22,
    color: "#475569",
  },
  primaryButton: {
    marginTop: 24,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  secondaryButton: {
    marginTop: 12,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563EB",
  },
});
