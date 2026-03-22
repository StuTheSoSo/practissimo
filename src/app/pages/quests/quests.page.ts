// src/app/pages/quests/quests.page.ts
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonButtons,
  IonBackButton,
  IonProgressBar,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, trophy, ribbonOutline } from 'ionicons/icons';
import { QuestService } from '../../core/services/quest.service';
import { InstrumentService } from '../../core/services/instrument.service';

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
              <div class="fun-empty-state">
                <p class="fun-empty-state-text">{{ emptyQuestsMessage() }}</p>
              </div>
            </ion-card-content>
          </ion-card>
        }

        @for (quest of activeQuests(); track quest.id) {
          <ion-card class="quest-card" [class.quest-card--done]="quest.completed">
            <ion-card-content>
              <div class="quest-body">
                <div class="quest-icon-wrap" [class.quest-icon-wrap--done]="quest.completed">
                  <ion-icon
                    class="quest-icon"
                    [class.quest-icon--burst]="quest.completed"
                    [name]="quest.completed ? 'checkmark-circle' : 'ribbon-outline'"
                  ></ion-icon>
                </div>
                <div class="quest-text">
                  <p class="quest-title">{{ quest.title }}</p>
                  <p class="quest-desc">{{ quest.description }}</p>
                  <div class="quest-progress-row">
                    <span class="quest-tally">{{ quest.progress }} / {{ quest.target }}</span>
                    <span class="quest-xp-badge" [class.quest-xp-badge--done]="quest.completed">
                      {{ quest.completed ? '✓ Complete' : '+' + quest.xpReward + ' XP' }}
                    </span>
                  </div>
                  <ion-progress-bar [value]="quest.progress / quest.target" [color]="quest.completed ? 'success' : 'warning'"></ion-progress-bar>
                </div>
              </div>
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

    /* -- Parchment quest card ------------------------------ */
    .quest-card {
      border-radius: 16px;
      border: 1px solid rgba(212, 168, 80, 0.35);
      background:
        radial-gradient(ellipse at 100% 0%, rgba(255, 237, 178, 0.55) 0%, transparent 55%),
        linear-gradient(160deg, #fdf6e3, #faebd0);
      box-shadow:
        0 4px 14px rgba(161, 121, 52, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.7);
      margin-bottom: 0.9rem;
      transition: opacity 0.35s ease, transform 0.35s ease;
    }

    .quest-card--done {
      opacity: 0.62;
      transform: scale(0.985);
    }

    /* -- Layout -------------------------------------------- */
    .quest-body {
      display: flex;
      gap: 0.85rem;
      align-items: flex-start;
    }

    /* -- Icon medallion ------------------------------------- */
    .quest-icon-wrap {
      flex-shrink: 0;
      width: 2.6rem;
      height: 2.6rem;
      border-radius: 50%;
      background: linear-gradient(135deg, #f6b24a, #ffd57e);
      box-shadow:
        0 0 12px rgba(246, 178, 74, 0.6),
        0 2px 6px rgba(0, 0, 0, 0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .quest-icon-wrap--done {
      background: linear-gradient(135deg, #4ade80, #22c55e);
      box-shadow:
        0 0 12px rgba(74, 222, 128, 0.55),
        0 2px 6px rgba(0, 0, 0, 0.18);
    }

    /* ring-ripple on completed icon wrap */
    .quest-icon-wrap--done::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid rgba(74, 222, 128, 0.7);
      animation: ring-ripple 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }

    @keyframes ring-ripple {
      0%   { transform: scale(0.6); opacity: 1; }
      100% { transform: scale(1.5); opacity: 0; }
    }

    .quest-icon {
      font-size: 1.3rem;
      color: #fff;
    }

    /* checkmark burst on completion */
    .quest-icon--burst {
      animation: checkmark-burst 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }

    @keyframes checkmark-burst {
      0%   { transform: scale(0);   opacity: 0; }
      60%  { transform: scale(1.3); opacity: 1; }
      100% { transform: scale(1);   opacity: 1; }
    }

    /* -- Text content --------------------------------------- */
    .quest-text {
      flex: 1;
      min-width: 0;
    }

    .quest-title {
      font-size: 0.97rem;
      font-weight: 800;
      color: #2d1f00;
      margin: 0 0 0.2rem;
      line-height: 1.3;
    }

    .quest-desc {
      font-size: 0.84rem;
      color: #6b4d1a;
      margin: 0 0 0.6rem;
      line-height: 1.4;
    }

    /* -- Progress row --------------------------------------- */
    .quest-progress-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.45rem;
    }

    .quest-tally {
      font-size: 0.8rem;
      font-weight: 700;
      color: #7a5520;
    }

    /* -- XP badge (glowing gold coin) ---------------------- */
    .quest-xp-badge {
      display: inline-block;
      padding: 0.2rem 0.55rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      background: #f6b24a;
      color: #2a1400;
      box-shadow: 0 0 10px rgba(246, 178, 74, 0.6);
      transition: background 0.3s ease, box-shadow 0.3s ease;
    }

    .quest-xp-badge--done {
      background: #4ade80;
      color: #052e16;
      box-shadow: 0 0 10px rgba(74, 222, 128, 0.55);
    }

    .empty-state {
      text-align: center;
      color: var(--ion-color-medium);
    }

    /* -- Dark mode ----------------------------------------- */
    @media (prefers-color-scheme: dark) {
      .quest-card {
        border-color: rgba(180, 130, 50, 0.3);
        background:
          radial-gradient(ellipse at 100% 0%, rgba(80, 52, 14, 0.55) 0%, transparent 55%),
          linear-gradient(160deg, rgba(34, 20, 6, 0.97), rgba(28, 16, 4, 0.97));
        box-shadow:
          0 4px 18px rgba(0, 0, 0, 0.45),
          inset 0 1px 0 rgba(255, 220, 140, 0.06);
      }

      .quest-title {
        color: #f5dfa0;
      }

      .quest-desc {
        color: #c8a564;
      }

      .quest-tally {
        color: #d4a84b;
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
    IonCardContent,
    IonButtons,
    IonBackButton,
    IonProgressBar,
    IonIcon
  ]
})
export class QuestsPage {
  private questService = inject(QuestService);
  private instrumentService = inject(InstrumentService);

  activeQuests = this.questService.currentInstrumentQuests;

  emptyQuestsMessage = computed(() => {
    const msgs: Record<string, string> = {
      guitar: '🎸 Your guitar is waiting! Start practicing to unlock quests.',
      bass: '🎸 Lay down some bass lines to generate new quests!',
      piano: '🎹 Tickle the ivories to unlock your daily quests!',
      drums: '🥁 Hit something! Practicing generates new quests.',
      violin: '🎻 Rosin up and get going — practicing unlocks quests!',
      vocals: '🎤 Warm up those pipes to unlock your quests!',
    };
    return msgs[this.instrumentService.currentInstrument()] ?? 'Start practicing to generate new quests!';
  });

  constructor() {
    addIcons({ trophy, checkmarkCircle, ribbonOutline });
  }
}
