
// src/app/pages/history/history.page.ts
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
  IonNote,
  IonBadge
} from '@ionic/angular/standalone';
import { PracticeService } from '../../core/services/practice.service';

@Component({
  selector: 'app-history',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Practice History</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="history-container">
        @if (sessions().length === 0) {
          <ion-card>
            <ion-card-content>
              <p class="empty-state">No practice sessions yet. Start practicing to see your history!</p>
            </ion-card-content>
          </ion-card>
        }

        @for (session of sessions(); track session.id) {
          <ion-card>
            <ion-card-header>
              <div class="session-header">
                <ion-card-title>{{ session.category }}</ion-card-title>
                <ion-badge color="primary">{{ session.duration }} min</ion-badge>
              </div>
            </ion-card-header>
            <ion-card-content>
              <ion-list>
                <ion-item lines="none">
                  <ion-label>
                    <strong>Date</strong>
                    <p>{{ formatDate(session.date) }}</p>
                  </ion-label>
                </ion-item>
                <ion-item lines="none">
                  <ion-label>
                    <strong>XP Earned</strong>
                    <p>{{ session.xpEarned }} XP</p>
                  </ion-label>
                </ion-item>
                @if (session.notes) {
                  <ion-item lines="none">
                    <ion-label>
                      <strong>Notes</strong>
                      <p>{{ session.notes }}</p>
                    </ion-label>
                  </ion-item>
                }
              </ion-list>
            </ion-card-content>
          </ion-card>
        }
      </div>
    </ion-content>
  `,
  styles: [`
    .history-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .session-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .empty-state {
      text-align: center;
      color: var(--ion-color-medium);
    }

    ion-list {
      padding: 0;
    }

    ion-item {
      --padding-start: 0;
      --inner-padding-end: 0;
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
    IonNote,
    IonBadge
  ]
})
export class HistoryPage {
  private practiceService = inject(PracticeService);

  sessions = this.practiceService.currentInstrumentSessions;

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
