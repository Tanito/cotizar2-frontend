export const QUOTE_CURRENCIES = ["ARS", "USD"] as const;

export type QuoteCurrency = (typeof QUOTE_CURRENCIES)[number];

export type CurrencyAmounts = Record<QuoteCurrency, number>;

export function isQuoteCurrency(value: unknown): value is QuoteCurrency {
  return value === "ARS" || value === "USD";
}

export function getItemCurrency(item: { currency?: unknown }): QuoteCurrency {
  return isQuoteCurrency(item.currency) ? item.currency : "ARS";
}

export function formatMoney(
  amount: number,
  currency: QuoteCurrency,
  fractionDigits = currency === "USD" ? 2 : 0,
): string {
  const formattedAmount = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);

  return `${currency === "USD" ? "u$s" : "$"} ${formattedAmount}`;
}

export function formatCurrencyAmounts(
  amounts: CurrencyAmounts,
  separator = " · ",
): string {
  const activeCurrencies = QUOTE_CURRENCIES.filter(
    (currency) => amounts[currency] !== 0,
  );
  const currencies: readonly QuoteCurrency[] =
    activeCurrencies.length > 0 ? activeCurrencies : ["ARS"];

  return currencies
    .map((currency) => formatMoney(amounts[currency], currency))
    .join(separator);
}

export function getStoredQuoteCurrencyAmounts(quote: {
  total: number;
  currencyTotals?: CurrencyAmounts;
}): CurrencyAmounts {
  return quote.currencyTotals ?? { ARS: quote.total, USD: 0 };
}

export type QuoteTotals = {
  subtotal: number;
  depositAmount: number;
  total: number;
};

export type QuoteTotalsByCurrency = Record<QuoteCurrency, QuoteTotals>;

export function getQuoteTotalsByCurrency(
  items: { quantity: number; unitPrice: number; currency?: QuoteCurrency }[],
  depositPercentage: number,
): QuoteTotalsByCurrency {
  const subtotals: CurrencyAmounts = { ARS: 0, USD: 0 };

  items.forEach((item) => {
    subtotals[getItemCurrency(item)] += item.quantity * item.unitPrice;
  });

  return {
    ARS: {
      subtotal: subtotals.ARS,
      depositAmount: Math.round(
        subtotals.ARS * (depositPercentage / 100),
      ),
      total: subtotals.ARS,
    },
    USD: {
      subtotal: subtotals.USD,
      depositAmount:
        Math.round(subtotals.USD * (depositPercentage / 100) * 100) / 100,
      total: subtotals.USD,
    },
  };
}

export function getTotalAmounts(
  totals: QuoteTotalsByCurrency,
): CurrencyAmounts {
  return {
    ARS: totals.ARS.total,
    USD: totals.USD.total,
  };
}
