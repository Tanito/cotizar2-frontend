import { Link } from "expo-router";
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  DocumentIcon,
  TimerIcon,
  WhatsAppIcon,
} from "../components/welcome-icons";

const FEATURES = [
  {
    Icon: TimerIcon,
    title: "Rápido",
    description: "Cotizá en minutos",
  },
  {
    Icon: DocumentIcon,
    title: "Profesional",
    description: "PDF listo para enviar",
  },
  {
    Icon: WhatsAppIcon,
    title: "Fácil",
    description: "Compartí por WhatsApp",
  },
] as const;

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          {/* <Text style={styles.tagline}>Cotizá y enviá en minutos</Text> */}
        </View>

        <View style={styles.actions}>
          <Link href="/quote/new" asChild>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>
                Crear presupuesto gratis
              </Text>
            </Pressable>
          </Link>

          <Link href="/login" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                ¿Ya sos Premium? Iniciar sesión
              </Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.features}>
          {FEATURES.map(({ Icon, title, description }) => (
            <View key={title} style={styles.feature}>
              <View style={styles.featureIconWrap}>
                <Icon size={22} />
              </View>
              <Text style={styles.featureTitle}>{title}</Text>
              <Text style={styles.featureDescription}>{description}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: "space-between",
  },

  header: {
    alignItems: "center",
    paddingTop: 24,
  },

  logo: {
    width: 220,
    height: 130,
  },

  tagline: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    color: "#6B7280",
    textAlign: "center",
  },

  actions: {
    gap: 12,
    paddingVertical: 8,
  },

  primaryButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  secondaryButton: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#2563EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2563EB",
  },

  features: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
  },

  feature: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 4,
  },

  featureIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  featureTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
  },

  featureDescription: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 15,
    color: "#6B7280",
    textAlign: "center",
  },
});
