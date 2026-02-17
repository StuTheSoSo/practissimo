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
  selector: 'app-privacy-policy',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/settings"></ion-back-button>
        </ion-buttons>
        <ion-title>Privacy Policy</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h2>Privacy Policy</h2>
      <p><strong>Effective date:</strong> February 4, 2026</p>
      <p>
        PracticeQuest ("we," "our," or "us") respects your privacy. This Privacy Policy explains what information
        we collect, how we use it, and your choices when you use the PracticeQuest mobile app.
      </p>

      <h3>Information We Collect</h3>
      <p>
        <strong>On-device data you create:</strong> Practice goals, practice sessions, progress, achievements, and
        app settings are stored locally on your device using on-device storage. This data does not leave your device
        unless you choose to share it.
      </p>
      <p>
        <strong>Microphone access:</strong> The tuner feature uses your device's microphone to detect pitch. Audio is
        processed in real time on your device and is not recorded, stored, or transmitted by us.
      </p>
      <p>
        <strong>Feedback you send us:</strong> If you choose to send feedback, your message (and any email address
        you provide) is sent via your email app to our support address. We receive only what you choose to send.
      </p>

      <h3>Information We Do Not Collect</h3>
      <p>We do not require account creation.</p>
      <p>We do not collect analytics, advertising identifiers, or precise location.</p>
      <p>We do not sell your data.</p>

      <h3>How We Use Information</h3>
      <p>To provide core app features like practice tracking and the tuner.</p>
      <p>To respond to support requests or feedback you send us.</p>

      <h3>Data Sharing</h3>
      <p>
        We do not share your personal information with third parties, except when you choose to email us directly
        using your email provider.
      </p>

      <h3>Data Retention</h3>
      <p>On-device data remains on your device until you delete it or remove the app.</p>
      <p>Feedback emails are retained for as long as needed to address your request.</p>

      <h3>Your Choices</h3>
      <p>You can deny microphone access. The tuner feature will not function without it.</p>
      <p>You can delete your app data by clearing app storage or uninstalling the app.</p>
      <p>You control what you include in any feedback message.</p>

      <h3>Children's Privacy</h3>
      <p>
        PracticeQuest is not directed to children under 13, and we do not knowingly collect personal information from
        children.
      </p>

      <h3>Security</h3>
      <p>
        We use standard practices to protect the limited information we receive (such as support emails). However, no
        method of transmission or storage is 100% secure.
      </p>

      <h3>Changes to This Policy</h3>
      <p>
        We may update this policy from time to time. We will post the updated policy on this page with a new
        effective date.
      </p>

      <h3>Contact Us</h3>
      <p>If you have questions about this policy, contact us at: Stu.Schwartz@gmail.com</p>
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
export class PrivacyPolicyPage {}
