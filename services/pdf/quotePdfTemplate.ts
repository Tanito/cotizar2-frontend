import { formatARS, type QuoteTotals } from "@/lib/utils/quoteUtils";
import type { FreeQuote } from "@/store/freeQuoteStore";

const NAVY = "#002060";
const ACCENT = "#2563EB";
const ACCENT_SOFT = "#DBEAFE";
const BORDER = "#E2E8F0";
const MUTED = "#64748B";
const ROW_ALT = "#F8FAFC";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatPdfMoney(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
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

function svgIcon(pathD: string, size = 18): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${pathD}" stroke="${ACCENT}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function iconCircle(pathD: string): string {
  return `<span class="icon-circle">${svgIcon(pathD)}</span>`;
}

const PATHS = {
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  phone:
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  calendar:
    "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  wallet:
    "M19 7V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1M19 7H7a2 2 0 0 0 0 4h12M19 7v4",
  info: "M12 16v-4M12 8h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z",
};

export function buildFreeQuotePdfHtml(
  quote: FreeQuote,
  totals: QuoteTotals,
): string {
  const quoteNumber = buildQuoteNumber();
  const serviceLabel = escapeHtml(quote.serviceType.trim() || "Servicio").toUpperCase();
  const customerName = escapeHtml(quote.customerName.trim() || "Cliente");
  const phone = escapeHtml(quote.customerPhone.trim() || "-");
  const dateLabel = formatPdfDate(new Date());
  const depositPct = quote.depositPercentage;
  const validityDays = quote.validityDays;
  const paymentTerms = escapeHtml(defaultPaymentTerms(depositPct));
  const notesBlock = quote.notes.trim()
    ? `
        <section class="notes-card">
          <p class="footer-title">NOTAS</p>
          <p class="footer-text">${escapeHtml(quote.notes.trim())}</p>
        </section>
      `
    : "";

  const itemRows = quote.items
    .map((item, index) => {
      const lineTotal = item.quantity * item.unitPrice;
      const rowClass = index % 2 === 1 ? "row-alt" : "";
      return `
        <tr class="${rowClass}">
          <td class="col-concept">${escapeHtml(item.description)}</td>
          <td class="col-qty">${item.quantity}</td>
          <td class="col-money">${formatPdfMoney(item.unitPrice)}</td>
          <td class="col-money">${formatPdfMoney(lineTotal)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 28px 32px 24px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            color: ${NAVY};
            background: #ffffff;
            font-size: 13px;
            line-height: 1.45;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 14px;
          }
          .service-title {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: 0.02em;
            margin: 0;
            color: ${NAVY};
          }
          .doc-title-wrap { text-align: right; }
          .doc-title {
            font-size: 22px;
            font-weight: 800;
            letter-spacing: 0.04em;
            margin: 0 0 8px 0;
            color: ${NAVY};
          }
          .quote-badge {
            display: inline-block;
            background: ${NAVY};
            color: #ffffff;
            font-size: 11px;
            font-weight: 700;
            padding: 5px 12px;
            border-radius: 999px;
            letter-spacing: 0.03em;
          }
          .divider {
            height: 2px;
            background: ${ACCENT};
            border: none;
            margin: 0 0 18px 0;
          }
          .info-card {
            display: flex;
            border: 1px solid ${BORDER};
            border-radius: 14px;
            overflow: hidden;
            margin-bottom: 20px;
          }
          .info-col {
            flex: 1;
            padding: 16px 18px;
          }
          .info-col + .info-col {
            border-left: 1px solid ${BORDER};
          }
          .client-row {
            display: flex;
            align-items: flex-start;
            gap: 12px;
          }
          .icon-circle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: ${ACCENT_SOFT};
            flex-shrink: 0;
          }
          .label-small {
            font-size: 11px;
            font-weight: 700;
            color: ${ACCENT};
            text-transform: uppercase;
            letter-spacing: 0.04em;
            margin-bottom: 2px;
          }
          .client-name {
            font-size: 17px;
            font-weight: 800;
            margin: 0 0 10px 0;
            color: ${NAVY};
          }
          .contact-line {
            display: flex;
            align-items: center;
            gap: 8px;
            color: ${MUTED};
            font-size: 12px;
            margin-bottom: 4px;
          }
          .contact-line svg { width: 14px; height: 14px; }
          .date-block {
            display: flex;
            align-items: center;
            gap: 12px;
            height: 100%;
          }
          .date-text {
            font-size: 14px;
            font-weight: 700;
            color: ${NAVY};
          }
          .table-wrap {
            border: 1px solid ${BORDER};
            border-radius: 14px;
            overflow: hidden;
            margin-bottom: 18px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          thead th {
            background: ${NAVY};
            color: #ffffff;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            padding: 12px 14px;
            text-align: left;
          }
          tbody td {
            padding: 12px 14px;
            border-top: 1px solid ${BORDER};
            color: ${NAVY};
            vertical-align: top;
          }
          tbody tr.row-alt td { background: ${ROW_ALT}; }
          .col-concept { width: 46%; font-weight: 600; }
          .col-qty { width: 12%; text-align: center; }
          .col-money { width: 21%; text-align: right; white-space: nowrap; }
          thead th.col-qty { text-align: center; }
          thead th.col-money { text-align: right; }
          .totals-row {
            display: flex;
            gap: 14px;
            margin-bottom: 18px;
          }
          .deposit-box,
          .total-box {
            flex: 1;
            border: 1px solid ${BORDER};
            border-radius: 14px;
            padding: 16px 18px;
          }
          .deposit-box {
            text-align: center;
          }
          .deposit-label {
            font-size: 11px;
            font-weight: 700;
            color: ${ACCENT};
            letter-spacing: 0.05em;
            margin: 8px 0 4px;
          }
          .deposit-pct {
            font-size: 30px;
            font-weight: 800;
            color: ${NAVY};
            margin: 0 0 8px;
            line-height: 1;
          }
          .deposit-amount {
            display: inline-block;
            background: ${ACCENT_SOFT};
            color: ${NAVY};
            font-size: 15px;
            font-weight: 800;
            padding: 6px 16px;
            border-radius: 999px;
          }
          .total-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .total-label {
            font-size: 26px;
            font-weight: 800;
            color: ${NAVY};
          }
          .total-amount {
            font-size: 26px;
            font-weight: 800;
            color: ${NAVY};
          }
          .footer-card {
            display: flex;
            border: 1px solid ${BORDER};
            border-radius: 14px;
            overflow: hidden;
            margin-bottom: 22px;
          }
          .footer-col {
            flex: 1;
            padding: 16px 18px;
            display: flex;
            gap: 12px;
            align-items: flex-start;
          }
          .footer-col + .footer-col {
            border-left: 1px solid ${BORDER};
          }
          .footer-title {
            font-size: 12px;
            font-weight: 800;
            color: ${ACCENT};
            letter-spacing: 0.04em;
            margin: 0 0 6px 0;
          }
          .footer-text {
            margin: 0;
            color: ${MUTED};
            font-size: 12px;
            line-height: 1.5;
          }
          .footer-text strong {
            color: ${ACCENT};
            font-weight: 800;
          }
          .notes-card {
            border: 1px solid ${BORDER};
            border-radius: 14px;
            padding: 14px 18px;
            margin-bottom: 18px;
          }
          .brand-divider {
            height: 2px;
            background: ${ACCENT};
            border: none;
            margin: 0 0 12px 0;
          }
          .brand {
            text-align: center;
            font-size: 12px;
            color: ${MUTED};
          }
          .brand strong {
            color: ${ACCENT};
            font-weight: 800;
          }
        </style>
      </head>
      <body>
        <header class="header">
          <h1 class="service-title">${serviceLabel}</h1>
          <div class="doc-title-wrap">
            <h2 class="doc-title">PRESUPUESTO</h2>
            <span class="quote-badge">N° ${quoteNumber}</span>
          </div>
        </header>

        <hr class="divider" />

        <section class="info-card">
          <div class="info-col">
            <div class="client-row">
              ${iconCircle(PATHS.user)}
              <div>
                <div class="label-small">Cliente</div>
                <p class="client-name">${customerName}</p>
                <div class="contact-line">
                  ${svgIcon(PATHS.phone, 14)}
                  <span>Teléfono: ${phone}</span>
                </div>
                <div class="contact-line">
                  ${svgIcon(PATHS.mail, 14)}
                  <span>E-mail: -</span>
                </div>
              </div>
            </div>
          </div>
          <div class="info-col">
            <div class="date-block">
              ${iconCircle(PATHS.calendar)}
              <span class="date-text">Fecha: ${dateLabel}</span>
            </div>
          </div>
        </section>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th class="col-concept">Concepto</th>
                <th class="col-qty">Cant.</th>
                <th class="col-money">Precio unit.</th>
                <th class="col-money">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
          </table>
        </div>

        <section class="totals-row">
          <div class="deposit-box">
            ${iconCircle(PATHS.wallet)}
            <div class="deposit-label">Seña sugerida</div>
            <p class="deposit-pct">${depositPct}%</p>
            <span class="deposit-amount">${formatPdfMoney(totals.depositAmount)}</span>
          </div>
          <div class="total-box">
            <span class="total-label">TOTAL</span>
            <span class="total-amount">${formatPdfMoney(totals.total)}</span>
          </div>
        </section>

        <section class="footer-card">
          <div class="footer-col">
            ${iconCircle(PATHS.info)}
            <div>
              <p class="footer-title">FORMA DE PAGO</p>
              <p class="footer-text">${paymentTerms}</p>
            </div>
          </div>
          <div class="footer-col">
            ${iconCircle(PATHS.calendar)}
            <div>
              <p class="footer-title">VALIDEZ</p>
              <p class="footer-text">
                Este presupuesto tiene validez por
                <strong>${validityDays} días</strong>.
              </p>
            </div>
          </div>
        </section>

        ${notesBlock}

        <hr class="brand-divider" />
        <p class="brand">Generado por <strong>CotizAR</strong></p>
      </body>
    </html>
  `;
}

export function buildWhatsappQuoteText(
  quote: FreeQuote,
  totals: QuoteTotals,
): string {
  const lines = [
    `Presupuesto - ${quote.customerName}`,
    quote.customerPhone ? `Teléfono: ${quote.customerPhone}` : null,
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
    `Validez: ${quote.validityDays} días`,
    quote.notes ? `Notas: ${quote.notes}` : null,
  ].filter(Boolean) as string[];

  return lines.join("\n");
}
