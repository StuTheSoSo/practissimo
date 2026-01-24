// src/app/pages/quests/quests.page.ts
import { Component, inject } from '@angular/core';
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
  IonBadge,
  IonProgressBar,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trophy, checkmarkCircle } from 'ionicons/icons';
import { QuestService } from '../../core/services/quest.service';

@Component({
  selector: 'app-quests',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Daily Quests</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="quests-container">
        @if (activeQuests().length === 0) {
          <ion-card>
            <ion-card-content>
              <p class="empty-state">No active quests. Start practicing to generate new quests!</p>
            </ion-card-content>
          </ion-card>
        }

        @for (quest of activeQuests(); track quest.id) {
          <ion-card [class.completed]="quest.completed">
            <ion-card-header>
              <div class="quest-header">
                <ion-icon [name]="quest.completed ? 'checkmark-circle' : 'trophy'"
                         [color]="quest.completed ? 'success' : 'primary'"></ion-icon>
                <ion-card-title>{{ quest.title }}</ion-card-title>
              </div>
            </ion-card-header>
            <ion-card-content>
              <p>{{ quest.description }}</p>
              <div class="quest-progress">
                <span>{{ quest.progress }} / {{ quest.target }}</span>
                <ion-badge [color]="quest.completed ? 'success' : 'primary'">
                  {{ quest.completed ? 'Complete!' : '+' + quest.xpReward + ' XP' }}
                </ion-badge>
              </div>
              <ion-progress-bar [value]="quest.progress / quest.target"></ion-progress-bar>
            </ion-card-content>
          </ion-card>
        }
      </div>
    </ion-content>
  `,
  styles: [`
    .quests-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .quest-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .quest-header ion-icon {
      font-size: 1.5rem;
    }

    .quest-progress {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 1rem 0 0.5rem 0;
    }

    ion-card.completed {
      opacity: 0.7;
    }

    .empty-state {
      text-align: center;
      color: var(--ion-color-medium);
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
    IonBadge,
    IonProgressBar,
    IonIcon
  ]
})
export class QuestsPage {
  private questService = inject(QuestService);

  activeQuests = this.questService.currentInstrumentQuests;

  constructor() {
    addIcons({ trophy, checkmarkCircle });
  }
}
