import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { subscriptionService } from "@/services/subscriptions/subscriptionService";
import { useSubscriptionStore } from "@/store/subscriptionStore";

const PREMIUM_FEATURES = [
  "Sin límites",
  "Logo propio en PDFs",
  "Exportar e importar datos",
  "Puntos de extensión para funciones futuras",
  "Base preparada para nube",
] as const;

const CLOUD_FEATURES = [
  "Backup automático",
  "Sincronización entre dispositivos",
  "Validación remota de suscripción",
  "Google Sign-In",
  "Service layer separada del storage local",
] as const;

function FeatureList({ items }: { items: readonly string[] }) {
  return (
    <View style={styles.featureList}>
      {items.map((item) => (
        <View key={item} style={styles.featureRow}>
          <View style={styles.bullet} />
          <Text style={styles.featureText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export default function PremiumPlansScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isPremium, isLoading } = useSubscriptionStore((state) => ({
    isPremium: state.isPremium,
    isLoading: state.isLoading,
  }));

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </Pressable>
        <Text style={styles.headerTitle}>Premium</Text>
        <View style={styles.backPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* <Text style={styles.intro}>
          Fase 1: suscripción local con Google Play Billing. Fase 2: nube,
          multi-dispositivo y validación remota.
        </Text> */}

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Estado actual</Text>
          <Text style={styles.statusValue}>
            {isLoading ? "Validando..." : isPremium ? "Premium activo" : "Free"}
          </Text>
        </View>

        <View style={styles.planCard}>
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>PREMIUM</Text>
          </View>

          <FeatureList items={PREMIUM_FEATURES} />

          <Pressable
            style={styles.planButtonPrimary}
            onPress={() => {
              void subscriptionService.restorePurchases();
            }}
          >
            <Text style={styles.planButtonPrimaryText}>
              Restaurar compras
            </Text>
          </Pressable>
        </View>

        <View style={[styles.planCard, styles.planCardHighlight]}>
          <View style={[styles.planBadge, styles.planBadgeCloud]}>
            <Text style={styles.planBadgeText}>PREMIUM CLOUD</Text>
          </View>

          <Text style={styles.includesLabel}>Puntos de extensión futuros</Text>

          <FeatureList items={CLOUD_FEATURES} />

          {/* <Text style={styles.disclaimer}>
            No hay backend todavía. Esta pantalla deja el camino preparado para
            `CloudSubscriptionService`, `GoogleAuthService` y `SyncService`.
          </Text> */}
          <Text style={styles.disclaimer}>
            Proximamente
          </Text>
        </View>

        <Link href="/home" asChild>
          <Pressable style={styles.planButton}>
            <Text style={styles.planButtonText}>Ir al panel Premium</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backPlaceholder: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  intro: {
    fontSize: 16,
    lineHeight: 24,
    color: "#64748B",
    marginBottom: 16,
  },
  statusCard: {
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 13,
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  statusValue: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  planCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginBottom: 20,
  },
  planCardHighlight: {
    borderColor: "#2563EB",
    borderWidth: 2,
  },
  planBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
  },
  planBadgeCloud: {
    backgroundColor: "#F0F9FF",
  },
  planBadgeText: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: "#2563EB",
  },
  includesLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 12,
  },
  featureList: {
    gap: 10,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2563EB",
    marginTop: 7,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: "#334155",
  },
  planButton: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2563EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  planButtonText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#2563EB",
  },
  planButtonPrimary: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  planButtonPrimaryText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  disclaimer: {
    fontSize: 13,
    lineHeight: 20,
    color: "#64748B",
  },
});
