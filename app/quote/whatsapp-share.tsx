import * as Linking from "expo-linking";
import * as Sharing from "expo-sharing";
import { useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useFreeQuoteStore } from "@/store/freeQuoteStore";

export default function WhatsappShareScreen() {
  const router = useRouter();
  const whatsappText = useFreeQuoteStore((state) => state.whatsappText);
  const pdfUrl = useFreeQuoteStore((state) => state.pdfUrl);
  const resetFlow = useFreeQuoteStore((state) => state.resetFlow);

  if (!whatsappText || !pdfUrl) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Sin contenido para compartir</Text>
        <Text style={styles.errorDescription}>
          Primero genera una cotizacion en PDF.
        </Text>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.replace("/quote/summary")}
        >
          <Text style={styles.primaryButtonText}>Ir al resumen</Text>
        </Pressable>
      </View>
    );
  }

  const whatsappAppUrl = `whatsapp://send?text=${encodeURIComponent(whatsappText)}`;
  const whatsappWebUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  const onWhatsappShortcut = async () => {
    const canOpenWhatsapp = await Linking.canOpenURL(whatsappAppUrl);
    const target = canOpenWhatsapp ? whatsappAppUrl : whatsappWebUrl;
    await Linking.openURL(target);
  };

  const onSharePdf = async () => {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(
        "Compartir no disponible",
        "Abre el PDF y compartelo manualmente desde tu dispositivo.",
      );
      return;
    }

    await Sharing.shareAsync(pdfUrl, {
      mimeType: "application/pdf",
      dialogTitle: "Enviar cotizacion por WhatsApp",
      UTI: ".pdf",
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Compartir</Text>
        <Text style={styles.subtitle}>WhatsApp listo en dos pasos</Text>

        <View style={styles.okCard}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>✅</Text>
          </View>
          <Text style={styles.okTitle}>Listo para enviar</Text>
          <Text style={styles.okDescription}>
            Abri WhatsApp con el mensaje y adjunta el PDF con el boton de abajo.
          </Text>
        </View>

        <View style={styles.messageCard}>
          <Text style={styles.messageLabel}>Mensaje</Text>
          <Text style={styles.messageText}>{whatsappText}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.whatsButton} onPress={() => void onWhatsappShortcut()}>
          <Text style={styles.whatsButtonText}>Compartir por WhatsApp</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => void onSharePdf()}>
          <Text style={styles.secondaryButtonText}>Compartir PDF</Text>
        </Pressable>
        <Pressable
          style={styles.ghostButton}
          onPress={() => {
            resetFlow();
            router.replace("/");
          }}
        >
          <Text style={styles.ghostButtonText}>Nueva cotizacion</Text>
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
    paddingBottom: 220,
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

  okCard: {
    marginTop: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    padding: 24,
    alignItems: "center",
  },

  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 32,
  },

  okTitle: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },

  okDescription: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 23,
    color: "#64748B",
    textAlign: "center",
  },

  messageCard: {
    marginTop: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },

  messageLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#64748B",
  },

  messageText: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 23,
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
    gap: 12,
  },

  whatsButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#25D366",
    alignItems: "center",
    justifyContent: "center",
  },

  whatsButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  secondaryButton: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#2563EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563EB",
  },

  ghostButton: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },

  ghostButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
  },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
  },

  errorTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },

  errorDescription: {
    marginTop: 8,
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
  },

  primaryButton: {
    marginTop: 20,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
