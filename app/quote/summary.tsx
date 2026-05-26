import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { formatARS } from "@/lib/utils/quoteUtils";
import { useFreeQuoteStore } from "@/store/freeQuoteStore";

export default function QuoteSummaryScreen() {
  const router = useRouter();
  const quote = useFreeQuoteStore((state) => state.quote);

  const subtotal = quote.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen</Text>
      <Text style={styles.subtitle}>
        Cliente: {quote.customerName || "Sin nombre"}
      </Text>
      <Text style={styles.meta}>{quote.items.length} items agregados</Text>
      <Text style={styles.total}>{formatARS(subtotal)}</Text>
      <Text style={styles.hint}>Proximo paso: pantalla de resumen completa.</Text>

      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Volver a items</Text>
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

  meta: {
    marginTop: 16,
    fontSize: 16,
    color: "#94A3B8",
  },

  total: {
    marginTop: 24,
    fontSize: 34,
    fontWeight: "800",
    color: "#2563EB",
  },

  hint: {
    marginTop: 16,
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
