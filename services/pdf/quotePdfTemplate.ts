import {
  formatCurrencyAmounts,
  formatMoney,
  getItemCurrency,
  QUOTE_CURRENCIES,
  type QuoteCurrency,
  type QuoteTotals,
  type QuoteTotalsByCurrency,
} from "@/lib/utils/quoteUtils";
import type { FreeQuote } from "@/store/freeQuoteStore";

/** Colores del mockup */
const C = {
  navy: "#002060",
  royal: "#2563EB",
  light: "#EFF6FF",
  pill: "#DBEAFE",
  line: "#BFDBFE",
  border: "#E2E8F0",
  muted: "#64748B",
  stripe: "#F8FAFC",
  white: "#FFFFFF",
} as const;

const MIN_ROWS = 4;
const PAGE_W = 595;
const PAGE_H = 842;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatPdfMoney(amount: number, currency: QuoteCurrency): string {
  return formatMoney(amount, currency, 2);
}

function formatPdfTotals(
  totals: QuoteTotalsByCurrency,
  key: keyof QuoteTotals,
): string {
  const activeCurrencies = QUOTE_CURRENCIES.filter(
    (currency) => totals[currency].total !== 0,
  );
  const currencies: readonly QuoteCurrency[] =
    activeCurrencies.length > 0 ? activeCurrencies : ["ARS"];

  return currencies
    .map((currency) => formatPdfMoney(totals[currency][key], currency))
    .join("<br />");
}

function formatPdfDate(date: Date): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function buildQuoteNumber(): string {
  return String(Date.now()).slice(-6).padStart(6, "0");
}

function defaultPaymentTerms(depositPercentage: number): string {
  const remainder = Math.max(0, 100 - depositPercentage);
  return `${depositPercentage}% a la aceptación del encargo y ${remainder}% a su finalización.`;
}

/** Ícono SVG compacto (stroke azul) */
function ico(path: string, size = 20): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><path d="${path}" stroke="${C.royal}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function iconBubble(path: string): string {
  return `
    <table cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td width="44" height="44" align="center" valign="middle" bgcolor="${C.light}"
            style="width:44px;height:44px;background-color:${C.light};border-radius:22px;">
          ${ico(path, 20)}
        </td>
      </tr>
    </table>`;
}

const P = {
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  phone:
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  cal: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  wallet:
    "M19 7V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1M19 7H7a2 2 0 0 0 0 4h12M19 7v4",
  info: "M12 16v-4M12 8h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z",
};

function spacer(h = 16): string {
  return `<tr><td colspan="2" height="${h}" style="height:${h}px;font-size:0;line-height:0;">&nbsp;</td></tr>`;
}

