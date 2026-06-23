import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PremiumGate } from "@/components/premium-gate";
import type { Client } from "@/lib/models/client";
import { createUuid } from "@/lib/utils/createUuid";
import { clientRepository } from "@/services/clients/clientRepository";

type ClientForm = {
  name: string;
  phone: string;
  email: string;
  company: string;
};

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

export default function NewClientScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<ClientForm>({
    name: "",
    phone: "",
    email: "",
    company: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ClientForm, string>>>(
    {},
  );
  const [isSaving, setIsSaving] = useState(false);

  const updateField = <K extends keyof ClientForm>(
    key: K,
    value: ClientForm[K],
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

  const onSave = async () => {
    const nextErrors: Partial<Record<keyof ClientForm, string>> = {};

    if (!form.name.trim()) {
      nextErrors.name = "Ingresa el nombre del cliente";
    }
    if (!form.phone.trim()) {
      nextErrors.phone = "Ingresa el telefono";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const client: Client = {
      id: createUuid(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      company: form.company.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    setIsSaving(true);
    try {
      await clientRepository.saveClient(client);
      router.replace("/clients");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PremiumGate>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>VOLVER</Text>
          </Pressable>

          <Text style={styles.title}>Nuevo Cliente</Text>
          <Text style={styles.subtitle}>
            Guardá clientes para asociarlos a futuros presupuestos
          </Text>

          <View style={styles.card}>
            <Field
              label="Nombre"
              value={form.name}
              onChangeText={(text) => updateField("name", text)}
              placeholder="Nombre y apellido"
              error={errors.name}
            />

            <Field
              label="Telefono"
              value={form.phone}
              onChangeText={(text) => updateField("phone", text)}
              placeholder="+54 11..."
              keyboardType="phone-pad"
              error={errors.phone}
            />

            <Field
              label="Email"
              value={form.email}
              onChangeText={(text) => updateField("email", text)}
              placeholder="cliente@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Field
              label="Empresa"
              value={form.company}
              onChangeText={(text) => updateField("company", text)}
              placeholder="Empresa SRL"
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[styles.saveButton, isSaving && styles.buttonDisabled]}
            onPress={() => void onSave()}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? "Guardando..." : "Guardar cliente"}
            </Text>
          </Pressable>
        </View>
      </View>
    </PremiumGate>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 140,
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

  card: {
    marginTop: 28,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    padding: 24,
  },

  field: {
    marginBottom: 18,
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

  saveButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  saveButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  buttonDisabled: {
    opacity: 0.85,
  },
});
