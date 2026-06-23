export type QuoteFlowOrigin = "free" | "premium";

type FlowState = {
  origin: QuoteFlowOrigin;
};

let state: FlowState = {
  origin: "free",
};

export function setQuoteFlowOrigin(origin: QuoteFlowOrigin) {
  state = { ...state, origin };
}

/** Lee ?from=free|premium al entrar al flujo de presupuesto. */
export function syncQuoteFlowFromParam(from?: string | string[]) {
  const value = Array.isArray(from) ? from[0] : from;
  if (value === "free" || value === "premium") {
    setQuoteFlowOrigin(value);
  }
}

/**
 * Ruta al cancelar o salir del flujo de presupuesto.
 * - Origen explícito (free / premium) tiene prioridad.
 * - Sin origen: premium → home, free → index.
 */
export function getQuoteExitHref(): "/" | "/home" {
  if (state.origin === "premium") return "/home";
  if (state.origin === "free") return "/";
  return "/";
}
