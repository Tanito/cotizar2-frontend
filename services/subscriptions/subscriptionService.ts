import { subscriptionStore } from "@/store/subscriptionStore";

export interface SubscriptionService {
  initialize(): Promise<void>;
  isPremium(): Promise<boolean>;
  restorePurchases(): Promise<void>;
}

/**
 * Fase 1:
 * - La app funciona sin backend ni autenticación.
 * - El entitlement Premium se resuelve localmente.
 * - Google Play Billing queda encapsulado en esta capa.
 *
 * Fase 2:
 * - CloudSubscriptionService para validar suscripciones desde backend.
 * - GoogleAuthService para identidad.
 * - SyncService para reconciliar datos locales y nube.
 */
class GooglePlayBillingSubscriptionService implements SubscriptionService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    subscriptionStore.setLoading(true);

    // Punto de extensión para conectar BillingClient y obtener la compra real.
    subscriptionStore.setPremium(true);
    subscriptionStore.setLoading(false);
  }

  async isPremium(): Promise<boolean> {
    return subscriptionStore.getState().isPremium;
  }

  async restorePurchases(): Promise<void> {
    subscriptionStore.setLoading(true);

    try {
      // Punto de extensión para la restauración oficial de compras de Google Play.
      subscriptionStore.setPremium(true);
    } finally {
      subscriptionStore.setLoading(false);
    }
  }
}

export const subscriptionService: SubscriptionService =
  new GooglePlayBillingSubscriptionService();
