import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BellIcon, DocumentIcon } from "@/components/dashboard-icons";
import { DashboardTabBar } from "@/components/dashboard-tab-bar";

const STATS = [
  { value: "12", label: "Presupuestos este mes", color: "#2563EB" },
  { value: "$ 1.250.000", label: "Ventas estimadas", color: "#2563EB" },
  { value: "8", label: "Clientes", color: "#16A34A" },
  { value: "5", label: "Pendientes", color: "#DC2626" },
] as const;

const ACTIVITY = [
  {
    id: "000123",
    client: "Juan Pérez",
    amount: "$ 145.500",
    date: "24/05/2024",
  },
  {
    id: "000122",
    client: "María Gómez",
    amount: "$ 89.200",
    date: "23/05/2024",
  },
  {
    id: "000121",
    client: "Lucas Martínez",
    amount: "$ 210.000",
    date: "22/05/2024",
  },
] as const;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10}}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View style={styles.headerTop}>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>¡Hola, Juan! 👋</Text>
              <Text style={styles.subtitle}>
                Acá tenés el resumen de tu negocio.
              </Text>
            </View>

            <Pressable style={styles.bellButton} hitSlop={8}>
              <BellIcon />
              <View style={styles.bellBadge} />
            </Pressable>
          </View>

          <View style={styles.statsGrid}>
            {STATS.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Text style={[styles.statValue, { color: stat.color }]}>
                  {stat.value}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Actividad reciente</Text>
            <Pressable hitSlop={8}>
              <Text style={styles.sectionLink}>Ver todos</Text>
            </Pressable>
          </View>

          <View style={styles.activityList}>
            {ACTIVITY.map((item) => (
              <View key={item.id} style={styles.activityItem}>
                <View style={styles.activityIconWrap}>
                  <DocumentIcon size={20} />
                </View>

                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>
                    Presupuesto #{item.id}
                  </Text>
                  <Text style={styles.activityClient}>{item.client}</Text>
                </View>

                <View style={styles.activityMeta}>
                  <Text style={styles.activityAmount}>{item.amount}</Text>
                  <Text style={styles.activityDate}>{item.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.tabBarWrap}>
        <DashboardTabBar activeTab="home" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scroll: {
    flex: 1,
  },

  header: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingTop: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  headerText: {
    flex: 1,
    paddingRight: 12,
  },

  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(255, 255, 255, 0.9)",
  },

  bellButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  bellBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#2563EB",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingBottom: 12,
  },

  statCard: {
    width: "47%",
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  statValue: {
    fontSize: 22,
    fontWeight: "800",
  },

  statLabel: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
  },

  body: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  sectionLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
  },

  activityList: {
    gap: 4,
  },

  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  activityIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  activityContent: {
    flex: 1,
  },

  activityTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  activityClient: {
    marginTop: 2,
    fontSize: 13,
    color: "#6B7280",
  },

  activityMeta: {
    alignItems: "flex-end",
  },

  activityAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  activityDate: {
    marginTop: 2,
    fontSize: 12,
    color: "#9CA3AF",
  },

  tabBarWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
