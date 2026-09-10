import * as Print from "expo-print";

import { getQuoteTotalsByCurrency } from "@/lib/utils/quoteUtils";
import type { FreeQuote } from "@/store/freeQuoteStore";

import {
  buildFreeQuotePdfHtml,
  buildWhatsappQuoteText,
  QUOTE_PDF_PRINT_HEIGHT,
  QUOTE_PDF_PRINT_WIDTH,
} from "./quotePdfTemplate";
import { prepareShareablePdfUri } from "./shareQuotePdf";

export type GeneratedQuotePdf = {
  pdfUri: string;
  whatsappText: string;
};

export async function generateLocalFreeQuotePdf(
  quote: FreeQuote,
  _existingPdfUrl?: string | null,
): Promise<GeneratedQuotePdf> {
  const totals = getQuoteTotalsByCurrency(quote.items, quote.depositPercentage);
  const html = buildFreeQuotePdfHtml(quote, totals);

  const { uri } = await Print.printToFileAsync({
    html,
    width: QUOTE_PDF_PRINT_WIDTH,
    height: QUOTE_PDF_PRINT_HEIGHT,
  });
  const pdfUri = await prepareShareablePdfUri(uri);

  return {
    pdfUri,
    whatsappText: buildWhatsappQuoteText(quote, totals),
  };
}
