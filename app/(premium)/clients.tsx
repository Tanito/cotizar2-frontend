import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DashboardScreen } from "@/components/dashboard-screen";
import { PremiumGate } from "@/components/premium-gate";

type Client = {
  id: string;
  name: string;
  phone: string;
  quotes: number;
  initials: string;
  color: string;
};

const CLIENTS: Client[] = [
  {
    id: "1",
    name: "Juan Pérez",
    phone: "+54 11 1234-5678",
    quotes: 3,
    initials: "JP",
    color: "#2563EB",
  },
  {
    id: "2",
    name: "María Gómez",
    phone: "+54 11 9876-5432",
    quotes: 2,
    initials: "MG",
    color: "#7C3AED",
  },
  {
    id: "3",
    name: "Empresa SRL",
    phone: "+54 11 5555-0000",
    quotes: 5,
    initials: "ES",
    color: "#0F172A",
  },
  {
    id: "4",
    name: "Lucas Martínez",
    phone: "+54 11 4444-1111",
    quotes: 1,
    initials: "LM",
    color: "#16A34A",
  },
  {
    id: "5",
    name: "Ana Torres",
    phone: "+54 11 2222-3333",
    quotes: 2,
    initials: "AT",
    color: "#EA580C",
  },
];

export default function ClientsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <PremiumGate>
      <DashboardScreen activeTab="clients">
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Text style={styles.title}>Clientes</Text>
          <View style={styles.headerActions}>
            <Pressable hitSlop={8} style={styles.iconButton}>
              <Ionicons name="search-outline" size={22} color="#0F172A" />
            </Pressable>
            <Pressable hitSlop={8} style={styles.iconButton}>
              <Ionicons name="add" size={26} color="#0F172A" />
            </Pressable>
          </View>
        </View>

        <View style={styles.searchWrap}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#9CA3AF"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Buscar clientes"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {CLIENTS.map((client) => (
            <Pressable key={client.id} style={styles.row}>
              <View
                style={[styles.avatar, { backgroundColor: `${client.color}18` }]}
              >
                <Text style={[styles.avatarText, { color: client.color }]}>
                  {client.initials}
                </Text>
              </View>

              <View style={styles.rowContent}>
                <Text style={styles.name}>{client.name}</Text>
                <Text style={styles.phone}>{client.phone}</Text>
              </View>

              <Text style={styles.quotes}>
                {client.quotes}{" "}
                {client.quotes === 1 ? "presupuesto" : "presupuestos"}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </DashboardScreen>
    </PremiumGate>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
  },

  headerActions: {
    flexDirection: "row",
    gap: 4,
  },

  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 8,
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

  list: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  avatarText: {
    fontSize: 15,
    fontWeight: "700",
  },

  rowContent: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  phone: {
    marginTop: 2,
    fontSize: 13,
    color: "#6B7280",
  },

  quotes: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "right",
    maxWidth: 90,
  },
});
