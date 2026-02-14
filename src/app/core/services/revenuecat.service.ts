// src/app/core/services/revenuecat.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import {
  CustomerInfo,
  Purchases,
  PurchasesOffering,
  PurchasesOfferings,
  PurchasesPackage
} from '@revenuecat/purchases-capacitor';
import { environment } from '../../../environments/environment';

const DEFAULT_ENTITLEMENT_ID = 'pro';
const REVENUECAT_BYPASS = false;

@Injectable({
  providedIn: 'root'
})
export class RevenueCatService {
  private initialized = false;
  private initializationError: string | null = null;
  private customerInfo = signal<CustomerInfo | null>(null);
  private offerings = signal<PurchasesOfferings | null>(null);

  readonly isPro = computed(() => {
    if (REVENUECAT_BYPASS) return true;
    const info = this.customerInfo();
    if (!info) return false;
    const entitlementId = environment.revenuecat?.entitlementId || DEFAULT_ENTITLEMENT_ID;
    const hasActiveEntitlement = Boolean(info.entitlements.active[entitlementId]);
    if (hasActiveEntitlement) return true;

    // Fallback: treat active subscriptions as Pro if entitlement mapping is misconfigured.
    const activeSubscriptions = info.activeSubscriptions ?? [];
    if (activeSubscriptions.length === 0) return false;

    const configuredProductIds = Object.values(environment.revenuecat?.productIds ?? {}).filter(Boolean);
    if (configuredProductIds.length > 0) {
      return configuredProductIds.some(productId => activeSubscriptions.includes(productId));
    }

    return true;
  });

  readonly currentOffering = computed<PurchasesOffering | null>(() => this.offerings()?.current ?? null);
  readonly availablePackages = computed<PurchasesPackage[]>(
    () => this.currentOffering()?.availablePackages ?? []
  );
  readonly managementUrl = computed<string | null>(() => this.customerInfo()?.managementURL ?? null);

  async initialize(): Promise<void> {
    if (this.initialized) return;
    if (this.initializationError) {
      throw new Error(this.initializationError);
    }
    if (REVENUECAT_BYPASS) {
      this.initialized = true;
      this.initializationError = null;
      return;
    }

    if (!this.isNativePlatform()) {
      return;
    }

    const apiKey = this.getApiKey();
    if (!apiKey) {
      const platform = Capacitor.getPlatform();
      const message = platform === 'android'
        ? 'Purchases are not configured for Android. Set revenuecat.androidApiKey in src/environments/environment.prod.ts.'
        : 'Purchases are not configured. Missing RevenueCat API key.';
      this.initializationError = message;
      throw new Error(message);
    }

    try {
      await Purchases.configure({ apiKey });
      this.initialized = true;
      this.initializationError = null;

      await this.refreshCustomerInfo();
      await this.refreshOfferings();

      await Purchases.addCustomerInfoUpdateListener(info => {
        this.customerInfo.set(info);
      });

      // Keep entitlement state fresh when returning to the app (e.g. after App Store flows).
      await App.addListener('appStateChange', state => {
        if (!state.isActive) return;
        void this.refreshCustomerInfo();
        void this.refreshOfferings();
      });
    } catch (error) {
      const fallback = 'Unable to initialize purchases. Check RevenueCat API keys and store product setup.';
      const message = error instanceof Error && error.message ? error.message : fallback;
      this.initializationError = message;
      throw new Error(message);
    }
  }

  async refreshCustomerInfo(): Promise<CustomerInfo | null> {
    if (REVENUECAT_BYPASS) return null;
    if (!this.isNativePlatform()) return null;
    const { customerInfo } = await Purchases.getCustomerInfo();
    this.customerInfo.set(customerInfo);
    return customerInfo;
  }

  async refreshOfferings(): Promise<PurchasesOfferings | null> {
    if (REVENUECAT_BYPASS) return null;
    if (!this.isNativePlatform()) return null;
    const offerings = await Purchases.getOfferings();
    this.offerings.set(offerings);
    return offerings;
  }

  async purchasePro(): Promise<void> {
    if (REVENUECAT_BYPASS) return;
    await this.ensureInitialized();
    const offering = await this.getOrFetchCurrentOffering();
    if (!offering || offering.availablePackages.length === 0) {
      throw new Error('No available packages');
    }

    const aPackage = offering.availablePackages[0];
    const result = await Purchases.purchasePackage({ aPackage });
    this.customerInfo.set(result.customerInfo);
  }

  async purchasePackage(packageId: string): Promise<void> {
    if (REVENUECAT_BYPASS) return;
    await this.ensureInitialized();
    const offering = await this.getOrFetchCurrentOffering();
    const aPackage = offering?.availablePackages.find(pkg => pkg.identifier === packageId);
    if (!aPackage) {
      throw new Error('Selected package not available');
    }
    const result = await Purchases.purchasePackage({ aPackage });
    this.customerInfo.set(result.customerInfo);
  }

  async restorePurchases(): Promise<void> {
    if (REVENUECAT_BYPASS) return;
    await this.ensureInitialized();
    const result = await Purchases.restorePurchases();
    this.customerInfo.set(result.customerInfo);
  }

  async getPrimaryPriceString(): Promise<string | null> {
    if (REVENUECAT_BYPASS) return null;
    const offering = await this.getOrFetchCurrentOffering();
    const aPackage = offering?.availablePackages?.[0];
    return aPackage?.product?.priceString ?? null;
  }

  async getAvailablePackages(): Promise<PurchasesPackage[]> {
    if (REVENUECAT_BYPASS) return [];
    await this.ensureInitialized();
    const offering = await this.getOrFetchCurrentOffering();
    return offering?.availablePackages ?? [];
  }

  private async ensureInitialized(): Promise<void> {
    if (REVENUECAT_BYPASS) return;
    if (!this.initialized) {
      await this.initialize();
    }
  }

  private async getOrFetchCurrentOffering(): Promise<PurchasesOffering | null> {
    const cached = this.currentOffering();
    if (cached) return cached;
    const offerings = await this.refreshOfferings();
    return offerings?.current ?? null;
  }

  private isNativePlatform(): boolean {
    return Capacitor.getPlatform() !== 'web';
  }

  private getApiKey(): string | null {
    const config = environment.revenuecat;
    if (!config) return null;

    const platform = Capacitor.getPlatform();
    if (platform === 'ios') return config.iosApiKey || null;
    if (platform === 'android') return config.androidApiKey || null;
    return null;
  }
}
