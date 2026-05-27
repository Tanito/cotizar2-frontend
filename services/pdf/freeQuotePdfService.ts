import * as Print from "expo-print";

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

  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; color: #0F172A; padding: 24px; }
          h1 { font-size: 24px; margin: 0 0 16px 0; }
          h2 { font-size: 16px; margin: 22px 0 8px 0; color: #334155; }
          .meta { margin-bottom: 4px; color: #475569; }
          .item { margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #E2E8F0; }
          .total { margin-top: 14px; font-size: 18px; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Presupuesto - ${quote.customerName || "Cliente"}</h1>
        <div class="meta">Telefono: ${quote.customerPhone || "-"}</div>
        <div class="meta">Rubro: ${quote.serviceType || "-"}</div>
        <div class="meta">Validez: ${quote.validityDays} dias</div>
        <div class="meta">Seña sugerida: ${quote.depositPercentage}%</div>

        <h2>Items</h2>
        ${quote.items
          .map(
            (item) => `
              <div class="item">
                <div><strong>${item.description}</strong></div>
                <div>${item.quantity} x ${formatARS(item.unitPrice)} = ${formatARS(item.quantity * item.unitPrice)}</div>
              </div>
            `,
          )
          .join("")}

        <h2>Totales</h2>
        <div class="meta">Subtotal: ${formatARS(totals.subtotal)}</div>
        <div class="meta">Seña sugerida: ${formatARS(totals.depositAmount)}</div>
        <div class="total">Total: ${formatARS(totals.total)}</div>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });

  return { pdfUri: uri, whatsappText: lines.join("\n") };
}
