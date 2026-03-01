import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, shareSocial } from 'ionicons/icons';
import { Milestone } from '../../core/models/milestone.model';

@Component({
  selector: 'app-milestone-modal',
  template: `
    <ion-content class="milestone-content">
      <button class="close-button" (click)="dismiss()">
        <ion-icon name="close"></ion-icon>
      </button>

      <div class="milestone-celebration">
        <div class="confetti">🎉</div>
        <div class="milestone-icon">{{ milestone.icon }}</div>
        <h1 class="milestone-title">{{ milestone.title }}</h1>
        <p class="milestone-message">{{ milestone.message }}</p>
        
        <div class="milestone-actions">
          <ion-button expand="block" (click)="share()" fill="solid">
            <ion-icon name="share-social" slot="start"></ion-icon>
            Share Achievement
          </ion-button>
          <ion-button expand="block" (click)="dismiss()" fill="outline">
            Continue
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .milestone-content {
      --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .close-button {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
    }

    .close-button ion-icon {
      color: white;
      font-size: 1.5rem;
    }

    .milestone-celebration {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100%;
      padding: 2rem;
      text-align: center;
      position: relative;
    }

    .confetti {
      position: absolute;
      font-size: 3rem;
      animation: confetti 2s ease-in-out infinite;
      opacity: 0.8;
    }

    @keyframes confetti {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-20px) rotate(10deg); }
      75% { transform: translateY(-10px) rotate(-10deg); }
    }

    .milestone-icon {
      font-size: 6rem;
      margin-bottom: 1rem;
      animation: bounce 1s ease-in-out;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    .milestone-title {
      font-size: 2rem;
      font-weight: bold;
      color: white;
      margin: 1rem 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }

    .milestone-message {
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 2rem;
    }

    .milestone-actions {
      width: 100%;
      max-width: 300px;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .milestone-actions ion-button {
      --background: rgba(255, 255, 255, 0.95);
      --color: #667eea;
      --border-radius: 12px;
      font-weight: 700;
    }

    .milestone-actions ion-button[fill="outline"] {
      --background: transparent;
      --color: white;
      --border-color: rgba(255, 255, 255, 0.5);
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonIcon
  ]
})
export class MilestoneModalComponent {
  @Input() milestone!: Milestone;
  @Input() instrument!: string;
  
  private modalController = inject(ModalController);

  constructor() {
    addIcons({ close, shareSocial });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async share() {
    const text = `🎉 ${this.milestone.title}\n\nI've been practicing ${this.instrument} and just hit this milestone! ${this.milestone.message}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        this.copyToClipboard(text);
      }
    } else {
      this.copyToClipboard(text);
    }
  }

  private copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Achievement copied to clipboard!');
    });
  }
}
