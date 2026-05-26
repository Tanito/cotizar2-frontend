export function formatARS(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export type QuoteTotals = {
  subtotal: number;
  depositAmount: number;
  total: number;
};

export function getQuoteTotals(
  items: { quantity: number; unitPrice: number }[],
  depositPercentage: number,
): QuoteTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const depositAmount = Math.round(subtotal * (depositPercentage / 100));

  return {
    subtotal,
    depositAmount,
    total: subtotal,
  };
}
