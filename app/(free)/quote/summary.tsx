import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { businessProfileRepository } from "@/services/business/businessProfileRepository";
import { brandingRepository } from "@/services/branding/brandingRepository";
import { formatARS, getQuoteTotals } from "@/lib/utils/quoteUtils";
import { generateLocalFreeQuotePdf } from "@/services/pdf/freeQuotePdfService";
import { generateLocalPremiumQuotePdf } from "@/services/pdf/premiumQuotePdfService";
import { useFreeQuoteStore } from "@/store/freeQuoteStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";

function Step({ label, active }: { label: string; active?: boolean }) {
  return (
    <View style={styles.step}>
      <View style={[styles.stepBar, active && styles.stepBarActive]} />
      <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

export default function QuoteSummaryScreen() {
  const router = useRouter();
  const isPremium = useSubscriptionStore((state) => state.isPremium);
  const quote = useFreeQuoteStore((state) => state.quote);
  const pdfUrl = useFreeQuoteStore((state) => state.pdfUrl);
  const setPdfResult = useFreeQuoteStore((state) => state.setPdfResult);
  const [isGenerating, setIsGenerating] = useState(false);

  const totals = useMemo(
    () => getQuoteTotals(quote.items, quote.depositPercentage),
    [quote.items, quote.depositPercentage],
  );

  useEffect(() => {
    if (!quote.items.length) {
      router.replace("/quote/items");
    }
  }, [quote.items.length, router]);

  const onGeneratePdf = async () => {
    setIsGenerating(true);
    try {
      const [businessProfile, branding] = isPremium
        ? await Promise.all([
            businessProfileRepository.getProfile(),
            brandingRepository.getBranding(),
          ])
        : [null, null];

      const data = isPremium
        ? await generateLocalPremiumQuotePdf(quote, businessProfile, branding, pdfUrl)
        : await generateLocalFreeQuotePdf(quote, pdfUrl);
      setPdfResult(data.pdfUri, data.whatsappText);
      router.push("/quote/pdf-preview");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!quote.items.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>VOLVER</Text>
        </Pressable>

        <Text style={styles.title}>Resumen</Text>
        <Text style={styles.subtitle}>Revisa precios y condiciones</Text>

        <View style={styles.stepperCard}>
          <View style={styles.stepperRow}>
            <Step label="Datos" />
            <Step label="Items" />
            <Step label="Resumen" active />
            <Step label="PDF" />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>CLIENTE</Text>
          <Text style={styles.customerName}>{quote.customerName}</Text>

          {quote.customerPhone ? (
            <Text style={styles.customerPhone}>{quote.customerPhone}</Text>
          ) : null}

          <View style={styles.metaBox}>
            <Text style={styles.metaText}>Rubro: {quote.serviceType}</Text>
            <Text style={styles.metaText}>
              Validez: {quote.validityDays} dias
            </Text>
            <Text style={styles.metaText}>Seña: {quote.depositPercentage}%</Text>
            {quote.notes ? (
              <Text style={[styles.metaText, styles.notesText]}>
                Notas: {quote.notes}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={[styles.card, styles.cardSpaced]}>
          <Text style={styles.sectionLabel}>ITEMS</Text>

          {quote.items.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                index < quote.items.length - 1 && styles.itemRowBorder,
              ]}
            >
              <View style={styles.itemInfo}>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemMeta}>
                  {item.quantity} x {formatARS(item.unitPrice)}
                </Text>
              </View>

              <Text style={styles.itemTotal}>
                {formatARS(item.quantity * item.unitPrice)}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.totalCard, styles.cardSpaced]}>
          <View style={styles.totalRow}>
            <Text style={styles.totalRowLabel}>Subtotal</Text>
            <Text style={styles.totalRowValue}>{formatARS(totals.subtotal)}</Text>
          </View>

          <View style={styles.totalRowSpaced}>
            <Text style={styles.totalRowLabel}>Seña sugerida</Text>
            <Text style={styles.totalRowValue}>
              {formatARS(totals.depositAmount)}
            </Text>
          </View>

          <View style={styles.totalFooter}>
            <View style={styles.totalRow}>
              <Text style={styles.totalFinalLabel}>Total</Text>
              <Text style={styles.totalFinalValue}>{formatARS(totals.total)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.generateButton, isGenerating && styles.buttonDisabled]}
          onPress={() => void onGeneratePdf()}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.generateButtonText}>Generar PDF</Text>
          )}
        </Pressable>

        <Pressable
          style={styles.editButton}
          onPress={() => router.push("/quote/items")}
        >
          <Text style={styles.editButtonText}>Editar items</Text>
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
    paddingBottom: 170,
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

  stepperCard: {
    marginTop: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  stepperRow: {
    flexDirection: "row",
    gap: 12,
  },

  step: {
    flex: 1,
    alignItems: "center",
  },

  stepBar: {
    height: 8,
    width: "100%",
    borderRadius: 999,
    backgroundColor: "#E2E8F0",
  },

  stepBarActive: {
    backgroundColor: "#2563EB",
  },

  stepLabel: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },

  stepLabelActive: {
    color: "#0F172A",
  },

  card: {
    marginTop: 32,
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
  },

  customerName: {
    marginTop: 12,
    fontSize: 34,
    fontWeight: "800",
    color: "#0F172A",
  },

  customerPhone: {
    marginTop: 8,
    fontSize: 17,
    color: "#64748B",
  },

  metaBox: {
    marginTop: 20,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },

  metaText: {
    fontSize: 16,
    color: "#334155",
  },

  notesText: {
    marginTop: 12,
    color: "#475569",
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingBottom: 16,
    marginBottom: 16,
  },

  itemRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  itemInfo: {
    flex: 1,
    paddingRight: 16,
  },

  itemDescription: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },

  itemMeta: {
    marginTop: 8,
    fontSize: 15,
    color: "#64748B",
  },

  itemTotal: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2563EB",
  },

  totalCard: {
    borderRadius: 24,
    backgroundColor: "#0F172A",
    padding: 24,
  },

  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  totalRowSpaced: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  totalRowLabel: {
    fontSize: 16,
    color: "#CBD5E1",
  },

  totalRowValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  totalFooter: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#334155",
    paddingTop: 20,
  },

  totalFinalLabel: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  totalFinalValue: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
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

  generateButton: {
    height: 64,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonDisabled: {
    opacity: 0.85,
  },

  generateButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  editButton: {
    marginTop: 16,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },

  editButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
  },
});