export function buildFreeQuotePdfHtml(
  quote: FreeQuote,
  totals: QuoteTotalsByCurrency,
): string {
  const num = buildQuoteNumber();
  const rubro = escapeHtml(quote.serviceType.trim() || "Servicio").toUpperCase();
  const nombre = escapeHtml(quote.customerName.trim() || "Cliente");
  const tel = escapeHtml(quote.customerPhone.trim() || "-");
  const fecha = formatPdfDate(new Date());
  const pct = quote.depositPercentage;
  const dias = quote.validityDays;
  const pago = escapeHtml(defaultPaymentTerms(pct));

  const filas = quote.items
    .map((item, i) => {
      const total = item.quantity * item.unitPrice;
      const currency = getItemCurrency(item);
      const bg = i % 2 === 1 ? C.stripe : C.white;
      return `
        <tr>
          <td bgcolor="${bg}" style="padding:12px 10px;background-color:${bg};border-top:1px solid ${C.border};border-right:1px solid ${C.border};color:${C.navy};font-size:13px;font-weight:600;">${escapeHtml(item.description)}</td>
          <td bgcolor="${bg}" align="center" style="padding:12px 8px;background-color:${bg};border-top:1px solid ${C.border};border-right:1px solid ${C.border};color:${C.navy};font-size:13px;">${item.quantity}</td>
          <td bgcolor="${bg}" align="right" style="padding:12px 10px;background-color:${bg};border-top:1px solid ${C.border};border-right:1px solid ${C.border};color:${C.navy};font-size:13px;">${formatPdfMoney(item.unitPrice, currency)}</td>
          <td bgcolor="${bg}" align="right" style="padding:12px 10px;background-color:${bg};border-top:1px solid ${C.border};color:${C.navy};font-size:13px;font-weight:800;">${formatPdfMoney(total, currency)}</td>
        </tr>`;
    })
    .join("");

  const vacias = Array.from(
    { length: Math.max(0, MIN_ROWS - quote.items.length) },
    (_, i) => {
      const idx = quote.items.length + i;
      const bg = idx % 2 === 1 ? C.stripe : C.white;
      return `
        <tr>
          <td bgcolor="${bg}" height="40" style="height:40px;background-color:${bg};border-top:1px solid ${C.border};border-right:1px solid ${C.border};">&nbsp;</td>
          <td bgcolor="${bg}" style="background-color:${bg};border-top:1px solid ${C.border};border-right:1px solid ${C.border};"></td>
          <td bgcolor="${bg}" style="background-color:${bg};border-top:1px solid ${C.border};border-right:1px solid ${C.border};"></td>
          <td bgcolor="${bg}" style="background-color:${bg};border-top:1px solid ${C.border};"></td>
        </tr>`;
    },
  ).join("");

  const notas = quote.notes.trim()
    ? `
      ${spacer(12)}
      <tr>
        <td colspan="2" style="border:1px solid ${C.border};padding:14px 16px;">
          <div style="font-size:11px;font-weight:800;color:${C.royal};text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Notas</div>
          <div style="font-size:12px;color:${C.muted};line-height:1.5;">${escapeHtml(quote.notes.trim())}</div>
        </td>
      </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=${PAGE_W}" />
  <style>
    @page { size: A4 portrait; margin: 10mm; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { margin: 0; padding: 0; }
    table { border-collapse: collapse; }
  </style>
</head>
<body style="margin:0;padding:20px 24px;font-family:Helvetica,Arial,sans-serif;background:${C.white};color:${C.navy};">

  <!-- Documento principal: solo tablas + estilos inline -->
  <table width="${PAGE_W - 48}" cellpadding="0" cellspacing="0" align="center" role="presentation" style="width:100%;max-width:${PAGE_W - 48}px;">

    <!-- CABECERA -->
    <tr>
      <td width="55%" valign="top" style="font-size:30px;font-weight:800;color:${C.navy};letter-spacing:1px;text-transform:uppercase;line-height:1.1;">
        ${rubro}
      </td>
      <td width="45%" valign="top" align="right">
        <div style="font-size:19px;font-weight:800;color:${C.navy};letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Presupuesto</div>
        <table cellpadding="0" cellspacing="0" align="right" role="presentation">
          <tr>
            <td bgcolor="${C.royal}" style="background-color:${C.royal};color:${C.white};font-size:11px;font-weight:700;padding:6px 14px;border-radius:20px;">
              N° ${num}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    ${spacer(12)}
    <tr><td colspan="2" style="border-bottom:1px solid ${C.line};font-size:0;line-height:0;">&nbsp;</td></tr>
    ${spacer(18)}

    <!-- CLIENTE | FECHA -->
    <tr>
      <td colspan="2">
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.border};">
          <tr>
            <td width="58%" valign="top" style="padding:16px 18px;border-right:1px solid ${C.border};">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="top" style="padding-right:12px;">${iconBubble(P.user)}</td>
                  <td valign="top">
                    <div style="font-size:11px;font-weight:700;color:${C.royal};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Cliente</div>
                    <div style="font-size:18px;font-weight:800;color:${C.navy};margin-bottom:10px;">${nombre}</div>
                    <table cellpadding="0" cellspacing="0" style="margin-bottom:4px;">
                      <tr>
                        <td style="padding-right:6px;" valign="middle">${ico(P.phone, 14)}</td>
                        <td style="font-size:12px;color:${C.muted};" valign="middle">Teléfono: ${tel}</td>
                      </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:6px;" valign="middle">${ico(P.mail, 14)}</td>
                        <td style="font-size:12px;color:${C.muted};" valign="middle">E-mail: -</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
            <td width="42%" valign="middle" style="padding:16px 18px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="middle" style="padding-right:10px;">${iconBubble(P.cal)}</td>
                  <td valign="middle" style="font-size:15px;font-weight:700;color:${C.navy};">Fecha: ${fecha}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    ${spacer(18)}

    <!-- TABLA ÍTEMS -->
    <tr>
      <td colspan="2">
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.border};">
          <tr>
            <td bgcolor="${C.navy}" style="padding:12px 10px;background-color:${C.navy};color:${C.white};font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-right:1px solid rgba(255,255,255,0.15);">Concepto</td>
            <td bgcolor="${C.navy}" align="center" width="12%" style="padding:12px 8px;background-color:${C.navy};color:${C.white};font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-right:1px solid rgba(255,255,255,0.15);">Cant.</td>
            <td bgcolor="${C.navy}" align="right" width="22%" style="padding:12px 10px;background-color:${C.navy};color:${C.white};font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-right:1px solid rgba(255,255,255,0.15);">Precio unit.</td>
            <td bgcolor="${C.navy}" align="right" width="22%" style="padding:12px 10px;background-color:${C.navy};color:${C.white};font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Total</td>
          </tr>
          ${filas}
          ${vacias}
        </table>
      </td>
    </tr>

    ${spacer(18)}

    <!-- SEÑA | TOTAL -->
    <tr>
      <td colspan="2">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <!-- Seña sugerida -->
            <td width="49%" valign="top">
              <table width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.light}"
                     style="background-color:${C.light};border:1px solid ${C.line};">
                <tr>
                  <td style="padding:16px 14px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="52" valign="middle" style="padding-right:10px;">${iconBubble(P.wallet)}</td>
                        <td valign="middle">
                          <div style="font-size:10px;font-weight:700;color:${C.royal};text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Seña sugerida</div>
                          <div style="font-size:32px;font-weight:800;color:${C.navy};line-height:1;margin-bottom:8px;">${pct}%</div>
                          <table cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td bgcolor="${C.pill}" style="background-color:${C.pill};color:${C.navy};font-size:14px;font-weight:800;padding:6px 16px;border-radius:20px;">
                                ${formatPdfTotals(totals, "depositAmount")}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
            <td width="2%"></td>
            <!-- Total -->
            <td width="49%" valign="top">
              <table width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.light}"
                     style="background-color:${C.light};border:1px solid ${C.line};height:100%;">
                <tr>
                  <td style="padding:16px 18px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td valign="middle" style="font-size:26px;font-weight:800;color:${C.royal};">TOTAL</td>
                        <td valign="middle" align="right" style="font-size:22px;font-weight:800;color:${C.navy};line-height:1.35;">${formatPdfTotals(totals, "total")}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    ${spacer(18)}

    <!-- FORMA DE PAGO | VALIDEZ -->
    <tr>
      <td colspan="2">
        <table width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.light}"
               style="background-color:${C.light};border:1px solid ${C.line};">
          <tr>
            <td width="50%" valign="top" style="padding:16px 18px;border-right:1px solid ${C.line};">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="top" style="padding-right:10px;">${iconBubble(P.info)}</td>
                  <td valign="top">
                    <div style="font-size:11px;font-weight:800;color:${C.royal};text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Forma de pago</div>
                    <div style="font-size:12px;color:${C.muted};line-height:1.55;">${pago}</div>
                  </td>
                </tr>
              </table>
            </td>
            <td width="50%" valign="top" style="padding:16px 18px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="top" style="padding-right:10px;">${iconBubble(P.cal)}</td>
                  <td valign="top">
                    <div style="font-size:11px;font-weight:800;color:${C.royal};text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Validez</div>
                    <div style="font-size:12px;color:${C.muted};line-height:1.55;">
                      Este presupuesto tiene validez por
                      <span style="color:${C.royal};font-weight:800;">${dias} días</span>.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    ${notas}

    ${spacer(20)}
    <tr><td colspan="2" style="border-top:1px solid ${C.line};font-size:0;">&nbsp;</td></tr>
    ${spacer(12)}
    <tr>
      <td colspan="2" align="center" style="font-size:12px;color:${C.muted};">
        Generado por <span style="color:${C.royal};font-weight:800;">CotizAR</span>
      </td>
    </tr>

  </table>
</body>
</html>`;
}

