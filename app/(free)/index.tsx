import { Link } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { WelcomeTabBar } from "@/components/welcome-tab-bar";

const FEATURES = [
  {
    icon: "⚡",
    iconBg: "#FEF3C7",
    title: "Sin registro",
    description: "Entras y cotizas. Sin crear cuenta.",
  },
  {
    icon: "📄",
    iconBg: "#DBEAFE",
    title: "PDF profesional",
    description: "Presupuesto limpio y listo para enviar.",
  },
  {
    icon: "💬",
    iconBg: "#DCFCE7",
    title: "WhatsApp",
    description: "Compartilo con un toque.",
  },
] as const;

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          /> */}

          <Text style={styles.tagline}>
            Presupuestos profesionales para tecnicos y oficios. Sin
            registro.
          </Text>

          <View style={styles.heroCard}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>FREE • SIN CUENTA</Text>
            </View>

            <Text style={styles.heroTitle}>
              Crea tu{"\n"}
              presupuesto{"\n"}
              en minutos
            </Text>

            <Text style={styles.heroDescription}>
              Arma un PDF profesional y compartilo directo por WhatsApp.
            </Text>

            <Link href="/quote/new?from=free" asChild>
              <Pressable style={styles.heroButton}>
                <Text style={styles.heroButtonText}>+ Nuevo presupuesto</Text>
              </Pressable>
            </Link>
          </View>

          <Text style={styles.sectionTitle}>¿Que podes hacer gratis?</Text>

          <View style={styles.featuresList}>
            {FEATURES.map((feature) => (
              <View key={feature.title} style={styles.featureCard}>
                <View
                  style={[styles.featureIconWrap, { backgroundColor: feature.iconBg }]}
                >
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                </View>

                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>

          {/* <View style={styles.premiumCard}>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>PREMIUM</Text>
            </View>

            <Text style={styles.premiumTitle}>Guarda todo</Text>

            <Text style={styles.premiumDescription}>
              Clientes, historial, catalogo de precios, branding y mas.
            </Text>

            <Link href="/premium" asChild>
              <Pressable style={styles.premiumButton}>
                <Text style={styles.premiumButtonText}>Ver Premium</Text>
              </Pressable>
            </Link>
          </View> */}

          <Text style={styles.footer}>
            Tenes ideas?{" "}
            <Text style={styles.footerLink}>Mandanos feedback</Text>
          </Text>
        </View>
      </ScrollView>

      <View style={styles.tabBarWrap}>
        <WelcomeTabBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scroll: {
    flexGrow: 1,
    paddingBottom: 100,
  },

  tabBarWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },

  content: {
    minHeight: "100%",
    borderRadius: 44,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  logo: {
    width: 468,
    height: 278,
    alignSelf: "center",
  },

  tagline: {
    marginTop: 6,
    fontSize: 26,
    lineHeight: 38,
    color: "#475569",
  },

  heroCard: {
    marginTop: 32,
    borderRadius: 34,
    paddingHorizontal: 28,
    paddingVertical: 28,
    backgroundColor: "#2563EB",
    shadowColor: "#2563EB",
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },

  heroBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  heroBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: "#FFFFFF",
  },

  heroTitle: {
    marginTop: 20,
    fontSize: 44,
    lineHeight: 52,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  heroDescription: {
    marginTop: 20,
    fontSize: 24,
    lineHeight: 34,
    color: "#FFFFFF",
  },

  heroButton: {
    marginTop: 28,
    height: 64,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  heroButtonText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2563EB",
  },

  sectionTitle: {
    marginTop: 32,
    marginBottom: 20,
    fontSize: 34,
    lineHeight: 58,
    fontWeight: "800",
    color: "#0F172A",
  },

  featuresList: {
    gap: 16,
  },

  featureCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 24,
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  featureIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  featureIcon: {
    fontSize: 30,
  },

  featureTitle: {
    fontSize: 30,
    lineHeight: 56,
    fontWeight: "800",
    color: "#0F172A",
  },

  featureDescription: {
    marginTop: 8,
    fontSize: 21,
    lineHeight: 31,
    color: "#64748B",
  },

  premiumCard: {
    marginTop: 32,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 24,
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  premiumBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  premiumBadgeText: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: "#2563EB",
  },

  premiumTitle: {
    marginTop: 20,
    fontSize: 30,
    lineHeight: 64,
    fontWeight: "800",
    color: "#0F172A",
  },

  premiumDescription: {
    marginTop: 12,
    fontSize: 22,
    lineHeight: 33,
    color: "#64748B",
  },

  premiumButton: {
    marginTop: 24,
    height: 64,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#2563EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  premiumButtonText: {
    fontSize: 23,
    fontWeight: "800",
    color: "#2563EB",
  },

  footer: {
    paddingTop: 32,
    paddingBottom: 16,
    textAlign: "center",
    fontSize: 18,
    lineHeight: 28,
    color: "#64748B",
  },

  footerLink: {
    fontWeight: "800",
    color: "#2563EB",
  },
});
