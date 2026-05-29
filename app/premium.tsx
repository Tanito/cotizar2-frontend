import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PREMIUM_FEATURES = [
  "Sin límites",
  "Logo propio en PDFs",
  "Exportar/importar datos",
  "Copia de seguridad manual",
  "Todo offline",
  "Pago económico",
] as const;

const CLOUD_FEATURES = [
  "Backup automático",
  "Restaurar al cambiar de celular sin archivos",
  "Sincronización entre dispositivos",
  "Posible portal web futuro",
  "Historial de versiones",
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
        <Text style={styles.headerTitle}>Planes Premium</Text>
        <View style={styles.backPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Elegí el plan que mejor se adapte a tu negocio. Ambos incluyen todas
          las herramientas para cotizar sin límites.
        </Text>

        <View style={styles.planCard}>
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>🔵 PREMIUM</Text>
          </View>

          <FeatureList items={PREMIUM_FEATURES} />

          <Text style={styles.price}>USD 5 / mes</Text>

          <Link href="/login" asChild>
            <Pressable style={styles.planButton}>
              <Text style={styles.planButtonText}>Elegir Premium</Text>
            </Pressable>
          </Link>
        </View>

        <View style={[styles.planCard, styles.planCardHighlight]}>
          <View style={[styles.planBadge, styles.planBadgeCloud]}>
            <Text style={styles.planBadgeText}>☁️ PREMIUM CLOUD</Text>
          </View>

          <Text style={styles.includesLabel}>Todo lo anterior, más:</Text>

          <FeatureList items={CLOUD_FEATURES} />

          <Text style={styles.price}>USD 10 / mes</Text>

          <Link href="/login" asChild>
            <Pressable style={styles.planButtonPrimary}>
              <Text style={styles.planButtonPrimaryText}>
                Elegir Premium Cloud
              </Text>
            </Pressable>
          </Link>
        </View>

        <Text style={styles.disclaimer}>
          Los precios son referenciales para la demo. El cobro se activará cuando
          esté disponible la suscripción.
        </Text>
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
    marginBottom: 24,
  },

  planCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
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
    fontSize: 15,
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

  price: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 20,
  },

  planButton: {
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
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
    color: "#94A3B8",
    textAlign: "center",
  },
});
