import * as Print from "expo-print";

import type { BusinessProfile } from "@/lib/models/businessProfile";
import type { BrandingSettings } from "@/lib/models/branding";
import { getQuoteTotalsByCurrency } from "@/lib/utils/quoteUtils";
import type { FreeQuote } from "@/store/freeQuoteStore";

import {
  buildPremiumQuotePdfHtml,
  PREMIUM_QUOTE_PDF_PRINT_HEIGHT,
  PREMIUM_QUOTE_PDF_PRINT_WIDTH,
} from "./premiumQuotePdfTemplate";
import { buildWhatsappQuoteText } from "./quotePdfTemplate";
import { prepareShareablePdfUri } from "./shareQuotePdf";

export type GeneratedQuotePdf = {
  pdfUri: string;
  whatsappText: string;
};

export async function generateLocalPremiumQuotePdf(
  quote: FreeQuote,
  businessProfile: BusinessProfile | null,
  branding: BrandingSettings | null,
  _existingPdfUrl?: string | null,
): Promise<GeneratedQuotePdf> {
  const totals = getQuoteTotalsByCurrency(quote.items, quote.depositPercentage);
  const html = await buildPremiumQuotePdfHtml(
    quote,
    totals,
    businessProfile,
    branding,
  );

  const { uri } = await Print.printToFileAsync({
    html,
    width: PREMIUM_QUOTE_PDF_PRINT_WIDTH,
    height: PREMIUM_QUOTE_PDF_PRINT_HEIGHT,
  });
  const pdfUri = await prepareShareablePdfUri(uri);

  return {
    pdfUri,
    whatsappText: buildWhatsappQuoteText(quote, totals),
  };
}
