import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useFreeQuoteStore } from "@/store/freeQuoteStore";

export default function QuoteItemsScreen() {
  const router = useRouter();
  const quote = useFreeQuoteStore((state) => state.quote);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Items</Text>
      <Text style={styles.subtitle}>
        Presupuesto para {quote.customerName || "tu cliente"}
      </Text>
      <Text style={styles.hint}>Proximo paso: agregar items al presupuesto.</Text>

      <Pressable style={styles.button} onPress={() => router.replace("/")}>
        <Text style={styles.buttonText}>Volver al inicio</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 24,
    paddingTop: 80,
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

  hint: {
    marginTop: 24,
    fontSize: 16,
    color: "#94A3B8",
  },

  button: {
    marginTop: 32,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
