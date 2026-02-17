// src/app/shared/components/paywall-modal.component.ts
import { Component, Input, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonToolbar,
  ModalController,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, sparkles, checkmarkCircle } from 'ionicons/icons';
import { RevenueCatService } from '../../core/services/revenuecat.service';
import { LegalLinksService } from '../../core/services/legal-links.service';

@Component({
  selector: 'app-paywall-modal',
  template: `
    <ion-header>
      <ion-toolbar class="paywall-toolbar">
        <ion-button fill="clear" slot="end" (click)="dismiss()">
          <ion-icon name="close"></ion-icon>
        </ion-button>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="paywall-shell">
        <div class="paywall-hero">
          <div class="hero-kicker">PracticeQuest Pro</div>
          <h1>Unlock Your Full Practice Power</h1>
          <p>{{ reason || 'Get the full chord library, save favorites, and unlock advanced filters.' }}</p>
          <p class="hero-price">From $0.99/month or $9.99/year.</p>
        </div>

        <ion-card class="paywall-card">
          <ion-card-content>
            <div class="feature-list">
              <div class="feature">
                <ion-icon name="checkmark-circle"></ion-icon>
                Intermediate + advanced chord library
              </div>
              <div class="feature">
                <ion-icon name="checkmark-circle"></ion-icon>
                Save chords and quick access
              </div>
              <div class="feature">
                <ion-icon name="checkmark-circle"></ion-icon>
                Full difficulty filters
              </div>
              <div class="feature">
                <ion-icon name="checkmark-circle"></ion-icon>
                New features at least monthly
              </div>
            </div>

            @if (packages().length > 0) {
              <ion-list class="plan-list">
                @for (pkg of packages(); track pkg.identifier) {
                  <ion-item
                    button
                    class="plan-item"
                    [class.selected]="selectedPackageId() === pkg.identifier"
                    (click)="selectPackage(pkg.identifier)"
                  >
                    <ion-label>
                      <h3>{{ packageTitle(pkg) }}</h3>
                      <p>{{ packageSubtitle(pkg) }}</p>
                    </ion-label>
                    <div class="plan-price">{{ pkg.product.priceString }}</div>
                  </ion-item>
                }
              </ion-list>
            }

            @if (selectedPackage(); as selected) {
              <div class="subscription-disclosure">
                <h3>Auto-Renewing Subscription Details</h3>
                <p><strong>Title:</strong> {{ subscriptionTitle(selected) }}</p>
                <p><strong>Length:</strong> {{ subscriptionLength(selected) }}</p>
                <p><strong>Price:</strong> {{ selected.product.priceString }}</p>
                @if (pricePerUnit(selected); as unitPrice) {
                  <p><strong>Price per unit:</strong> {{ unitPrice }}</p>
                }
                <p class="renew-note">
                  Subscription renews automatically unless canceled at least 24 hours before the end of the current
                  period.
                </p>
                <div class="legal-links">
                  <ion-button fill="clear" size="small" (click)="openPrivacyPolicy()">
                    Privacy Policy
                  </ion-button>
                  <ion-button fill="clear" size="small" (click)="openTermsOfUse()">
                    Terms of Use (EULA)
                  </ion-button>
                </div>
              </div>
            }

            <div class="paywall-actions">
              <ion-button expand="block" class="paywall-cta" (click)="purchaseSelected()" [disabled]="isPro()">
                <ion-icon name="sparkles" slot="start"></ion-icon>
                Upgrade to Pro
              </ion-button>
              @if (isPro() && managementUrl()) {
                <ion-button expand="block" fill="outline" (click)="manageSubscription()">
                  Manage Subscription
                </ion-button>
              }
              <ion-button expand="block" fill="clear" (click)="restorePurchases()">
                Restore Purchases
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    :host {
      --background: #0b1524;
    }

    ion-content {
      --background: #0b1524;
    }

    .paywall-toolbar {
      --background: transparent;
    }

    .paywall-shell {
      max-width: 560px;
      margin: 0 auto;
    }

    .paywall-hero {
      text-align: center;
      margin: 1rem 0 1.5rem 0;
    }

    .hero-kicker {
      font-size: 0.75rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 600;
      margin-bottom: 0.4rem;
    }

    .paywall-hero h1 {
      margin: 0 0 0.5rem 0;
      font-size: 1.8rem;
      color: #ffffff;
    }

    .paywall-hero p {
      margin: 0.4rem 0;
      color: rgba(255, 255, 255, 0.8);
    }

    .hero-price {
      font-weight: 700;
      color: #ffffff;
    }

    .paywall-card {
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background:
        radial-gradient(1200px 300px at -10% -20%, rgba(255, 199, 0, 0.35), transparent 60%),
        radial-gradient(1000px 400px at 110% -10%, rgba(0, 209, 255, 0.25), transparent 55%),
        linear-gradient(135deg, #0d1b2a, #152238);
      color: #f8f9ff;
      box-shadow: 0 24px 40px rgba(13, 27, 42, 0.35);
    }

    .paywall-card::after {
      content: '';
      position: absolute;
      top: 0;
      left: -50%;
      width: 200%;
      height: 100%;
      background: linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.18) 50%, transparent 70%);
      transform: translateX(-60%);
      animation: paywall-shimmer 6s ease-in-out infinite;
      pointer-events: none;
    }

    .feature-list {
      display: grid;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .feature {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 600;
    }

    .feature ion-icon {
      color: #ffd166;
    }

    .plan-list {
      background: transparent;
      margin-bottom: 1rem;
    }

    .plan-item {
      --background: rgba(15, 23, 42, 0.6);
      --border-color: rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      margin-bottom: 0.5rem;
    }

    .plan-item.selected {
      --border-color: rgba(255, 209, 102, 0.8);
      box-shadow: 0 10px 20px rgba(255, 209, 102, 0.15);
    }

    .plan-price {
      font-weight: 700;
      color: #ffffff;
      margin-left: 1rem;
    }

    .paywall-actions {
      display: grid;
      gap: 0.75rem;
    }

    .subscription-disclosure {
      margin: 1rem 0 1.25rem;
      padding: 0.85rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      background: rgba(8, 14, 24, 0.55);
    }

    .subscription-disclosure h3 {
      margin: 0 0 0.5rem;
      font-size: 1rem;
      color: #ffffff;
    }

    .subscription-disclosure p {
      margin: 0.35rem 0;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.92);
    }

    .renew-note {
      margin-top: 0.5rem;
      color: rgba(255, 255, 255, 0.75);
    }

    .legal-links {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-top: 0.45rem;
    }

    .legal-links ion-button {
      --color: #ffd166;
      margin: 0;
    }

    .paywall-cta {
      --background: linear-gradient(135deg, #ffd166, #ff8fab);
      --color: #1b1b1b;
      --border-radius: 12px;
      --box-shadow: 0 12px 24px rgba(255, 142, 112, 0.35);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    @keyframes paywall-shimmer {
      0% {
        transform: translateX(-60%);
      }
      50% {
        transform: translateX(0%);
      }
      100% {
        transform: translateX(60%);
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonContent,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel
  ]
})
export class PaywallModalComponent {
  @Input() reason = '';

  private modalController = inject(ModalController);
  private alertController = inject(AlertController);
  private revenueCat = inject(RevenueCatService);
  private legalLinksService = inject(LegalLinksService);

  isPro = this.revenueCat.isPro;
  packages = this.revenueCat.availablePackages;
  managementUrl = this.revenueCat.managementUrl;

  selectedPackageId = signal<string | null>(null);
  selectedPackage = computed(() =>
    this.packages().find(pkg => pkg.identifier === this.selectedPackageId()) ?? this.packages()[0] ?? null
  );

  constructor() {
    addIcons({ close, sparkles, checkmarkCircle });

    effect(() => {
      const first = this.packages()[0];
      if (first && !this.selectedPackageId()) {
        this.selectedPackageId.set(first.identifier);
      }
    });
  }

  dismiss() {
    void this.modalController.dismiss();
  }

  selectPackage(packageId: string) {
    this.selectedPackageId.set(packageId);
  }

  async purchaseSelected() {
    if (this.isPro()) {
      await this.dismiss();
      return;
    }

    const selected = this.selectedPackageId();
    try {
      if (selected) {
        await this.revenueCat.purchasePackage(selected);
      } else {
        await this.revenueCat.purchasePro();
      }
      await this.dismiss();
      const success = await this.alertController.create({
        header: 'Unlocked!',
        message: 'Thanks for upgrading. Pro features are now enabled.',
        buttons: ['OK']
      });
      await success.present();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Purchase failed. Please try again.';
      const failure = await this.alertController.create({
        header: 'Purchase Failed',
        message,
        buttons: ['OK']
      });
      await failure.present();
    }
  }

  async restorePurchases() {
    try {
      await this.revenueCat.restorePurchases();
      const alert = await this.alertController.create({
        header: 'Restored',
        message: 'Your purchases have been restored.',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Restore failed. Please try again.';
      const failure = await this.alertController.create({
        header: 'Restore Failed',
        message,
        buttons: ['OK']
      });
      await failure.present();
    }
  }

  manageSubscription() {
    const url = this.managementUrl();
    if (url) {
      window.open(url, '_blank');
    }
  }

  packageTitle(pkg: any): string {
    switch (pkg.packageType) {
      case 'LIFETIME':
        return 'Lifetime';
      case 'ANNUAL':
        return 'Annual';
      case 'MONTHLY':
        return 'Monthly';
      case 'SIX_MONTH':
        return '6 Months';
      case 'THREE_MONTH':
        return '3 Months';
      case 'TWO_MONTH':
        return '2 Months';
      case 'WEEKLY':
        return 'Weekly';
      default:
        return pkg.identifier || 'Plan';
    }
  }

  packageSubtitle(pkg: any): string {
    switch (pkg.packageType) {
      case 'LIFETIME':
        return 'Pay once, keep forever';
      case 'ANNUAL':
        return 'Best value for most users';
      case 'MONTHLY':
        return 'Flexible monthly plan';
      default:
        return 'Premium access';
    }
  }

  subscriptionTitle(pkg: any): string {
    return pkg.product?.title || this.packageTitle(pkg);
  }

  subscriptionLength(pkg: any): string {
    const period = pkg.product?.subscriptionPeriod as string | null;
    if (period) {
      const match = /^P(\d+)([DWMY])$/.exec(period);
      if (match) {
        const amount = Number(match[1]);
        const unit = match[2] === 'D'
          ? 'day'
          : match[2] === 'W'
            ? 'week'
            : match[2] === 'M'
              ? 'month'
              : 'year';
        return `${amount} ${unit}${amount === 1 ? '' : 's'}`;
      }
    }

    switch (pkg.packageType) {
      case 'ANNUAL':
        return '1 year';
      case 'SIX_MONTH':
        return '6 months';
      case 'THREE_MONTH':
        return '3 months';
      case 'TWO_MONTH':
        return '2 months';
      case 'MONTHLY':
        return '1 month';
      case 'WEEKLY':
        return '1 week';
      default:
        return 'Not specified';
    }
  }

  pricePerUnit(pkg: any): string | null {
    const product = pkg.product;
    if (!product) return null;

    if (product.subscriptionPeriod !== 'P1M' && product.pricePerMonthString) {
      return `${product.pricePerMonthString} per month (approx.)`;
    }

    if (product.subscriptionPeriod !== 'P1W' && product.pricePerWeekString) {
      return `${product.pricePerWeekString} per week (approx.)`;
    }

    if (product.subscriptionPeriod !== 'P1Y' && product.pricePerYearString) {
      return `${product.pricePerYearString} per year (approx.)`;
    }

    return null;
  }

  async openPrivacyPolicy() {
    await this.modalController.dismiss();
    await this.legalLinksService.openPrivacyPolicy();
  }

  async openTermsOfUse() {
    await this.legalLinksService.openTermsOfUse();
  }
}
