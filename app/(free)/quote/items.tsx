import { useRouter } from "expo-router";
import { useMemo, useState, type ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

import { useCatalogAutocomplete } from "@/hooks/useCatalogAutocomplete";
import {
  QuoteItemErrors,
  QuoteItemForm,
  validateQuoteItem,
} from "@/lib/utils/freeValidators";
import { formatARS } from "@/lib/utils/quoteUtils";
import { useFreeQuoteStore } from "@/store/freeQuoteStore";
import { useSubscription } from "@/services/subscription/useSubscription";

const emptyItem: QuoteItemForm = {
  description: "",
  quantity: 1,
  unitPrice: 0,
};

function Step({ label, active }: { label: string; active?: boolean }) {
  return (
    <View style={styles.step}>
      <View style={[styles.stepBar, active && styles.stepBarActive]} />
      <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

function Field({
  label,
  error,
  style,
  children,
  ...props
}: TextInputProps & {
  label: string;
  error?: string;
  children?: ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <TextInput
        {...props}
        placeholderTextColor="#94A3B8"
        style={[styles.input, style]}
      />

      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
      {children}
    </View>
  );
}

export default function QuoteItemsScreen() {
  const router = useRouter();
  const { isPremium } = useSubscription();
  const items = useFreeQuoteStore((state) => state.quote.items);
  const addItem = useFreeQuoteStore((state) => state.addItem);
  const updateItem = useFreeQuoteStore((state) => state.updateItem);
  const removeItem = useFreeQuoteStore((state) => state.removeItem);

  const [form, setForm] = useState<QuoteItemForm>(emptyItem);
  const [fieldErrors, setFieldErrors] = useState<QuoteItemErrors>({});
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDescriptionSuggestionsOpen, setIsDescriptionSuggestionsOpen] =
    useState(false);

  const catalogSuggestions = useCatalogAutocomplete(form.description, isPremium);

  const itemTotal = useMemo(
    () => form.quantity * form.unitPrice,
    [form.quantity, form.unitPrice],
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [items],
  );

  const resetForm = () => {
    setForm(emptyItem);
    setFieldErrors({});
    setEditingItemId(null);
    setIsDescriptionSuggestionsOpen(false);
  };

  const changeQuantity = (delta: number) => {
    setForm((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta),
    }));
    if (fieldErrors.quantity) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.quantity;
        return next;
      });
    }
  };

  const onSaveItem = () => {
    const nextErrors = validateQuoteItem(form);
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    if (editingItemId) {
      updateItem(editingItemId, form);
    } else {
      addItem(form);
    }

    resetForm();
    setError(null);
  };

  const onEdit = (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;

    setEditingItemId(id);
    setForm({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    });
    setFieldErrors({});
    setError(null);
    setIsDescriptionSuggestionsOpen(false);
  };

  const selectCatalogSuggestion = (item: {
    name: string;
    price: number;
  }) => {
    setForm((prev) => ({
      ...prev,
      description: item.name,
      unitPrice: item.price,
    }));
    setIsDescriptionSuggestionsOpen(false);
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.description;
      delete next.unitPrice;
      return next;
    });
  };

  const onContinue = () => {
    if (!items.length) {
      setError("Agrega al menos un item.");
      return;
    }

    router.push("/quote/summary");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>VOLVER</Text>
        </Pressable>

        <Text style={styles.title}>Items</Text>
        <Text style={styles.subtitle}>Agrega materiales y mano de obra</Text>

        <View style={styles.stepperCard}>
          <View style={styles.stepperRow}>
            <Step label="Datos" />
            <Step label="Items" active />
            <Step label="Resumen" />
            <Step label="PDF" />
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {editingItemId ? "Editar item" : "Nuevo item"}
          </Text>

          <Field
            label="Descripcion"
            value={form.description}
            onChangeText={(text) => {
              setIsDescriptionSuggestionsOpen(true);
              setForm((prev) => ({ ...prev, description: text }));
              if (fieldErrors.description) {
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next.description;
                  return next;
                });
              }
            }}
            placeholder="Ej: Instalacion electrica"
            error={fieldErrors.description}
          >
            {isPremium &&
            isDescriptionSuggestionsOpen &&
            catalogSuggestions.length > 0 ? (
              <View style={styles.suggestionsList}>
                {catalogSuggestions.map((item, index) => (
                  <Pressable
                    key={item.id}
                    style={[
                      styles.suggestionItem,
                      index === catalogSuggestions.length - 1 &&
                        styles.suggestionItemLast,
                    ]}
                    onPress={() => selectCatalogSuggestion(item)}
                  >
                    <Text style={styles.suggestionText}>{item.name}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </Field>

          <Text style={styles.fieldLabel}>Cantidad</Text>
          <View style={styles.quantityRow}>
            <Pressable
              style={styles.quantityButton}
              onPress={() => changeQuantity(-1)}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </Pressable>

            <Text style={styles.quantityValue}>{form.quantity}</Text>

            <Pressable
              style={styles.quantityButton}
              onPress={() => changeQuantity(1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </Pressable>
          </View>
          {fieldErrors.quantity ? (
            <Text style={styles.fieldError}>{fieldErrors.quantity}</Text>
          ) : null}

          <Field
            label="Precio unitario"
            value={form.unitPrice ? String(form.unitPrice) : ""}
            onChangeText={(text) => {
              setForm((prev) => ({
                ...prev,
                unitPrice: Number(text.replace(/\D/g, "")) || 0,
              }));
              if (fieldErrors.unitPrice) {
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next.unitPrice;
                  return next;
                });
              }
            }}
            keyboardType="number-pad"
            error={fieldErrors.unitPrice}
          />

          <View style={styles.itemTotalCard}>
            <Text style={styles.itemTotalLabel}>Total del item</Text>
            <Text style={styles.itemTotalValue}>{formatARS(itemTotal)}</Text>
          </View>

          <Pressable style={styles.saveButton} onPress={onSaveItem}>
            <Text style={styles.saveButtonText}>
              {editingItemId ? "Guardar cambios" : "Agregar item"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.itemsList}>
          {items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemMeta}>
                {item.quantity} x {formatARS(item.unitPrice)}
              </Text>

              <View style={styles.itemFooter}>
                <Text style={styles.itemTotal}>
                  {formatARS(item.quantity * item.unitPrice)}
                </Text>

                <View style={styles.itemActions}>
                  <Pressable onPress={() => onEdit(item.id)}>
                    <Text style={styles.editAction}>Editar</Text>
                  </Pressable>

                  <Pressable onPress={() => removeItem(item.id)}>
                    <Text style={styles.deleteAction}>Eliminar</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>

        {error ? <Text style={styles.listError}>{error}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerLabel}>Subtotal actual</Text>
        <Text style={styles.footerSubtotal}>{formatARS(subtotal)}</Text>

        <Pressable style={styles.continueButton} onPress={onContinue}>
          <Text style={styles.continueButtonText}>Continuar a resumen</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scroll: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 170,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 24,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  backButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#0F172A",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 18,
    color: "#64748B",
  },

  stepperCard: {
    marginTop: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  stepperRow: {
    flexDirection: "row",
    gap: 12,
  },

  step: {
    flex: 1,
    alignItems: "center",
  },

  stepBar: {
    height: 8,
    width: "100%",
    borderRadius: 999,
    backgroundColor: "#E2E8F0",
  },

  stepBarActive: {
    backgroundColor: "#2563EB",
  },

  stepLabel: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },

  stepLabelActive: {
    color: "#0F172A",
  },

  formCard: {
    marginTop: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    padding: 24,
  },

  formTitle: {
    marginBottom: 24,
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
  },

  field: {
    marginBottom: 20,
  },

  fieldLabel: {
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
  },

  input: {
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    fontSize: 18,
    color: "#0F172A",
  },

  fieldError: {
    marginTop: 8,
    fontSize: 14,
    color: "#EF4444",
  },

  suggestionsList: {
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  suggestionItemLast: {
    borderBottomWidth: 0,
  },

  suggestionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    padding: 12,
  },

  quantityButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  quantityButtonText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
  },

  quantityValue: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
  },

  itemTotalCard: {
    borderRadius: 16,
    backgroundColor: "#0F172A",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  itemTotalLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#CBD5E1",
  },

  itemTotalValue: {
    marginTop: 8,
    fontSize: 34,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  saveButton: {
    marginTop: 20,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  saveButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  itemsList: {
    marginTop: 24,
    gap: 16,
  },

  itemCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },

  itemDescription: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },

  itemMeta: {
    marginTop: 8,
    fontSize: 16,
    color: "#64748B",
  },

  itemFooter: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  itemTotal: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2563EB",
  },

  itemActions: {
    flexDirection: "row",
    gap: 20,
  },

  editAction: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563EB",
  },

  deleteAction: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EF4444",
  },

  listError: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#EF4444",
  },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },

  footerLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#64748B",
  },

  footerSubtotal: {
    marginTop: 8,
    fontSize: 34,
    fontWeight: "800",
    color: "#0F172A",
  },

  continueButton: {
    marginTop: 16,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  continueButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
