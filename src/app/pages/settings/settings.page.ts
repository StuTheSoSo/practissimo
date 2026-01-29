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
            <p>Practissimo v1.0.0</p>
            <p>A gamified practice tracker for musicians</p>
            <br>
            <p class="made-with-love">
              <ion-icon name="heart" color="danger"></ion-icon>
              Made with love for musicians
            </p>
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

  currentInstrument = this.instrumentService.currentDisplayName;
  allInstruments = this.instrumentService.allInstruments;

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
}
