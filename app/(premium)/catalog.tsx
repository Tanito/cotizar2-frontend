import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DashboardTabBar } from "@/components/dashboard-tab-bar";
import { PremiumGate } from "@/components/premium-gate";
import { useCatalog } from "@/hooks/useCatalog";
import type { CatalogItem, CatalogItemType } from "@/lib/models/catalog";
import {
  formatCatalogPrice,
  getCatalogTypeLabel,
} from "@/lib/utils/catalogUtils";
import { createUuid } from "@/lib/utils/createUuid";

type CatalogForm = {
  name: string;
  description: string;
  price: string;
  type: CatalogItemType;
};

type ActionTarget = CatalogItem | null;

function Field({
  label,
  error,
  ...props
}: TextInputProps & {
  label: string;
  error?: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor="#94A3B8"
        style={styles.input}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function toForm(item: CatalogItem | null, fallbackType: CatalogItemType): CatalogForm {
  return {
    name: item?.name ?? "",
    description: item?.description ?? "",
    price:
      item?.price !== undefined ? String(item.price.toFixed(2)) : "",
    type: item?.type ?? fallbackType,
  };
}

function parsePrice(value: string): number {
  const normalized = value.replace(/\s/g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : NaN;
}

export default function CatalogScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    visibleItems,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    saveItem,
    updateItem,
    deleteItem,
    adjustPricesByPercentage,
  } = useCatalog();

  const [isItemModalVisible, setIsItemModalVisible] = useState(false);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isBulkModalVisible, setIsBulkModalVisible] = useState(false);
  const [isBulkConfirmVisible, setIsBulkConfirmVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ActionTarget>(null);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [form, setForm] = useState<CatalogForm>(
    toForm(null, "product"),
  );
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof CatalogForm, string>>
  >({});
  const [percentageInput, setPercentageInput] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");

  useEffect(() => {
    if (!editingItem) {
      return;
    }

    setForm(toForm(editingItem, editingItem.type));
  }, [editingItem]);

  const openAddModal = () => {
    setEditingItem(null);
    setForm(toForm(null, activeTab === "Productos" ? "product" : "service"));
    setFormErrors({});
    setIsItemModalVisible(true);
  };

  const openEditModal = (item: CatalogItem) => {
    setSelectedItem(null);
    setEditingItem(item);
    setForm(toForm(item, item.type));
    setFormErrors({});
    setIsActionModalVisible(false);
    setIsDeleteModalVisible(false);
    setIsItemModalVisible(true);
  };

  const openActionModal = (item: CatalogItem) => {
    setSelectedItem(item);
    setIsActionModalVisible(true);
  };

  const closeItemModal = () => {
    setIsItemModalVisible(false);
    setEditingItem(null);
    setFormErrors({});
  };

  const onSaveItem = async () => {
    const nextErrors: Partial<Record<keyof CatalogForm, string>> = {};
    if (!form.name.trim()) {
      nextErrors.name = "Ingresa un nombre";
    }
    const price = parsePrice(form.price);
    if (!form.price.trim() || Number.isNaN(price)) {
      nextErrors.price = "Ingresa un precio válido";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    const now = new Date().toISOString();
    const baseItem: CatalogItem = editingItem
      ? {
          ...editingItem,
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          price: Number(price.toFixed(2)),
          type: form.type,
          updatedAt: now,
        }
      : {
          id: createUuid(),
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          price: Number(price.toFixed(2)),
          type: form.type,
          createdAt: now,
          updatedAt: now,
        };

    try {
      if (editingItem) {
        await updateItem(baseItem);
      } else {
        await saveItem(baseItem);
      }
      closeItemModal();
    } catch (error) {
      console.error("Failed to save catalog item", error);
    }
  };

  const onDeleteSelected = async () => {
    if (!selectedItem) {
      return;
    }

    try {
      await deleteItem(selectedItem.id);
      setIsDeleteModalVisible(false);
      setSelectedItem(null);
      Alert.alert("Eliminado", "El elemento fue eliminado del catálogo.");
    } catch (error) {
      console.error("Failed to delete catalog item", error);
    }
  };

  const openBulkPricesModal = () => {
    setPercentageInput("");
    setBulkMessage("");
    setIsBulkModalVisible(true);
  };

  const prepareBulkUpdate = () => {
    const trimmed = percentageInput.trim();
    if (!trimmed) {
      setBulkMessage("Ingresá un porcentaje.");
      return;
    }

    const percentage = Number(trimmed);
    if (!Number.isFinite(percentage) || percentage === 0) {
      setBulkMessage("El porcentaje debe ser distinto de 0.");
      return;
    }

    setBulkMessage("");
    setIsBulkModalVisible(false);
    setIsBulkConfirmVisible(true);
  };

  const runBulkUpdate = async () => {
    const percentage = Number(percentageInput.trim());
    if (!Number.isFinite(percentage) || percentage === 0) {
      setIsBulkConfirmVisible(false);
      return;
    }

    try {
      await adjustPricesByPercentage(percentage);
      setIsBulkConfirmVisible(false);
      Alert.alert(
        "Precios actualizados",
        `Se actualizaron todos los precios en un ${percentage}%`,
      );
    } catch (error) {
      console.error("Failed to adjust catalog prices", error);
    }
  };

  const selectedItemTitle = selectedItem?.name ?? "Elemento";

  return (
    <PremiumGate>
      <View style={styles.screen}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </Pressable>
          <Text style={styles.title}>Catálogo</Text>
          <View style={styles.headerActions}>
            <Pressable
              hitSlop={8}
              style={styles.addButton}
              onPress={openBulkPricesModal}
            >
              <Ionicons name="sync-outline" size={22} color="#0F172A" />
            </Pressable>
            <Pressable hitSlop={8} style={styles.addButton} onPress={openAddModal}>
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
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar productos o servicios"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
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
          {visibleItems.map((item) => (
            <Pressable
              key={item.id}
              style={styles.row}
              onPress={() => openActionModal(item)}
            >
              <View style={styles.rowIcon}>
                <Ionicons
                  name={item.type === "product" ? "cube-outline" : "construct-outline"}
                  size={18}
                  color="#9CA3AF"
                />
              </View>
              <View style={styles.rowMain}>
                <Text style={styles.rowName}>{item.name}</Text>
              </View>
              <Text style={styles.rowPrice}>{formatCatalogPrice(item.price)}</Text>
            </Pressable>
          ))}

          {/* <Pressable style={styles.seeAll} onPress={() => setSearchQuery("")}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </Pressable> */}
        </ScrollView>

        <View style={styles.tabBarWrap}>
          <DashboardTabBar activeTab="more" />
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={isItemModalVisible}
        onRequestClose={closeItemModal}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={closeItemModal}
        >
          <Pressable style={styles.modalCard} onPress={() => null}>
            <Text style={styles.modalTitle}>
              {editingItem ? "Editar elemento" : "Nuevo elemento"}
            </Text>
            <Text style={styles.modalSubtitle}>
              Agregá un producto o servicio al catálogo.
            </Text>

            <Field
              label="Nombre"
              value={form.name}
              onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
              placeholder="Nombre"
              error={formErrors.name}
            />

            <Field
              label="Descripción"
              value={form.description}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, description: text }))
              }
              placeholder="Descripción"
            />

            <Field
              label="Precio"
              value={form.price}
              onChangeText={(text) => setForm((prev) => ({ ...prev, price: text }))}
              placeholder="0.00"
              keyboardType="decimal-pad"
              error={formErrors.price}
            />

            <View style={styles.typeGroup}>
              <Text style={styles.fieldLabel}>Tipo</Text>
              <View style={styles.typeRow}>
                {(["product", "service"] as const).map((type) => {
                  const active = form.type === type;
                  return (
                    <Pressable
                      key={type}
                      style={[styles.typeChip, active && styles.typeChipActive]}
                      onPress={() => setForm((prev) => ({ ...prev, type }))}
                    >
                      <Text
                        style={[
                          styles.typeChipText,
                          active && styles.typeChipTextActive,
                        ]}
                      >
                        {getCatalogTypeLabel(type)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.modalActions}>
              <Pressable style={styles.modalSecondaryButton} onPress={closeItemModal}>
                <Text style={styles.modalSecondaryButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.modalPrimaryButton} onPress={() => void onSaveItem()}>
                <Text style={styles.modalPrimaryButtonText}>
                  {editingItem ? "Guardar" : "Crear"}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={isActionModalVisible}
        onRequestClose={() => setIsActionModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsActionModalVisible(false)}
        >
          <Pressable style={styles.modalCard} onPress={() => null}>
            <Text style={styles.modalTitle}>{selectedItemTitle}</Text>
            <Text style={styles.modalSubtitle}>
              Elegí qué querés hacer con este elemento.
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalSecondaryButton}
                onPress={() => {
                  if (selectedItem) {
                    openEditModal(selectedItem);
                  }
                }}
              >
                <Text style={styles.modalSecondaryButtonText}>Editar</Text>
              </Pressable>
              <Pressable
                style={styles.modalPrimaryButton}
                onPress={() => {
                  setIsActionModalVisible(false);
                  setIsDeleteModalVisible(true);
                }}
              >
                <Text style={styles.modalPrimaryButtonText}>Eliminar</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={isDeleteModalVisible}
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsDeleteModalVisible(false)}
        >
          <Pressable style={styles.modalCard} onPress={() => null}>
            <Text style={styles.modalTitle}>Eliminar elemento</Text>
            <Text style={styles.modalSubtitle}>
              ¿Querés eliminar este elemento del catálogo?
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalSecondaryButton}
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <Text style={styles.modalSecondaryButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.modalPrimaryButton} onPress={() => void onDeleteSelected()}>
                <Text style={styles.modalPrimaryButtonText}>Eliminar</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={isBulkModalVisible}
        onRequestClose={() => setIsBulkModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsBulkModalVisible(false)}
        >
          <Pressable style={styles.modalCard} onPress={() => null}>
            <Text style={styles.modalTitle}>Actualizar todos los precios</Text>
            <Text style={styles.modalSubtitle}>
              Ingresá un porcentaje positivo o negativo.
            </Text>

            <Field
              label="Porcentaje"
              value={percentageInput}
              onChangeText={setPercentageInput}
              placeholder="5, 10, 15, -10..."
              keyboardType="numeric"
              error={bulkMessage || undefined}
            />

            <View style={styles.quickPercents}>
              {["5", "10", "15", "20", "-5", "-10", "-15"].map((value) => (
                <Pressable
                  key={value}
                  style={styles.quickPercentChip}
                  onPress={() => setPercentageInput(value)}
                >
                  <Text style={styles.quickPercentText}>{value}%</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalSecondaryButton}
                onPress={() => setIsBulkModalVisible(false)}
              >
                <Text style={styles.modalSecondaryButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.modalPrimaryButton} onPress={prepareBulkUpdate}>
                <Text style={styles.modalPrimaryButtonText}>Continuar</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={isBulkConfirmVisible}
        onRequestClose={() => setIsBulkConfirmVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsBulkConfirmVisible(false)}
        >
          <Pressable style={styles.modalCard} onPress={() => null}>
            <Text style={styles.modalTitle}>Confirmar actualización</Text>
            <Text style={styles.modalSubtitle}>
              ¿Deseás actualizar todos los precios del catálogo en un{" "}
              {percentageInput.trim()}%?
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalSecondaryButton}
                onPress={() => setIsBulkConfirmVisible(false)}
              >
                <Text style={styles.modalSecondaryButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.modalPrimaryButton} onPress={() => void runBulkUpdate()}>
                <Text style={styles.modalPrimaryButtonText}>Actualizar</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </PremiumGate>
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

  headerActions: {
    flexDirection: "row",
    gap: 6,
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

  rowMain: {
    flex: 1,
  },

  rowName: {
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

  field: {
    marginTop: 14,
  },

  fieldLabel: {
    marginBottom: 8,
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  input: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#0F172A",
    backgroundColor: "#FFFFFF",
  },

  errorText: {
    marginTop: 6,
    fontSize: 13,
    color: "#DC2626",
  },

  typeGroup: {
    marginTop: 14,
  },

  typeRow: {
    flexDirection: "row",
    gap: 10,
  },

  typeChip: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },

  typeChipActive: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },

  typeChipText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
  },

  typeChipTextActive: {
    color: "#2563EB",
  },

  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
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

  quickPercents: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  quickPercentChip: {
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  quickPercentText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
  },
});