export const QUOTE_PDF_PRINT_WIDTH = PAGE_W;
export const QUOTE_PDF_PRINT_HEIGHT = PAGE_H;

export function buildWhatsappQuoteText(
  quote: FreeQuote,
  totals: QuoteTotalsByCurrency,
): string {
  const lines = [
    `Presupuesto - ${quote.customerName}`,
    quote.customerPhone ? `Teléfono: ${quote.customerPhone}` : null,
    `Rubro: ${quote.serviceType}`,
    "",
    ...quote.items.map(
      (item) =>
        `- ${item.description}: ${item.quantity} x ${formatMoney(item.unitPrice, getItemCurrency(item))} = ${formatMoney(item.quantity * item.unitPrice, getItemCurrency(item))}`,
    ),
    "",
    `Subtotal: ${formatCurrencyAmounts({ ARS: totals.ARS.subtotal, USD: totals.USD.subtotal })}`,
    `Seña sugerida (${quote.depositPercentage}%): ${formatCurrencyAmounts({ ARS: totals.ARS.depositAmount, USD: totals.USD.depositAmount })}`,
    `Total: ${formatCurrencyAmounts({ ARS: totals.ARS.total, USD: totals.USD.total })}`,
    `Validez: ${quote.validityDays} días`,
    quote.notes ? `Notas: ${quote.notes}` : null,
  ].filter(Boolean) as string[];

  return lines.join("\n");
}
