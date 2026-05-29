import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DashboardTabBar } from "@/components/dashboard-tab-bar";

type CatalogTab = "Productos" | "Servicios";

type CatalogItem = {
  id: string;
  name: string;
  price: string;
  type: CatalogTab;
};

const ITEMS: CatalogItem[] = [
  {
    id: "1",
    name: "Instalación Split 3500",
    price: "$ 120.000,00",
    type: "Servicios",
  },
  {
    id: "2",
    name: "Instalación Split 5000",
    price: "$ 135.000,00",
    type: "Servicios",
  },
  {
    id: "3",
    name: "Instalación Split 7000",
    price: "$ 150.000,00",
    type: "Servicios",
  },
  {
    id: "4",
    name: 'Caño de cobre 1/4"',
    price: "$ 2.500,00",
    type: "Productos",
  },
  {
    id: "5",
    name: "Cable 4 x 1,5 mm²",
    price: "$ 1.800,00",
    type: "Productos",
  },
  {
    id: "6",
    name: "Gas R410A (kg)",
    price: "$ 8.500,00",
    type: "Productos",
  },
];

export default function CatalogScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CatalogTab>("Productos");

  const items = ITEMS.filter((item) => item.type === activeTab);

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </Pressable>
        <Text style={styles.title}>Catálogo</Text>
        <Pressable hitSlop={8} style={styles.addButton}>
          <Ionicons name="add" size={26} color="#0F172A" />
        </Pressable>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons
          name="search-outline"
          size={18}
          color="#9CA3AF"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Buscar productos o servicios"
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.tabs}>
        {(["Productos", "Servicios"] as const).map((tab) => {
          const active = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={styles.tab}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {tab}
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
              <Ionicons name="cube-outline" size={18} color="#9CA3AF" />
            </View>
            <Text style={styles.rowName}>{item.name}</Text>
            <Text style={styles.rowPrice}>{item.price}</Text>
          </View>
        ))}

        <Pressable style={styles.seeAll}>
          <Text style={styles.seeAllText}>Ver todos</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.tabBarWrap}>
        <DashboardTabBar activeTab="more" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },

  addButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 12,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#0F172A",
  },

  tabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    marginBottom: 4,
  },

  tab: {
    marginRight: 24,
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  rowName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#0F172A",
  },

  rowPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  seeAll: {
    alignSelf: "flex-end",
    marginTop: 16,
    paddingVertical: 8,
  },

  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
  },

  tabBarWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
