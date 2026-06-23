import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
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
import type { BrandingSettings } from "@/lib/models/branding";
import { useBranding } from "@/hooks/useBranding";

type BrandingForm = {
  brandName: string;
  logoUri?: string;
};

function toForm(settings: BrandingSettings | null): BrandingForm {
  return {
    brandName: settings?.brandName ?? "",
    logoUri: settings?.logoUri,
  };
}

export default function BrandingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { branding, saveBranding } = useBranding();
  const [form, setForm] = useState<BrandingForm>(toForm(null));
  const [hydrated, setHydrated] = useState(false);
  const updatedAtRef = useRef(new Date().toISOString());

  useEffect(() => {
    setForm(toForm(branding));
    if (branding) {
      updatedAtRef.current = branding.updatedAt;
    }
    setHydrated(true);
  }, [branding]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const timer = setTimeout(() => {
      void saveBranding({
        brandName: form.brandName.trim(),
        logoUri: form.logoUri,
        updatedAt: new Date().toISOString(),
      }).catch((error) => {
        console.error("Failed to save branding", error);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [form, hydrated, saveBranding]);

  const pickLogo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permiso requerido",
        "Necesitamos acceso a tu galería para seleccionar un logo.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    const nextUri = result.assets[0]?.uri;
    if (!nextUri) {
      return;
    }

    setForm((prev) => ({ ...prev, logoUri: nextUri }));
    updatedAtRef.current = new Date().toISOString();
    void saveBranding({
      brandName: form.brandName.trim(),
      logoUri: nextUri,
      updatedAt: updatedAtRef.current,
    }).catch((error) => {
      console.error("Failed to save branding logo", error);
    });
  };

  const removeLogo = () => {
    setForm((prev) => ({ ...prev, logoUri: undefined }));
  };

  return (
    <PremiumGate>
      <DashboardScreen activeTab="more">
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>VOLVER</Text>
          </Pressable>
          <Text style={styles.title}>Marca y logo</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>NOMBRE COMERCIAL</Text>
            <TextInput
              value={form.brandName}
              onChangeText={(text) => setForm((prev) => ({ ...prev, brandName: text }))}
              placeholder="Plomería Pérez"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              autoCapitalize="words"
            />
          </View>

          <View style={[styles.card, styles.cardSpaced]}>
            <Text style={styles.sectionLabel}>LOGO</Text>

            <View style={styles.logoPreview}>
              {form.logoUri ? (
                <Image source={{ uri: form.logoUri }} style={styles.logoImage} />
              ) : (
                <View style={styles.logoPlaceholder}>
                  <Text style={styles.logoPlaceholderText}>Sin logo</Text>
                </View>
              )}
            </View>

            <View style={styles.actions}>
              <Pressable style={styles.primaryButton} onPress={() => void pickLogo()}>
                <Text style={styles.primaryButtonText}>
                  {form.logoUri ? "Reemplazar logo" : "Seleccionar logo"}
                </Text>
              </Pressable>

              {form.logoUri ? (
                <Pressable style={styles.secondaryButton} onPress={removeLogo}>
                  <Text style={styles.secondaryButtonText}>Eliminar logo</Text>
                </Pressable>
              ) : null}
            </View>
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

  cardSpaced: {
    marginTop: 20,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#94A3B8",
    marginBottom: 16,
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

  logoPreview: {
    minHeight: 180,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  logoImage: {
    width: "100%",
    height: 220,
    resizeMode: "contain",
  },

  logoPlaceholder: {
    width: "100%",
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
  },

  logoPlaceholderText: {
    fontSize: 15,
    color: "#94A3B8",
    fontWeight: "600",
  },

  actions: {
    marginTop: 16,
    gap: 12,
  },

  primaryButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  secondaryButton: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#334155",
  },
});

