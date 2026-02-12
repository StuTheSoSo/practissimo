// src/app/shared/components/feedback.component.ts
import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonTextarea,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent,
  AlertController,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatbubbleEllipses, close, send } from 'ionicons/icons';

@Component({
  selector: 'app-feedback-button',
  template: `
    <ion-button
      [fill]="fill"
      [expand]="expand"
      [size]="size"
      (click)="openFeedbackModal()"
    >
      <ion-icon name="chatbubble-ellipses" slot="start"></ion-icon>
      {{ buttonText }}
    </ion-button>
  `,
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon]
})
export class FeedbackButtonComponent {
  private modalController = inject(ModalController);

  // Customizable button properties
  fill: 'clear' | 'outline' | 'solid' = 'outline';
  expand?: 'block' | 'full';
  size?: 'small' | 'default' | 'large';
  buttonText = 'Send Feedback';

  constructor() {
    addIcons({ chatbubbleEllipses });
  }

  async openFeedbackModal() {
    const modal = await this.modalController.create({
      component: FeedbackModalComponent
    });
    await modal.present();
  }
}

@Component({
  selector: 'app-feedback-modal',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Send Feedback</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon name="close" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-content>
          <p>We'd love to hear from you! Report bugs, request features, or share your thoughts.</p>
        </ion-card-content>
      </ion-card>

      <ion-item>
        <ion-label position="stacked">Feedback Type *</ion-label>
        <ion-select
          [(ngModel)]="feedbackType"
          placeholder="Select type"
          interface="action-sheet"
        >
          <ion-select-option value="bug">🐛 Bug Report</ion-select-option>
          <ion-select-option value="feature">💡 Feature Request</ion-select-option>
          <ion-select-option value="improvement">✨ Improvement Suggestion</ion-select-option>
          <ion-select-option value="question">❓ Question</ion-select-option>
          <ion-select-option value="other">💬 General Feedback</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Your Feedback *</ion-label>
        <ion-textarea
          [(ngModel)]="feedbackText"
          rows="8"
          placeholder="Describe your feedback in detail..."
          [counter]="true"
          maxlength="1000"
        ></ion-textarea>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Email (Optional)</ion-label>
        <ion-textarea
          [(ngModel)]="email"
          rows="1"
          placeholder="your@email.com (if you'd like a response)"
          type="email"
        ></ion-textarea>
      </ion-item>

      <div class="submit-section">
        <ion-button
          expand="block"
          [disabled]="!canSubmit()"
          (click)="submitFeedback()"
        >
          <ion-icon name="send" slot="start"></ion-icon>
          Submit Feedback
        </ion-button>

        <p class="privacy-note">
          <small>
            Your feedback helps us improve PracticeQuest. We respect your privacy and will only use your email to respond to your feedback.
          </small>
        </p>
      </div>
    </ion-content>
  `,
  styles: [`
    ion-item {
      --padding-start: 0;
      --inner-padding-end: 0;
      margin-bottom: 1rem;
    }

    .submit-section {
      margin-top: 2rem;
    }

    .privacy-note {
      text-align: center;
      color: var(--ion-color-medium);
      margin-top: 1rem;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTextarea
  ]
})
export class FeedbackModalComponent implements OnInit {
  @Input() initialType: 'bug' | 'feature' | 'improvement' | 'question' | 'other' | '' = '';

  private modalController = inject(ModalController);
  private alertController = inject(AlertController);

  feedbackType = '';
  feedbackText = '';
  email = '';

  constructor() {
    addIcons({ close, send });
  }

  ngOnInit(): void {
    this.feedbackType = this.initialType || '';
  }

  canSubmit(): boolean {
    return this.feedbackType.length > 0 && this.feedbackText.trim().length > 10;
  }

  async submitFeedback() {
    const feedback = {
      type: this.feedbackType,
      message: this.feedbackText,
      email: this.email,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      appVersion: '1.0.0'
    };

    // Option 1: Use a mailto link (simplest, no backend needed)
    this.sendViaEmail(feedback);

    // Option 2: Send to a backend API (uncomment if you have a backend)
    // await this.sendToBackend(feedback);

    // Option 3: Use a third-party service like Google Forms (see method below)
    // await this.sendToGoogleForm(feedback);
  }

  private async sendViaEmail(feedback: any) {
    const subject = encodeURIComponent(`[PracticeQuest Feedback] ${feedback.type}`);
    const body = encodeURIComponent(`
Feedback Type: ${feedback.type}
Email: ${feedback.email || 'Not provided'}

Message:
${feedback.message}

---
Timestamp: ${feedback.timestamp}
User Agent: ${feedback.userAgent}
App Version: ${feedback.appVersion}
    `);

    // Replace with your email
    const mailtoLink = `mailto:stu.schwartz@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;

    await this.showSuccessMessage();
    this.dismiss();
  }

  // Alternative: Send to a backend API
  private async sendToBackend(feedback: any) {
    try {
      const response = await fetch('https://your-api.com/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback)
      });

      if (response.ok) {
        await this.showSuccessMessage();
        this.dismiss();
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      await this.showErrorMessage();
    }
  }

  // Alternative: Send to Google Forms
  private async sendToGoogleForm(feedback: any) {
    // You'll need to create a Google Form and get the entry IDs
    // See instructions below in comments
    try {
      const formUrl = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';

      const formData = new FormData();
      formData.append('entry.TYPE_FIELD_ID', feedback.type);
      formData.append('entry.MESSAGE_FIELD_ID', feedback.message);
      formData.append('entry.EMAIL_FIELD_ID', feedback.email);

      await fetch(formUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Required for Google Forms
      });

      await this.showSuccessMessage();
      this.dismiss();
    } catch (error) {
      await this.showErrorMessage();
    }
  }

  private async showSuccessMessage() {
    const alert = await this.alertController.create({
      header: 'Thank You!',
      message: 'Your feedback has been submitted. We appreciate you helping us improve PracticeQuest!',
      buttons: ['Awesome!']
    });
    await alert.present();
  }

  private async showErrorMessage() {
    const alert = await this.alertController.create({
      header: 'Oops!',
      message: 'There was a problem submitting your feedback. Please try again or email us directly at feedback@practissimo.app',
      buttons: ['OK']
    });
    await alert.present();
  }

  dismiss() {
    this.modalController.dismiss();
  }
}

/**
 * GOOGLE FORMS SETUP INSTRUCTIONS:
 *
 * 1. Create a Google Form with these fields:
 *    - Feedback Type (Multiple choice or Dropdown)
 *    - Message (Paragraph)
 *    - Email (Short answer)
 *
 * 2. Get the form's pre-filled link:
 *    - Click the three dots menu → "Get pre-filled link"
 *    - Fill in dummy data for each field
 *    - Click "Get link"
 *
 * 3. From the pre-filled URL, extract the entry IDs:
 *    Example URL: https://docs.google.com/forms/d/e/ABC123/viewform?
 *    entry.123456=BugReport&entry.789012=TestMessage&entry.345678=test@email.com
 *
 *    Your entry IDs are: 123456, 789012, 345678
 *
 * 4. Replace the form URL and entry IDs in sendToGoogleForm() method
 *
 * 5. View responses in the linked Google Sheet
 */
