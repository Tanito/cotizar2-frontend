import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

import { DashboardScreen } from "@/components/dashboard-screen";
import { PremiumGate } from "@/components/premium-gate";
import type { BusinessProfile } from "@/lib/models/businessProfile";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";

type BusinessProfileForm = {
  businessName: string;
  businessType: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  cuit: string;
  ivaCondition: string;
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

function toForm(profile: BusinessProfile | null): BusinessProfileForm {
  return {
    businessName: profile?.businessName ?? "",
    businessType: profile?.businessType ?? "",
    phone: profile?.phone ?? "",
    email: profile?.email ?? "",
    address: profile?.address ?? "",
    website: profile?.website ?? "",
    cuit: profile?.cuit ?? "",
    ivaCondition: profile?.ivaCondition ?? "",
  };
}

export default function BusinessProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, saveProfile } = useBusinessProfile();
  const [form, setForm] = useState<BusinessProfileForm>(toForm(null));
  const [hydrated, setHydrated] = useState(false);
  const createdAtRef = useRef(new Date().toISOString());

  useEffect(() => {
    setForm(toForm(profile));
    if (profile) {
      createdAtRef.current = profile.createdAt;
    }
    setHydrated(true);
  }, [profile]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const timer = setTimeout(() => {
      void saveProfile({
        businessName: form.businessName.trim(),
        businessType: form.businessType.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim() || undefined,
        website: form.website.trim() || undefined,
        cuit: form.cuit.trim() || undefined,
        ivaCondition: form.ivaCondition.trim() || undefined,
        createdAt: createdAtRef.current,
        updatedAt: new Date().toISOString(),
      }).catch((error) => {
        console.error("Failed to save business profile", error);
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [form, hydrated, saveProfile]);

  const updateField = <K extends keyof BusinessProfileForm>(
    key: K,
    value: BusinessProfileForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <PremiumGate>
      <DashboardScreen activeTab="more">
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>VOLVER</Text>
          </Pressable>
          <Text style={styles.title}>Perfil de mi negocio</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Field
              label="Nombre del negocio"
              value={form.businessName}
              onChangeText={(text) => updateField("businessName", text)}
              placeholder="Mi negocio"
            />

            <Field
              label="Rubro"
              value={form.businessType}
              onChangeText={(text) => updateField("businessType", text)}
              placeholder="Plomería, electricidad..."
            />

            <Field
              label="Teléfono"
              value={form.phone}
              onChangeText={(text) => updateField("phone", text)}
              placeholder="+54 11..."
              keyboardType="phone-pad"
            />

            <Field
              label="Email"
              value={form.email}
              onChangeText={(text) => updateField("email", text)}
              placeholder="contacto@negocio.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Field
              label="Dirección"
              value={form.address}
              onChangeText={(text) => updateField("address", text)}
              placeholder="Calle y número"
            />

            <Field
              label="Sitio web"
              value={form.website}
              onChangeText={(text) => updateField("website", text)}
              placeholder="https://..."
              autoCapitalize="none"
            />

            <Field
              label="CUIT"
              value={form.cuit}
              onChangeText={(text) => updateField("cuit", text)}
              placeholder="20-12345678-9"
            />

            <Field
              label="Condición IVA"
              value={form.ivaCondition}
              onChangeText={(text) => updateField("ivaCondition", text)}
              placeholder="Responsable Inscripto"
            />
          </View>
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

  backButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  backButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },

  headerSpacer: {
    width: 72,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  card: {
    marginTop: 16,
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
});
