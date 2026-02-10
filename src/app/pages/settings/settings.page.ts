// src/app/pages/settings/settings.page.ts (SIMPLIFIED VERSION)
import { Component, inject } from '@angular/core';
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
  AlertController,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatbubbleEllipses, bug, bulb, heart } from 'ionicons/icons';
import { InstrumentService } from '../../core/services/instrument.service';
import { Instrument } from '../../core/models/instrument.model';
import { FeedbackModalComponent } from '../../shared/components/feedback.component';
import { RevenueCatService } from '../../core/services/revenuecat.service';

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
        <ion-card>
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

        <!-- Feedback Section -->
        <ion-card>
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
              <ion-button fill="clear" size="small" (click)="openFeedbackWithType('bug')">
                <ion-icon name="bug" slot="start"></ion-icon>
                Report Bug
              </ion-button>
              <ion-button fill="clear" size="small" (click)="openFeedbackWithType('feature')">
                <ion-icon name="bulb" slot="start"></ion-icon>
                Request Feature
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>About</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>PracticeQuest v1.1.0</p>
            <p>A gamified practice tracker for musicians</p>
            <p>The only magic I've ever found is "The more you practice, the better you get."</p>
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
              <span class="pro-title">Unlock Your Full Practice Power</span>
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
                <ul class="pro-features">
                  <li>Intermediate + advanced chords</li>
                  <li>Saved chords and quick access</li>
                  <li>Full difficulty filters</li>
                </ul>
              </div>
            }

            <div class="pro-actions">
              <ion-button expand="block" class="pro-cta" (click)="upgradeToPro()" [disabled]="isPro()">
                Upgrade to Pro
              </ion-button>
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
    }

    ion-list {
      padding: 0;
      margin-bottom: 1rem;
    }

    .feedback-links {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
      flex-wrap: wrap;
    }

    .feedback-links ion-button {
      flex: 1;
      min-width: 140px;
    }

    .made-with-love {
      text-align: center;
      color: var(--ion-color-medium);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .pro-card {
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

    .pro-card::after {
      content: '';
      position: absolute;
      top: 0;
      left: -50%;
      width: 200%;
      height: 100%;
      background: linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.18) 50%, transparent 70%);
      transform: translateX(-60%);
      animation: pro-shimmer 6s ease-in-out infinite;
      pointer-events: none;
    }

    .pro-kicker {
      font-size: 0.75rem;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.65);
      font-weight: 600;
      display: block;
      margin-bottom: 0.4rem;
    }

    .pro-title {
      display: block;
      font-size: 1.4rem;
      font-weight: 700;
      color: #ffffff;
    }

    .pro-badge-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .pro-badge {
      background: linear-gradient(135deg, #ffb703, #fb8500);
      color: #1b1300;
      padding: 0.35rem 0.7rem;
      border-radius: 999px;
      font-weight: 800;
      letter-spacing: 0.1em;
      font-size: 0.75rem;
    }

    .pro-subtitle {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.95rem;
    }

    .pro-state p {
      margin: 0.35rem 0 0.75rem 0;
      color: rgba(255, 255, 255, 0.85);
    }

    .pro-features {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.85);
    }

    .pro-features li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .pro-features li::before {
      content: '✦';
      color: #ffd166;
      font-size: 0.9rem;
    }

    .pro-actions {
      margin-top: 1rem;
      display: grid;
      gap: 0.75rem;
    }

    .pro-cta {
      --background: linear-gradient(135deg, #ffd166, #ff8fab);
      --color: #1b1b1b;
      --border-radius: 12px;
      --box-shadow: 0 12px 24px rgba(255, 142, 112, 0.35);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .pro-restore {
      --color: #ffffff;
      --border-color: rgba(255, 255, 255, 0.4);
    }

    @keyframes pro-shimmer {
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
    IonIcon
  ]
})
export class SettingsPage {
  private router = inject(Router);
  private alertController = inject(AlertController);
  private modalController = inject(ModalController);
  private instrumentService = inject(InstrumentService);
  private revenueCat = inject(RevenueCatService);

  currentInstrument = this.instrumentService.currentDisplayName;
  allInstruments = this.instrumentService.allInstruments;
  isPro = this.revenueCat.isPro;

  constructor() {
    addIcons({ chatbubbleEllipses, bug, bulb, heart });
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

    const alert = await this.alertController.create({
      header: 'Go Pro',
      message: 'Unlock the full chord library, favorites, and advanced filters.',
      buttons: [
        { text: 'Not now', role: 'cancel' },
        {
          text: 'Upgrade',
          handler: () => {
            void this.purchasePro();
          }
        }
      ]
    });

    await alert.present();
  }

  private async purchasePro() {
    try {
      await this.revenueCat.purchasePro();
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
}
