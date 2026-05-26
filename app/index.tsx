import { Link } from "expo-router";
import {
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const FEATURES = [
  {
    title: "Sin registro",
    description: "Usalo gratis sin crear cuenta",
    icon: "👤",
  },
  {
    title: "Rápido y simple",
    description: "Creá y enviá en segundos",
    icon: "⚡",
  },
  {
    title: "Por WhatsApp",
    description: "Compartí al instante",
    icon: "💬",
  },
];

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.hero}>
          <Text style={styles.title}>
            Cotizá y enviá{"\n"}
            presupuestos{"\n"}
            profesionales{"\n"}
            <Text style={styles.highlight}>en minutos</Text>
          </Text>

          <Text style={styles.subtitle}>
            Simple, rápido y gratis.{"\n"}
            Ideal para WhatsApp.
          </Text>

          <Image
            source={require("../assets/images/icon.png")}
            style={styles.heroIcon}
            resizeMode="contain"
          />
        </View>

        <Link href="/home" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>
              + Nuevo presupuesto
            </Text>
          </Pressable>
        </Link>

        <View style={styles.featuresCard}>
          {FEATURES.map((feature, index) => (
            <View key={feature.title}>
              <View style={styles.featureRow}>
                <View style={styles.iconBubble}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                </View>

                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </View>
              </View>

              {index < FEATURES.length - 1 && (
                <View style={styles.separator} />
              )}
            </View>
          ))}
        </View>

        <Link href="/login" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>
              Iniciar sesión
            </Text>
          </Pressable>
        </Link>

        <Link href="/register" asChild>
          <Pressable style={styles.linkButton}>
            <Text style={styles.linkText}>
              Crear cuenta Premium
            </Text>
          </Pressable>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scroll: {
    paddingHorizontal: 28,
    paddingTop: 18,
    paddingBottom: 36,
  },

  logo: {
    width: 400,
    height: 140,
    alignSelf: "center",
  },

  hero: {
    marginTop: 28,
    position: "relative",
    minHeight: 360,
  },

  title: {
    fontSize: 34,
    lineHeight: 44,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.8,
    maxWidth: "72%",
  },

  highlight: {
    color: "#2563EB",
  },

  subtitle: {
    marginTop: 22,
    fontSize: 18,
    lineHeight: 28,
    color: "#475569",
    fontWeight: "500",
    maxWidth: "68%",
  },

  heroIcon: {
    width: 170,
    height: 170,
    position: "absolute",
    right: -8,
    top: 96,
    opacity: 0.09,
  },

  primaryButton: {
    height: 62,
    borderRadius: 18,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 8,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  featuresCard: {
    marginTop: 28,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 4,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },

  iconBubble: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  featureIcon: {
    fontSize: 22,
  },

  featureText: {
    flex: 1,
  },

  featureTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },

  featureDescription: {
    marginTop: 4,
    fontSize: 16,
    color: "#64748B",
    lineHeight: 22,
  },

  separator: {
    height: 1,
    backgroundColor: "#EEF2F7",
    marginLeft: 68,
  },

  secondaryButton: {
    marginTop: 28,
    height: 58,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#DCE7F8",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  linkButton: {
    marginTop: 18,
    alignItems: "center",
  },

  linkText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2563EB",
  },
});