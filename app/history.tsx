import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DashboardScreen } from "@/components/dashboard-screen";
import { DocumentIcon, WhatsAppIcon } from "@/components/dashboard-icons";

type QuoteStatus = "Enviado" | "Borrador" | "Aprobado";

type HistoryItem = {
  id: string;
  client: string;
  amount: string;
  date: string;
  status: QuoteStatus;
};

const FILTERS = ["Todos", "Borradores", "Enviados", "Aprobados"] as const;

const HISTORY: HistoryItem[] = [
  {
    id: "#000123",
    client: "Juan Pérez",
    amount: "$ 145.500",
    date: "24/05/2024",
    status: "Enviado",
  },
  {
    id: "#000122",
    client: "María Gómez",
    amount: "$ 89.200",
    date: "23/05/2024",
    status: "Borrador",
  },
  {
    id: "#000121",
    client: "Lucas Martínez",
    amount: "$ 210.000",
    date: "22/05/2024",
    status: "Aprobado",
  },
  {
    id: "#000120",
    client: "Ana Torres",
    amount: "$ 56.800",
    date: "21/05/2024",
    status: "Enviado",
  },
  {
    id: "#000119",
    client: "Empresa SRL",
    amount: "$ 320.000",
    date: "20/05/2024",
    status: "Borrador",
  },
];

const STATUS_STYLES: Record<
  QuoteStatus,
  { text: string; bg: string }
> = {
  Enviado: { text: "#16A34A", bg: "#DCFCE7" },
  Borrador: { text: "#6B7280", bg: "#F3F4F6" },
  Aprobado: { text: "#16A34A", bg: "#DCFCE7" },
};

function matchesFilter(item: HistoryItem, filter: (typeof FILTERS)[number]) {
  if (filter === "Todos") return true;
  if (filter === "Borradores") return item.status === "Borrador";
  if (filter === "Enviados") return item.status === "Enviado";
  return item.status === "Aprobado";
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] =
    useState<(typeof FILTERS)[number]>("Todos");

  const items = useMemo(
    () => HISTORY.filter((item) => matchesFilter(item, activeFilter)),
    [activeFilter],
  );

  return (
    <DashboardScreen activeTab="history">
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>Historial</Text>
        <View style={styles.headerActions}>
          <Pressable hitSlop={8} style={styles.iconButton}>
            <Ionicons name="search-outline" size={22} color="#0F172A" />
          </Pressable>
          <Pressable hitSlop={8} style={styles.iconButton}>
            <Ionicons name="filter-outline" size={22} color="#0F172A" />
          </Pressable>
        </View>
      </View>

      <View style={styles.tabs}>
        {FILTERS.map((filter) => {
          const active = activeFilter === filter;
          return (
            <Pressable
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={styles.tab}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {filter}
              </Text>
              {active ? <View style={styles.tabIndicator} /> : null}
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <View key={item.id} style={styles.row}>
            <View style={styles.rowIcon}>
              <DocumentIcon size={18} />
            </View>

            <View style={styles.rowMain}>
              <Text style={styles.rowId}>{item.id}</Text>
              <Text style={styles.rowClient}>{item.client}</Text>
            </View>

            <View style={styles.rowCenter}>
              <Text style={styles.rowAmount}>{item.amount}</Text>
              <Text style={styles.rowDate}>{item.date}</Text>
            </View>

            <View style={styles.rowEnd}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: STATUS_STYLES[item.status].bg },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: STATUS_STYLES[item.status].text },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
              {item.status !== "Borrador" ? (
                <Pressable hitSlop={6} style={styles.whatsapp}>
                  <WhatsAppIcon size={18} />
                </Pressable>
              ) : (
                <View style={styles.whatsappPlaceholder} />
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </DashboardScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
  },

  headerActions: {
    flexDirection: "row",
    gap: 8,
  },

  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  tabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  tab: {
    marginRight: 20,
    paddingBottom: 12,
    alignItems: "center",
  },

  tabText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#9CA3AF",
  },

  tabTextActive: {
    color: "#2563EB",
    fontWeight: "600",
  },

  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#2563EB",
  },

  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  rowMain: {
    width: 100,
  },

  rowId: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },

  rowClient: {
    marginTop: 2,
    fontSize: 12,
    color: "#6B7280",
  },

  rowCenter: {
    flex: 1,
    alignItems: "flex-start",
    paddingHorizontal: 4,
  },

  rowAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },

  rowDate: {
    marginTop: 2,
    fontSize: 12,
    color: "#9CA3AF",
  },

  rowEnd: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },

  whatsapp: {
    padding: 2,
  },

  whatsappPlaceholder: {
    width: 22,
  },
});
