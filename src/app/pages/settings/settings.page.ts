// src/app/pages/settings/settings.page.ts (SIMPLIFIED VERSION)
import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonToggle,
  IonBadge,
  AlertController,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatbubbleEllipses, bug, bulb, heart, notifications, time, documentText, shieldCheckmark, add, trash, pencil, helpCircle } from 'ionicons/icons';
import { InstrumentService } from '../../core/services/instrument.service';
import { Instrument } from '../../core/models/instrument.model';
import { FeedbackModalComponent } from '../../shared/components/feedback.component';
import { RevenueCatService } from '../../core/services/revenuecat.service';
import { PaywallModalComponent } from '../../shared/components/paywall-modal.component';
import { WeeklyTargetService } from '../../core/services/weekly-target.service';
import { NotificationService } from '../../core/services/notification.service';
import { LegalLinksService } from '../../core/services/legal-links.service';

@Component({
  selector: 'app-settings',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="settings-container">
        <ion-card class="hero-card instrument-card">
          <ion-card-header>
            <ion-card-title>Current Instrument</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item>
                <ion-label>
                  <h2>{{ currentInstrument() }}</h2>
                  <p>Your practice sessions will be tracked for this instrument</p>
                </ion-label>
              </ion-item>
            </ion-list>
            <ion-button expand="block" (click)="changeInstrument()">
              Change Instrument
            </ion-button>
          </ion-card-content>
        </ion-card>

        <ion-card class="hero-card target-card">
          <ion-card-header>
            <ion-card-title>
              Practice Categories
              @if (!isPro() && customCategories().length >= 3) {
                <span style="margin-left: 0.5rem; font-size: 0.7rem; color: var(--ion-color-warning); font-weight: 700;">LIMIT</span>
              }
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>
              Customize your practice categories for {{ currentInstrument() }}
              @if (!isPro()) {
                <span style="color: var(--ion-color-medium); font-size: 0.9rem;"> ({{ customCategories().length }}/3 used)</span>
              }
            </p>
            <ion-list>
              @for (category of customCategories(); track category) {
                <ion-item>
                  <ion-label>{{ category }}</ion-label>
                  <ion-button slot="end" fill="clear" size="small" (click)="editCategory(category)">
                    <ion-icon name="pencil" color="primary"></ion-icon>
                  </ion-button>
                  <ion-button slot="end" fill="clear" size="small" (click)="removeCategory(category)">
                    <ion-icon name="trash" color="danger"></ion-icon>
                  </ion-button>
                </ion-item>
              }
            </ion-list>
            <ion-button expand="block" fill="outline" (click)="addCategory()">
              <ion-icon name="add" slot="start"></ion-icon>
              Add Custom Category
            </ion-button>
          </ion-card-content>
        </ion-card>

        <ion-card class="hero-card target-card">
          <ion-card-header>
            <ion-card-title>Weekly Target</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>Current target: <strong>{{ weeklyTargetMinutes() }} minutes/week</strong></p>
            <ion-button expand="block" fill="outline" (click)="setWeeklyTarget()">
              Set Weekly Target
            </ion-button>
          </ion-card-content>
        </ion-card>

        <ion-card class="hero-card reminder-card">
          <ion-card-header>
            <ion-card-title>Practice Reminders</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item lines="none">
              <ion-icon name="notifications" slot="start"></ion-icon>
              <ion-label>Enable Daily Reminder</ion-label>
              <ion-toggle
                slot="end"
                [checked]="remindersEnabled()"
                (ionChange)="onReminderToggle($event)"
              ></ion-toggle>
            </ion-item>

            <ion-item lines="none">
              <ion-icon name="time" slot="start"></ion-icon>
              <ion-label>
                <h3>Reminder Time</h3>
                <p>{{ reminderTimeLabel() }}</p>
              </ion-label>
              <ion-button
                slot="end"
                fill="outline"
                size="small"
                (click)="setReminderTime()"
              >
                Change
              </ion-button>
            </ion-item>
          </ion-card-content>
        </ion-card>


        <!-- Feedback Section -->
        <ion-card class="hero-card feedback-card">
          <ion-card-header>
            <ion-card-title>Help Us Improve</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>Your feedback is invaluable! Report bugs, request features, or share your thoughts.</p>

            <!-- Direct feedback button instead of component -->
            <ion-button
              expand="block"
              fill="solid"
              (click)="openFeedback()"
            >
              <ion-icon name="chatbubble-ellipses" slot="start"></ion-icon>
              Send Feedback
            </ion-button>

            <!-- Quick Links -->
            <div class="feedback-links">
              <ion-button fill="outline" size="small" (click)="openFeedbackWithType('bug')">
                <ion-icon name="bug" slot="start"></ion-icon>
                Report Bug
              </ion-button>
              <ion-button fill="outline" size="small" (click)="openFeedbackWithType('feature')">
                <ion-icon name="bulb" slot="start"></ion-icon>
                Request Feature
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>

        <ion-card class="hero-card about-card">
          <ion-card-header>
            <ion-card-title>About</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>PracticeQuest v1.4.0</p>
            <p>A gamified practice tracker for musicians</p>
            <p>The only magic I've ever found is "The more you practice, the better you get."</p>
            <ion-list>
              <ion-item button detail="true" (click)="openHelp()">
                <ion-icon name="help-circle" slot="start"></ion-icon>
                <ion-label>Help & FAQ</ion-label>
              </ion-item>
              <ion-item button detail="true" (click)="openTermsOfUse()">
                <ion-icon name="document-text" slot="start"></ion-icon>
                <ion-label>Terms of Use (EULA)</ion-label>
              </ion-item>
              <ion-item button detail="true" (click)="openPrivacyPolicy()">
                <ion-icon name="shield-checkmark" slot="start"></ion-icon>
                <ion-label>Privacy Policy</ion-label>
              </ion-item>
            </ion-list>
            <br>
            <p class="made-with-love">
              <ion-icon name="heart" color="danger"></ion-icon>
              Made with love for musicians by musicians
            </p>
          </ion-card-content>
        </ion-card>

        <ion-card class="pro-card">
          <ion-card-header>
            <ion-card-title>
              <span class="pro-kicker">PracticeQuest Pro</span>
              @if (isPro()) {
                <span class="pro-title">Pro Is Active</span>
              } @else {
                <span class="pro-title">Unlock Your Full Practice Power</span>
              }
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="pro-badge-row">
              <span class="pro-badge">PRO</span>
              <span class="pro-subtitle">Premium tools for focused musicians</span>
            </div>

            @if (isPro()) {
              <div class="pro-state">
                <strong>You're all set.</strong>
                <p>Thanks for supporting PracticeQuest. Your Pro features are active.</p>
              </div>
            } @else {
              <div class="pro-state">
                <p>Get the full chord library, save favorites, and unlock advanced filters.</p>
                <p class="pro-price">From $0.99/month or $9.99/year.</p>
                <ul class="pro-features">
                  <li>Intermediate + advanced chords</li>
                  <li>Saved chords and quick access</li>
                  <li>Full difficulty filters</li>
                  <li>Unlimited custom categories</li>
                  <li>New features at least monthly</li>
                </ul>
              </div>
            }

            <div class="pro-actions">
              @if (!isPro()) {
                <ion-button expand="block" class="pro-cta" (click)="upgradeToPro()">
                  Upgrade to Pro
                </ion-button>
              }
              @if (isPro() && managementUrl()) {
                <ion-button expand="block" fill="outline" class="pro-restore" (click)="manageSubscription()">
                  Manage Subscription
                </ion-button>
              }
              <ion-button expand="block" fill="outline" class="pro-restore" (click)="restorePurchases()">
                Restore Purchases
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .settings-container {
      max-width: 600px;
      margin: 0 auto;
      padding-bottom: 2rem;
    }

    .hero-card {
      position: relative;
      overflow: hidden;
      border: 1px solid var(--app-card-border);
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      margin-bottom: 1rem;
      background: var(--ion-card-background);
    }

    .hero-card ion-card-header {
      padding: 1.25rem 1rem 0.75rem;
    }

    .hero-card ion-card-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--ion-text-color);
    }

    .hero-card ion-card-content {
      padding: 0 1rem 1.25rem;
    }

    .hero-card p {
      margin: 0 0 1rem;
      color: var(--ion-color-medium);
      font-size: 0.9rem;
      line-height: 1.5;
    }

    ion-list {
      padding: 0;
      margin: 0 0 1rem;
      background: transparent;
    }

    ion-item {
      --background: transparent;
      --padding-start: 0;
      --inner-padding-end: 0;
      --border-color: var(--ion-color-light-shade);
      margin-bottom: 0.5rem;
    }

    ion-item:last-child {
      --border-width: 0;
    }

    ion-button {
      --border-radius: 10px;
      font-weight: 600;
      text-transform: none;
      letter-spacing: 0.01em;
    }

    ion-button[expand="block"] {
      margin-top: 0.5rem;
      height: 44px;
    }

    .feedback-links {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .feedback-links ion-button {
      flex: 1;
      margin: 0;
      --padding-start: 0.5rem;
      --padding-end: 0.5rem;
    }

    .made-with-love {
      text-align: center;
      color: var(--ion-color-medium);
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .pro-card {
      position: relative;
      overflow: hidden;
      border-radius: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
      margin-bottom: 1rem;
    }

    .pro-card ion-card-header {
      padding: 1.5rem 1rem 0.75rem;
    }

    .pro-card ion-card-content {
      padding: 0 1rem 1.5rem;
    }

    .pro-kicker {
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      opacity: 0.8;
      font-weight: 600;
      display: block;
      margin-bottom: 0.25rem;
    }

    .pro-title {
      display: block;
      font-size: 1.3rem;
      font-weight: 700;
    }

    .pro-badge-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .pro-badge {
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(10px);
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-weight: 700;
      font-size: 0.7rem;
      letter-spacing: 0.1em;
    }

    .pro-subtitle {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .pro-state p {
      margin: 0.5rem 0;
      opacity: 0.95;
      line-height: 1.5;
    }

    .pro-price {
      font-weight: 700;
      font-size: 1.05rem;
    }

    .pro-features {
      margin: 1rem 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 0.5rem;
    }

    .pro-features li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .pro-features li::before {
      content: '✓';
      font-weight: 700;
      font-size: 1.1rem;
    }

    .pro-actions {
      margin-top: 1.25rem;
      display: grid;
      gap: 0.75rem;
    }

    .pro-cta {
      --background: #fff;
      --color: #667eea;
      font-weight: 700;
      height: 48px;
    }

    .pro-restore {
      --color: #fff;
      --border-color: rgba(255, 255, 255, 0.4);
      height: 44px;
    }

    @media (prefers-color-scheme: dark) {
      .hero-card {
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonToggle
  ]
})
export class SettingsPage {
  private router = inject(Router);
  private alertController = inject(AlertController);
  private modalController = inject(ModalController);
  private instrumentService = inject(InstrumentService);
  private revenueCat = inject(RevenueCatService);
  private weeklyTargetService = inject(WeeklyTargetService);
  private notificationService = inject(NotificationService);
  private legalLinksService = inject(LegalLinksService);

  currentInstrument = this.instrumentService.currentDisplayName;
  allInstruments = this.instrumentService.allInstruments;
  customCategories = computed(() => this.instrumentService.getCustomCategories());
  isPro = this.revenueCat.isPro;
  managementUrl = this.revenueCat.managementUrl;
  weeklyTargetMinutes = this.weeklyTargetService.targetMinutes;
  remindersEnabled = this.notificationService.enabled;
  reminderTimeLabel = this.notificationService.reminderTimeLabel;

  constructor() {
    addIcons({ chatbubbleEllipses, bug, bulb, heart, notifications, time, documentText, shieldCheckmark, add, trash, pencil, helpCircle });
  }

  async changeInstrument() {
    const inputs = this.allInstruments().map(instrument => ({
      type: 'radio' as const,
      label: instrument.displayName,
      value: instrument.id,
      checked: instrument.id === this.instrumentService.currentInstrument()
    }));

    const alert = await this.alertController.create({
      header: 'Change Instrument',
      message: 'Your progress and history will be preserved.',
      inputs,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Change',
          handler: (instrument: Instrument) => {
            this.instrumentService.setInstrument(instrument);
            this.router.navigate(['/home']);
          }
        }
      ]
    });

    await alert.present();
  }

  async openFeedback() {
    const modal = await this.modalController.create({
      component: FeedbackModalComponent
    });
    await modal.present();
  }

  async openFeedbackWithType(type: 'bug' | 'feature') {
    // Open feedback modal - you could pass the type as componentProps if needed
    const modal = await this.modalController.create({
      component: FeedbackModalComponent,
      componentProps: {
        initialType: type
      }
    });
    await modal.present();
  }

  async upgradeToPro() {
    if (this.isPro()) return;
    const modal = await this.modalController.create({
      component: PaywallModalComponent,
      componentProps: {
        reason: 'Unlock the full chord library, favorites, and advanced filters.'
      }
    });
    await modal.present();
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

  openTermsOfUse() {
    void this.legalLinksService.openTermsOfUse();
  }

  openHelp() {
    void this.router.navigate(['/help']);
  }

  openPrivacyPolicy() {
    void this.legalLinksService.openPrivacyPolicy();
  }

  async setWeeklyTarget() {
    const alert = await this.alertController.create({
      header: 'Weekly Target',
      message: 'Set your practice target in minutes per week.',
      inputs: [
        {
          name: 'minutes',
          type: 'number',
          value: this.weeklyTargetMinutes().toString(),
          min: 10
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: (data: { minutes?: string }) => {
            const parsed = Number(data.minutes);
            if (!Number.isFinite(parsed) || parsed < 10) {
              void this.showTargetValidationError();
              return false;
            }

            this.weeklyTargetService.setTargetMinutes(parsed);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  private async showTargetValidationError() {
    const alert = await this.alertController.create({
      header: 'Invalid Target',
      message: 'Please enter at least 10 minutes.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async onReminderToggle(event: { detail?: { checked?: boolean } }) {
    const enabled = !!event.detail?.checked;
    const allowed = await this.notificationService.setEnabled(enabled);

    if (enabled && !allowed) {
      const alert = await this.alertController.create({
        header: 'Notifications Disabled',
        message: 'Notification permission is required for daily reminders.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async setReminderTime() {
    const alert = await this.alertController.create({
      header: 'Reminder Time',
      message: 'Choose the daily reminder time.',
      inputs: [
        {
          name: 'time',
          type: 'time',
          value: this.notificationService.reminderTime()
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: (data: { time?: string }) => {
            if (!data.time) return false;
            void this.notificationService.setReminderTime(data.time);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async addCategory() {
    const customCount = this.customCategories().length;
    const isPro = this.isPro();
    
    if (!isPro && customCount >= 3) {
      const alert = await this.alertController.create({
        header: 'Upgrade to Pro',
        message: 'Free users can create up to 3 custom categories. Upgrade to Pro for unlimited custom categories.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Upgrade',
            handler: () => {
              void this.upgradeToPro();
            }
          }
        ]
      });
      await alert.present();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Add Custom Category',
      message: isPro ? 'Enter a name for your practice category' : `Enter a name for your practice category (${customCount}/3 used)`,
      inputs: [
        {
          name: 'category',
          type: 'text',
          placeholder: 'e.g., Song: Wonderwall'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: (data: { category?: string }) => {
            if (!data.category?.trim()) return false;
            const success = this.instrumentService.addCustomCategory(data.category, isPro);
            if (!success) {
              void this.showCategoryLimitError();
              return false;
            }
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  private async showCategoryLimitError() {
    const alert = await this.alertController.create({
      header: 'Limit Reached',
      message: 'Free users can create up to 3 custom categories. Upgrade to Pro for unlimited.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        },
        {
          text: 'Upgrade to Pro',
          handler: () => {
            void this.upgradeToPro();
          }
        }
      ]
    });
    await alert.present();
  }

  async editCategory(category: string) {
    const alert = await this.alertController.create({
      header: 'Edit Category',
      message: 'Update the category name',
      inputs: [
        {
          name: 'category',
          type: 'text',
          value: category
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: (data: { category?: string }) => {
            if (!data.category?.trim()) return false;
            this.instrumentService.editCustomCategory(category, data.category);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async removeCategory(category: string) {
    const alert = await this.alertController.create({
      header: 'Remove Category',
      message: `Remove "${category}" from your practice categories?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Remove',
          role: 'destructive',
          handler: () => {
            this.instrumentService.removeCustomCategory(category);
          }
        }
      ]
    });

    await alert.present();
  }
}
