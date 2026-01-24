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
  AlertController
} from '@ionic/angular/standalone';
import { InstrumentService } from '../../core/services/instrument.service';
import { Instrument } from '../../core/models/instrument.model';

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

        <ion-card>
          <ion-card-header>
            <ion-card-title>About</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>Practissimo v1.0.0</p>
            <p>A gamified practice tracker for musicians</p>
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
    IonButton
  ]
})
export class SettingsPage {
  private router = inject(Router);
  private alertController = inject(AlertController);
  private instrumentService = inject(InstrumentService);

  currentInstrument = this.instrumentService.currentDisplayName;
  allInstruments = this.instrumentService.allInstruments;

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
}
