// src/app/core/services/revenuecat.service.ts
import { Injectable, signal, computed } from '@angular/core';
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

@Injectable({
  providedIn: 'root'
})
export class RevenueCatService {
  private initialized = false;
  private customerInfo = signal<CustomerInfo | null>(null);
  private offerings = signal<PurchasesOfferings | null>(null);

  readonly isPro = computed(() => {
    const info = this.customerInfo();
    if (!info) return false;
    const entitlementId = environment.revenuecat?.entitlementId || DEFAULT_ENTITLEMENT_ID;
    return Boolean(info.entitlements.active[entitlementId]);
  });

  readonly currentOffering = computed<PurchasesOffering | null>(() => this.offerings()?.current ?? null);

  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    if (!this.isNativePlatform()) {
      return;
    }

    const apiKey = this.getApiKey();
    if (!apiKey) {
      console.warn('[RevenueCat] Missing API key. Configure environment.revenuecat to enable purchases.');
      return;
    }

    await Purchases.configure({ apiKey });
    await this.refreshCustomerInfo();
    await this.refreshOfferings();

    await Purchases.addCustomerInfoUpdateListener(info => {
      this.customerInfo.set(info);
    });
  }

  async refreshCustomerInfo(): Promise<CustomerInfo | null> {
    if (!this.isNativePlatform()) return null;
    const { customerInfo } = await Purchases.getCustomerInfo();
    this.customerInfo.set(customerInfo);
    return customerInfo;
  }

  async refreshOfferings(): Promise<PurchasesOfferings | null> {
    if (!this.isNativePlatform()) return null;
    const offerings = await Purchases.getOfferings();
    this.offerings.set(offerings);
    return offerings;
  }

  async purchasePro(): Promise<void> {
    await this.ensureInitialized();
    const offering = await this.getOrFetchCurrentOffering();
    if (!offering || offering.availablePackages.length === 0) {
      throw new Error('No available packages');
    }

    const aPackage = offering.availablePackages[0];
    const result = await Purchases.purchasePackage({ aPackage });
    this.customerInfo.set(result.customerInfo);
  }

  async restorePurchases(): Promise<void> {
    await this.ensureInitialized();
    const result = await Purchases.restorePurchases();
    this.customerInfo.set(result.customerInfo);
  }

  async getPrimaryPriceString(): Promise<string | null> {
    const offering = await this.getOrFetchCurrentOffering();
    const aPackage = offering?.availablePackages?.[0];
    return aPackage?.product?.priceString ?? null;
  }

  private async ensureInitialized(): Promise<void> {
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
