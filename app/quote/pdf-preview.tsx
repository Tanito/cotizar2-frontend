import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  alertPdfShareError,
  shareQuotePdf,
} from "@/services/pdf/shareQuotePdf";
import { useFreeQuoteStore } from "@/store/freeQuoteStore";

export default function QuotePdfPreviewScreen() {
  const router = useRouter();
  const pdfUrl = useFreeQuoteStore((state) => state.pdfUrl);
  const whatsappText = useFreeQuoteStore((state) => state.whatsappText);
  const [isSharing, setIsSharing] = useState(false);

  if (!pdfUrl) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  const onSharePdf = async () => {
    setIsSharing(true);
    try {
      await shareQuotePdf(pdfUrl);
    } catch (error) {
      alertPdfShareError(error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>VOLVER</Text>
        </Pressable>

        <Text style={styles.title}>PDF listo</Text>
        <Text style={styles.subtitle}>
          Tu presupuesto fue generado. Compartilo por WhatsApp.
        </Text>

        <View style={styles.previewCard}>
          <Text style={styles.previewLabel}>Vista previa</Text>
          <Text style={styles.previewText}>{whatsappText}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.shareButton, isSharing && styles.disabled]}
          onPress={() => void onSharePdf()}
          disabled={isSharing}
        >
          {isSharing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.shareButtonText}>Compartir PDF</Text>
          )}
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push("/quote/whatsapp-share" as never)}
        >
          <Text style={styles.secondaryButtonText}>Abrir WhatsApp con mensaje</Text>
        </Pressable>

        <Pressable style={styles.homeButton} onPress={() => router.replace("/")}>
          <Text style={styles.homeButtonText}>Volver al inicio</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scroll: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 160,
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

  previewCard: {
    marginTop: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    padding: 24,
  },

  previewLabel: {
    marginBottom: 16,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#94A3B8",
  },

  previewText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#334155",
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

  shareButton: {
    height: 64,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  shareButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  disabled: {
    opacity: 0.85,
  },

  secondaryButton: {
    marginTop: 14,
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#25D366",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#25D366",
  },

  homeButton: {
    marginTop: 16,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },

  homeButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
  },
});
