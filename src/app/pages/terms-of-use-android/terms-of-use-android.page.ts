import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-terms-of-use-android',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/settings"></ion-back-button>
        </ion-buttons>
        <ion-title>Terms of Use</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h2>Google Play Terms of Use</h2>
      <p><strong>Effective date:</strong> February 17, 2026</p>
      <p>
        These Terms of Use apply to the Android version of PracticeQuest distributed through Google Play.
      </p>
      <p>
        By using the app, you agree to use it lawfully and in accordance with these terms. Auto-renewing
        subscriptions, if purchased, are billed through Google Play and managed through your Google account settings.
      </p>
      <p>
        To publish your external Android terms page, set <code>legalLinks.androidTermsUrl</code> in your environment
        configuration. This in-app page is used as fallback when that URL is not set.
      </p>
    </ion-content>
  `,
  standalone: true,
  imports: [
    CommonModule,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar
  ]
})
export class TermsOfUseAndroidPage {}
