import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DocumentIcon } from "@/components/dashboard-icons";
import { DashboardScreen } from "@/components/dashboard-screen";
import { PremiumGate } from "@/components/premium-gate";
import { useQuotes } from "@/hooks/useQuotes";
import type { QuoteFilter, QuoteSortOrder } from "@/lib/models/quote";
import {
  formatCurrencyAmounts,
  getStoredQuoteCurrencyAmounts,
} from "@/lib/utils/quoteUtils";

const FILTER_TABS: { label: string; value: QuoteFilter }[] = [
  // { label: "Todos", value: "all" },
  // { label: "Borradores", value: "draft" },
  // { label: "Enviados", value: "sent" },
];

const SORT_OPTIONS: { label: string; value: QuoteSortOrder }[] = [
  { label: "Fecha descendente", value: "desc" },
  { label: "Fecha ascendente", value: "asc" },
];

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("es-AR");
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isSortVisible, setIsSortVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const {
    visibleQuotes,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
  } = useQuotes();

  const openSearch = () => {
    setSearchInput(searchQuery);
    setIsSearchVisible(true);
  };

  const applySearch = () => {
    setSearchQuery(searchInput);
    setIsSearchVisible(false);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setIsSearchVisible(false);
  };

  return (
    <PremiumGate>
      <DashboardScreen activeTab="history">
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Text style={styles.title}>Historial</Text>
          <View style={styles.headerActions}>
            <Pressable hitSlop={8} style={styles.iconButton} onPress={openSearch}>
              <Ionicons name="search-outline" size={22} color="#0F172A" />
            </Pressable>
            <Pressable
              hitSlop={8}
              style={styles.iconButton}
              onPress={() => setIsSortVisible(true)}
            >
              <Ionicons name="filter-outline" size={22} color="#0F172A" />
            </Pressable>
          </View>
        </View>

        <View style={styles.tabs}>
          {FILTER_TABS.map((filter) => {
            const active = activeFilter === filter.value;
            return (
              <Pressable
                key={filter.value}
                onPress={() => setActiveFilter(filter.value)}
                style={styles.tab}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {filter.label}
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
          {visibleQuotes.map((item) => (
            <View key={item.id} style={styles.row}>
              <View style={styles.rowIcon}>
                <DocumentIcon size={18} />
              </View>

              <View style={styles.rowMain}>
                <Text style={styles.rowId}>{item.quoteNumber}</Text>
                <Text style={styles.rowClient}>{item.clientName}</Text>
              </View>

              <View style={styles.rowCenter}>
                <Text style={styles.rowAmount}>
                  {formatCurrencyAmounts(
                    getStoredQuoteCurrencyAmounts(item),
                    "\n",
                  )}
                </Text>
                <Text style={styles.rowDate}>{formatDate(item.createdAt)}</Text>
              </View>

              {/* <View style={styles.rowEnd}>
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
                    {item.status === "draft" ? "Borrador" : "Enviado"}
                  </Text>
                </View>
                {item.status === "sent" ? (
                  <Pressable hitSlop={6} style={styles.whatsapp}>
                    <WhatsAppIcon size={18} />
                  </Pressable>
                ) : (
                  <View style={styles.whatsappPlaceholder} />
                )}
              </View> */}
            </View>
          ))}
        </ScrollView>
      </DashboardScreen>

      <Modal
        animationType="fade"
        transparent
        visible={isSearchVisible}
        onRequestClose={() => setIsSearchVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsSearchVisible(false)}
        >
          <Pressable style={styles.modalCard} onPress={() => null}>
            <Text style={styles.modalTitle}>Buscar presupuestos</Text>
            <Text style={styles.modalSubtitle}>
              Buscá por nombre, apellido o nombre completo.
            </Text>

            <TextInput
              value={searchInput}
              onChangeText={setSearchInput}
              placeholder="Ej: juan perez"
              placeholderTextColor="#94A3B8"
              style={styles.modalInput}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={applySearch}
            />

            <View style={styles.modalActions}>
              <Pressable style={styles.modalSecondaryButton} onPress={clearSearch}>
                <Text style={styles.modalSecondaryButtonText}>Limpiar</Text>
              </Pressable>
              <Pressable style={styles.modalPrimaryButton} onPress={applySearch}>
                <Text style={styles.modalPrimaryButtonText}>Buscar</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={isSortVisible}
        onRequestClose={() => setIsSortVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsSortVisible(false)}
        >
          <Pressable style={styles.modalCard} onPress={() => null}>
            <Text style={styles.modalTitle}>Ordenar por fecha</Text>
            <Text style={styles.modalSubtitle}>
              Elegí si querés ver primero los más nuevos o los más antiguos.
            </Text>

            <View style={styles.sortOptions}>
              {SORT_OPTIONS.map((option) => {
                const active = sortOrder === option.value;
                return (
                  <Pressable
                    key={option.value}
                    style={[styles.sortOption, active && styles.sortOptionActive]}
                    onPress={() => {
                      setSortOrder(option.value);
                      setIsSortVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        active && styles.sortOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </PremiumGate>
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
    flex: 1,
  },

  rowId: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: "#94A3B8",
  },

  rowClient: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

  rowCenter: {
    alignItems: "flex-end",
    marginRight: 12,
  },

  rowAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  rowDate: {
    marginTop: 2,
    fontSize: 12,
    color: "#64748B",
  },

  rowEnd: {
    alignItems: "flex-end",
    gap: 8,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },

  whatsapp: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  whatsappPlaceholder: {
    width: 28,
    height: 28,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.28)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  modalCard: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },

  modalSubtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#64748B",
  },

  modalInput: {
    marginTop: 16,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#0F172A",
  },

  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  modalSecondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },

  modalSecondaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
  },

  modalPrimaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  modalPrimaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  sortOptions: {
    gap: 12,
    marginTop: 16,
  },

  sortOption: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    justifyContent: "center",
  },

  sortOptionActive: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },

  sortOptionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

  sortOptionTextActive: {
    color: "#2563EB",
  },
});
