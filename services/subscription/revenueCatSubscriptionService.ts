import Purchases, {
  PACKAGE_TYPE,
  PURCHASES_ERROR_CODE,
  type CustomerInfo,
  type PurchasesPackage,
  type PurchasesOffering,
} from "react-native-purchases";

import { REVENUECAT_CONFIG, getRevenueCatApiKey } from "./subscriptionConfig";
import type {
  SubscriptionActionResult,
  SubscriptionSnapshot,
} from "./subscription.types";
import type { SubscriptionService } from "./subscriptionService";

function isPremiumActive(customerInfo: CustomerInfo): boolean {
  return Boolean(
    customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlementId],
  );
}

function snapshotFromCustomerInfo(
  customerInfo: CustomerInfo,
  error: string | null = null,
): SubscriptionSnapshot {
  return {
    isPremium: isPremiumActive(customerInfo),
    isLoading: false,
    initialized: true,
    error,
  };
}

function buildPurchaseSuccessMessage(isPremium: boolean): string {
  return isPremium
    ? "Tu suscripción Premium está activa."
    : "No se encontraron compras activas.";
}

function buildRestoreSuccessMessage(isPremium: boolean): string {
  return isPremium
    ? "Compra restaurada correctamente.\nTu suscripción Premium está activa."
    : "No se encontraron compras activas.";
}

function normalizeErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "No fue posible restaurar las compras.\nIntentá nuevamente más tarde.";
}

function getOfferingPackage(offering: PurchasesOffering): PurchasesPackage | null {
  return (
    offering.monthly ??
    offering.availablePackages.find(
      (pkg) => pkg.packageType === PACKAGE_TYPE.MONTHLY,
    ) ??
    offering.availablePackages.find(
      (pkg) => pkg.product.identifier === REVENUECAT_CONFIG.productId,
    ) ??
    offering.availablePackages[0] ??
    null
  );
}

function isCancellationError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const typedError = error as {
    code?: string;
    userCancelled?: boolean | null;
  };

  return (
    typedError.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR ||
    typedError.userCancelled === true
  );
}

class RevenueCatSubscriptionService implements SubscriptionService {
  private initialized = false;

  private async ensureConfigured(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const apiKey = getRevenueCatApiKey();
    if (!apiKey) {
      throw new Error(
        "Falta configurar RevenueCat. Definí EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY y/o EXPO_PUBLIC_REVENUECAT_IOS_API_KEY.",
      );
    }

    Purchases.configure({
      apiKey,
    });

    this.initialized = true;
  }

  async initialize(): Promise<SubscriptionSnapshot> {
    try {
      await this.ensureConfigured();
      return this.refreshSubscription();
    } catch (error) {
      return {
        isPremium: false,
        isLoading: false,
        initialized: true,
        error: normalizeErrorMessage(error),
      };
    }
  }

  async refreshSubscription(): Promise<SubscriptionSnapshot> {
    await this.ensureConfigured();
    const customerInfo = await Purchases.getCustomerInfo();
    return snapshotFromCustomerInfo(customerInfo);
  }

  async purchasePremium(): Promise<SubscriptionActionResult> {
    await this.ensureConfigured();

    try {
      const offerings = await Purchases.getOfferings();
      const offering = offerings.all[REVENUECAT_CONFIG.offeringId];

      if (!offering) {
        throw new Error(
          `No se encontró la offering '${REVENUECAT_CONFIG.offeringId}'.`,
        );
      }

      const packageToBuy = getOfferingPackage(offering);
      if (!packageToBuy) {
        throw new Error(
          `No se encontró un paquete mensual para '${REVENUECAT_CONFIG.offeringId}'.`,
        );
      }

      const { customerInfo } = await Purchases.purchasePackage(packageToBuy);
      const isPremium = isPremiumActive(customerInfo);

      return {
        isPremium,
        message: buildPurchaseSuccessMessage(isPremium),
      };
    } catch (error) {
      if (isCancellationError(error)) {
        return {
          isPremium: false,
          message: "",
        };
      }

      throw error;
    }
  }

  async restorePurchases(): Promise<SubscriptionActionResult> {
    await this.ensureConfigured();

    try {
      const customerInfo = await Purchases.restorePurchases();
      const isPremium = isPremiumActive(customerInfo);

      return {
        isPremium,
        message: buildRestoreSuccessMessage(isPremium),
      };
    } catch {
      throw new Error(
        "No fue posible restaurar las compras.\nIntentá nuevamente más tarde.",
      );
    }
  }
}

export const revenueCatSubscriptionService =
  new RevenueCatSubscriptionService();
