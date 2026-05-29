import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter, type Href } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DashboardScreen } from "@/components/dashboard-screen";
import { ChevronRightIcon } from "@/components/dashboard-icons";
import { setLoggedIn, setQuoteFlowOrigin } from "@/store/quoteFlowStore";

type MenuItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  href?: Href;
  danger?: boolean;
  onPress?: () => void;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

function MenuRow({ item }: { item: MenuItem }) {
  const content = (
    <>
      <Ionicons
        name={item.icon}
        size={22}
        color={item.danger ? "#DC2626" : "#374151"}
      />
      <Text
        style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}
      >
        {item.label}
      </Text>
      {!item.danger ? <ChevronRightIcon /> : null}
    </>
  );

  if (item.href) {
    return (
      <Link href={item.href} asChild>
        <Pressable style={styles.menuRow}>{content}</Pressable>
      </Link>
    );
  }

  return (
    <Pressable style={styles.menuRow} onPress={item.onPress}>
      {content}
    </Pressable>
  );
}

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const sections: MenuSection[] = [
    {
      title: "Mi negocio",
      items: [
        { label: "Perfil de mi negocio", icon: "person-outline" },
        { label: "Marca y logo", icon: "color-palette-outline" },
        { label: "Valores por defecto", icon: "document-text-outline" },
        { label: "Formas de pago", icon: "wallet-outline" },
      ],
    },
    {
      title: "Herramientas",
      items: [
        { label: "Catálogo", icon: "grid-outline", href: "/catalog" },
        { label: "Plantillas", icon: "copy-outline" },
        { label: "Chat de ayuda", icon: "chatbubble-ellipses-outline" },
      ],
    },
    {
      title: "Cuenta",
      items: [
        {
          label: "Cerrar sesión",
          icon: "log-out-outline",
          danger: true,
          onPress: () => {
            setLoggedIn(false);
            setQuoteFlowOrigin("free");
            router.replace("/login");
          },
        },
      ],
    },
  ];

  return (
    <DashboardScreen activeTab="more">
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>Más</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {section.items.map((item) => (
              <MenuRow key={item.label} item={item} />
            ))}
          </View>
        ))}
      </ScrollView>
    </DashboardScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    gap: 14,
  },

  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#0F172A",
  },

  menuLabelDanger: {
    color: "#DC2626",
    fontWeight: "600",
  },
});
