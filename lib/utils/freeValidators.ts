export type QuoteMetaForm = {
  customerName: string;
  customerPhone: string;
  serviceType: string;
  validityDays: number;
  depositPercentage: number;
  notes: string;
};

export type QuoteMetaErrors = Partial<Record<keyof QuoteMetaForm, string>>;

export function validateQuoteMeta(values: QuoteMetaForm): QuoteMetaErrors {
  const errors: QuoteMetaErrors = {};

  if (!values.customerName.trim()) {
    errors.customerName = "Ingresa el nombre del cliente";
  }

  if (!values.serviceType.trim()) {
    errors.serviceType = "Ingresa el rubro";
  }

  if (!Number.isFinite(values.validityDays) || values.validityDays < 1) {
    errors.validityDays = "Ingresa una validez valida";
  }

  if (
    !Number.isFinite(values.depositPercentage) ||
    values.depositPercentage < 0 ||
    values.depositPercentage > 100
  ) {
    errors.depositPercentage = "Ingresa un porcentaje entre 0 y 100";
  }

  return errors;
}
