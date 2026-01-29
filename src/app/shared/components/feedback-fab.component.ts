// src/app/shared/components/feedback-fab.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonFab, IonFabButton, IonIcon, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chatbubbleEllipses } from 'ionicons/icons';
import { FeedbackModalComponent } from './feedback.component';

/**
 * Floating Action Button for Feedback
 * Add this to any page where you want a floating feedback button
 */
@Component({
  selector: 'app-feedback-fab',
  template: `
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button (click)="openFeedback()" color="secondary">
        <ion-icon name="chatbubble-ellipses"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  `,
  styles: [`
    ion-fab-button {
      --box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }
  `],
  standalone: true,
  imports: [CommonModule, IonFab, IonFabButton, IonIcon]
})
export class FeedbackFabComponent {
  private modalController = inject(ModalController);

  constructor() {
    addIcons({ chatbubbleEllipses });
  }

  async openFeedback() {
    const modal = await this.modalController.create({
      component: FeedbackModalComponent
    });
    await modal.present();
  }
}
