import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE = "#2563EB";

export function WelcomeTabBar() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}
    >
      <View style={styles.spacer} />
      <View style={styles.spacer} />

      <View style={styles.centerTab}>
        <Link href="/home" asChild>
          <Pressable style={styles.fab}>
            <Ionicons name="diamond-outline" size={26} color="#FFFFFF" />
          </Pressable>
        </Link>
        <Text style={styles.centerLabel}>Premium</Text>
      </View>

      <View style={styles.spacer} />
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
    paddingHorizontal: 8,
  },

  spacer: {
    flex: 1,
  },

  centerTab: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingBottom: 2,
  },

  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ACTIVE,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -28,
    shadowColor: "#2563EB",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  centerLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: ACTIVE,
  },
});
