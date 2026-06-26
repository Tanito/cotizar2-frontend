import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

import { useClientAutocomplete } from "@/hooks/useClientAutocomplete";
import {
  QuoteMetaErrors,
  QuoteMetaForm,
  validateQuoteMeta,
} from "@/lib/utils/freeValidators";
import { useFreeQuoteStore } from "@/store/freeQuoteStore";
import {
  getQuoteExitHref,
  syncQuoteFlowFromParam,
} from "@/store/quoteFlowStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";

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
  multiline,
  style,
  children,
  ...props
}: TextInputProps & {
  label: string;
  error?: string;
  multiline?: boolean;
  children?: ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor="#94A3B8"
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          style,
        ]}
      />

      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
      {children}
    </View>
  );
}

export default function NewQuoteScreen() {
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const isPremium = useSubscriptionStore((state) => state.isPremium);
  const quote = useFreeQuoteStore((state) => state.quote);
  const setQuoteMeta = useFreeQuoteStore((state) => state.setQuoteMeta);

  const [form, setForm] = useState<QuoteMetaForm>({
    customerName: quote.customerName,
    customerPhone: quote.customerPhone,
    serviceType: quote.serviceType,
    validityDays: quote.validityDays,
    depositPercentage: quote.depositPercentage,
    notes: quote.notes,
  });
  const [errors, setErrors] = useState<QuoteMetaErrors>({});
  const [isClientSuggestionsOpen, setIsClientSuggestionsOpen] =
    useState(false);

  const clientSuggestions = useClientAutocomplete(
    form.customerName,
    isPremium,
  );

  useEffect(() => {
    syncQuoteFlowFromParam(from);
  }, [from]);

  const onCancel = () => {
    router.replace(getQuoteExitHref());
  };

  const updateField = <K extends keyof QuoteMetaForm>(
    key: K,
    value: QuoteMetaForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const selectClientSuggestion = (client: {
    name: string;
    phone: string;
  }) => {
    setForm((prev) => ({
      ...prev,
      customerName: client.name,
      customerPhone: client.phone,
    }));
    setIsClientSuggestionsOpen(false);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.customerName;
      delete next.customerPhone;
      return next;
    });
  };

  const onSubmit = () => {
    const parsed: QuoteMetaForm = {
      ...form,
      validityDays: Number(form.validityDays) || 0,
      depositPercentage: Number(form.depositPercentage) || 0,
    };

    const nextErrors = validateQuoteMeta(parsed);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setQuoteMeta(parsed);
    router.push("/quote/items");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Nuevo presupuesto</Text>
          <Text style={styles.subtitle}>
            Completa la informacion para tu presupuesto
          </Text>
        </View>

        <View style={styles.stepperCard}>
          <View style={styles.stepperRow}>
            <Step label="Datos" active />
            <Step label="Items" />
            <Step label="Resumen" />
            <Step label="PDF" />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cliente</Text>

          <Field
            label="Nombre"
            value={form.customerName}
            onChangeText={(text) => {
              setIsClientSuggestionsOpen(true);
              updateField("customerName", text);
            }}
            placeholder="Nombre del cliente"
            error={errors.customerName}
          >
            {isPremium &&
            isClientSuggestionsOpen &&
            clientSuggestions.length > 0 ? (
              <View style={styles.suggestionsList}>
                {clientSuggestions.map((client, index) => (
                  <Pressable
                    key={client.id}
                    style={[
                      styles.suggestionItem,
                      index === clientSuggestions.length - 1 &&
                        styles.suggestionItemLast,
                    ]}
                    onPress={() => selectClientSuggestion(client)}
                  >
                    <Text style={styles.suggestionText}>{client.name}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </Field>

          <Field
            label="Telefono"
            value={form.customerPhone}
            onChangeText={(text) => updateField("customerPhone", text)}
            placeholder="+54 11..."
            keyboardType="phone-pad"
            error={errors.customerPhone}
          />

          <Field
            label="Rubro"
            value={form.serviceType}
            onChangeText={(text) => updateField("serviceType", text)}
            placeholder="Electricidad, plomeria..."
            error={errors.serviceType}
          />
        </View>

        <View style={[styles.card, styles.cardSpaced]}>
          <Text style={styles.cardTitle}>Condiciones</Text>

          <Field
            label="Validez (dias)"
            value={String(form.validityDays)}
            onChangeText={(text) =>
              updateField("validityDays", Number(text.replace(/\D/g, "")) || 0)
            }
            keyboardType="number-pad"
            error={errors.validityDays}
          />

          <Field
            label="Seña (%)"
            value={String(form.depositPercentage)}
            onChangeText={(text) =>
              updateField(
                "depositPercentage",
                Number(text.replace(/\D/g, "")) || 0,
              )
            }
            keyboardType="number-pad"
            error={errors.depositPercentage}
          />

          <Field
            label="Notas"
            value={form.notes}
            onChangeText={(text) => updateField("notes", text)}
            placeholder="Detalle adicional"
            multiline
            error={errors.notes}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.primaryButton} onPress={onSubmit}>
          <Text style={styles.primaryButtonText}>Continuar a items</Text>
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
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
    paddingBottom: 140,
  },

  header: {
    marginBottom: 32,
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
    marginBottom: 32,
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

  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    padding: 24,
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  cardSpaced: {
    marginTop: 20,
  },

  cardTitle: {
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

  inputMultiline: {
    height: undefined,
    minHeight: 110,
    paddingTop: 16,
    textAlignVertical: "top",
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

  primaryButton: {
    height: 64,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  cancelButton: {
    marginTop: 16,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
  },
});
