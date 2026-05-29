import { Link } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  HistoryIcon,
  HomeIcon,
  MoreIcon,
  PlusIcon,
  UsersIcon,
} from "./dashboard-icons";

export type DashboardTab = "home" | "history" | "clients" | "more";

type DashboardTabBarProps = {
  activeTab?: DashboardTab;
};

const INACTIVE = "#9CA3AF";
const ACTIVE = "#2563EB";

export function DashboardTabBar({ activeTab = "home" }: DashboardTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <TabItem
        label="Inicio"
        active={activeTab === "home"}
        icon={<HomeIcon color={activeTab === "home" ? ACTIVE : INACTIVE} />}
      />

      <TabItem
        label="Historial"
        active={activeTab === "history"}
        icon={
          <HistoryIcon color={activeTab === "history" ? ACTIVE : INACTIVE} />
        }
      />

      <Link href="/quote/new" asChild>
        <Pressable style={styles.fab}>
          <PlusIcon size={26} />
        </Pressable>
      </Link>

      <TabItem
        label="Clientes"
        active={activeTab === "clients"}
        icon={
          <UsersIcon color={activeTab === "clients" ? ACTIVE : INACTIVE} />
        }
      />

      <TabItem
        label="Más"
        active={activeTab === "more"}
        icon={<MoreIcon color={activeTab === "more" ? ACTIVE : INACTIVE} />}
      />
    </View>
  );
}

function TabItem({
  label,
  icon,
  active,
}: {
  label: string;
  icon: ReactNode;
  active?: boolean;
}) {
  return (
    <View style={styles.tab}>
      {icon}
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
    paddingHorizontal: 8,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingBottom: 2,
  },

  tabLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: INACTIVE,
  },

  tabLabelActive: {
    color: ACTIVE,
    fontWeight: "600",
  },

  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ACTIVE,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -28,
    shadowColor: "#2563EB",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
