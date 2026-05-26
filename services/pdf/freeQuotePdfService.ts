import { formatARS, getQuoteTotals } from "@/lib/utils/quoteUtils";
import type { FreeQuote } from "@/store/freeQuoteStore";

export type GeneratedQuotePdf = {
  pdfUri: string;
  whatsappText: string;
};

export async function generateLocalFreeQuotePdf(
  quote: FreeQuote,
  _existingPdfUrl?: string | null,
): Promise<GeneratedQuotePdf> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const totals = getQuoteTotals(quote.items, quote.depositPercentage);

  const lines = [
    `Presupuesto - ${quote.customerName}`,
    quote.customerPhone ? `Telefono: ${quote.customerPhone}` : null,
    `Rubro: ${quote.serviceType}`,
    "",
    ...quote.items.map(
      (item) =>
        `- ${item.description}: ${item.quantity} x ${formatARS(item.unitPrice)} = ${formatARS(item.quantity * item.unitPrice)}`,
    ),
    "",
    `Subtotal: ${formatARS(totals.subtotal)}`,
    `Seña sugerida (${quote.depositPercentage}%): ${formatARS(totals.depositAmount)}`,
    `Total: ${formatARS(totals.total)}`,
    `Validez: ${quote.validityDays} dias`,
    quote.notes ? `Notas: ${quote.notes}` : null,
  ].filter(Boolean) as string[];

  return {
    pdfUri: `quote-${Date.now()}`,
    whatsappText: lines.join("\n"),
  };
}
