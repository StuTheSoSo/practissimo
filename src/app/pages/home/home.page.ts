// src/app/pages/home/home.page.ts
import { Component, OnInit, computed, inject, signal } from '@angular/core';
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
  IonButton,
  IonIcon,
  IonBadge,
  IonButtons,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  flame,
  trophy,
  star,
  play,
  settings,
  calendar,
  chevronForward,
  musicalNotes,
  musicalNote,
  sparkles,
  chatbubbleEllipses,
  bug,
  bulb,
  barChart
} from 'ionicons/icons';
import { GamificationService } from '../../core/services/gamification.service';
import { InstrumentService } from '../../core/services/instrument.service';
import { QuestService } from '../../core/services/quest.service';
import { RevenueCatService } from '../../core/services/revenuecat.service';
import { FeedbackModalComponent } from 'src/app/shared/components/feedback.component';
import { PaywallModalComponent } from 'src/app/shared/components/paywall-modal.component';
import { WeeklyTargetService } from '../../core/services/weekly-target.service';

@Component({
  selector: 'app-home',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>PracticeQuest</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="goToSettings()">
            <ion-icon name="settings" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="home-content ion-padding">
      <div class="home-container">
        <div class="instrument-header reveal reveal-1">
          <h2>{{ currentInstrument() }}</h2>
          <ion-badge color="primary">Level {{ level() }}</ion-badge>
        </div>

        <section
          class="practice-hero reveal reveal-2"
          [class.state-active]="streakStatus() === 'active'"
          [class.state-risk]="streakStatus() === 'at_risk'"
          [class.state-broken]="streakStatus() === 'broken'"
        >
          <p class="practice-hero-kicker">{{ streakStatusLabel() }}</p>
          <h1>{{ streakStatus() === 'active' ? 'Session Complete' : 'Start Practice' }}</h1>
          <p>{{ practiceHeroMessage() }}</p>

          @if (weeklyTargetCompleted()) {
            <div class="hero-complete-pill">
              <ion-icon name="trophy"></ion-icon>
              Weekly target complete
            </div>
          }

          <ion-button
            class="practice-hero-cta"
            size="large"
            [class.pulse-cta]="streakStatus() !== 'active'"
            (click)="startPractice()"
          >
            <ion-icon name="play" slot="start"></ion-icon>
            {{ primaryCtaLabel() }}
          </ion-button>
        </section>
        @if (!isPro()) {
          <ion-card class="pro-upgrade-card-prominent reveal reveal-3">
            <ion-card-content>
              <div class="pro-upgrade-badge">⚡ Limited Time</div>
              <div class="pro-upgrade-header-prominent">
                <ion-icon name="sparkles" color="warning"></ion-icon>
                <div>
                  <h3>Unlock Pro Features</h3>
                  <p>200+ chords • Save favorites • Advanced filters</p>
                </div>
              </div>
              <div class="pro-upgrade-footer-prominent">
                <div class="pro-price-stack">
                  <span class="pro-price-main">$0.99/month</span>
                  <span class="pro-price-alt">or $9.99/year (save 17%)</span>
                </div>
                <ion-button size="default" class="pro-upgrade-cta-prominent" (click)="openPaywall()">
                  Upgrade Now
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        }

        <section class="stat-chips reveal reveal-4">
          <div class="stat-chip streak-chip">
            <ion-icon name="flame"></ion-icon>
            <div>
              <span>Streak</span>
              <strong>{{ currentStreak() }} days</strong>
            </div>
          </div>
          <div class="stat-chip level-chip">
            <ion-icon name="star"></ion-icon>
            <div>
              <span>Level</span>
              <strong>{{ level() }} ({{ levelProgressDisplay() }}%)</strong>
            </div>
          </div>
          <div class="stat-chip weekly-chip">
            <ion-icon name="calendar"></ion-icon>
            <div>
              <span>Weekly Target</span>
              <strong>
                @if (weeklyTargetCompleted()) {
                  Complete
                } @else {
                  {{ weeklyMinutesRemaining() }} min left
                }
              </strong>
            </div>
          </div>
        </section>

        <ion-card class="streak-card reveal reveal-5">
          <ion-card-header>
            <div class="streak-header">
              <ion-icon name="flame" color="danger"></ion-icon>
              <ion-card-title>{{ currentStreak() }} Day Streak</ion-card-title>
            </div>
          </ion-card-header>
          <ion-card-content>
            <p class="streak-status">{{ streakMessage() }}</p>
            @if (longestStreak() > currentStreak()) {
              <p class="longest-streak">Personal Best: {{ longestStreak() }} days</p>
            }
          </ion-card-content>
        </ion-card>

        <ion-grid class="quick-actions reveal reveal-6">
          <ion-row>
            <ion-col [size]="showPitchFinderAction() || supportsTuner() ? '6' : '12'">
              <ion-button expand="block" fill="outline" (click)="goToQuests()">
                <ion-icon name="trophy" slot="start"></ion-icon>
                Quests
                @if (activeQuestsCount() > 0) {
                  <ion-badge color="danger">{{ activeQuestsCount() }}</ion-badge>
                }
              </ion-button>
            </ion-col>
            @if (showPitchFinderAction()) {
              <ion-col size="6">
                <ion-button expand="block" fill="outline" (click)="goToPitchFinder()">
                  <ion-icon name="musical-note" slot="start"></ion-icon>
                  Pitch Finder
                </ion-button>
              </ion-col>
            } @else if (supportsTuner()) {
              <ion-col size="6">
                <ion-button expand="block" fill="outline" (click)="goToTuner()">
                  <ion-icon name="musical-note" slot="start"></ion-icon>
                  Tuner
                </ion-button>
              </ion-col>
            }
          </ion-row>
          <ion-row>
            <ion-col [size]="supportsChords() ? '6' : '12'">
              <ion-button expand="block" fill="outline" (click)="goToAchievements()">
                <ion-icon name="star" slot="start"></ion-icon>
                Achievements
              </ion-button>
            </ion-col>
            @if (supportsChords()) {
              <ion-col size="6">
                <ion-button expand="block" fill="outline" (click)="goToChordCharts()">
                  <ion-icon name="musical-notes" slot="start"></ion-icon>
                  Chord Charts
                </ion-button>
              </ion-col>
            }
          </ion-row>
          <ion-row>
            <ion-col size="12">
              <ion-button expand="block" fill="clear" (click)="goToAnalytics()">
                <ion-icon name="bar-chart" slot="start"></ion-icon>
                Advanced Analytics
                @if (isPro()) {
                  <ion-badge color="warning" style="margin-left: 0.5rem;">PRO</ion-badge>
                }
                <ion-icon name="chevron-forward" slot="end"></ion-icon>
              </ion-button>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="12">
              <ion-button expand="block" fill="clear" (click)="goToHistory()">
                <ion-icon name="calendar" slot="start"></ion-icon>
                View History
                <ion-icon name="chevron-forward" slot="end"></ion-icon>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>

        <ion-card class="level-progress-card reveal reveal-7">
          <ion-card-header>
            <ion-card-title>Level Progress</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="xp-info">
              <span>{{ levelInfo().currentXp }} / {{ levelInfo().xpForNextLevel - levelInfo().xpForCurrentLevel }} XP</span>
              <span>{{ levelProgressDisplay() }}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill level-fill" [style.width.%]="levelProgressAnimated()"></div>
            </div>
          </ion-card-content>
        </ion-card>

        <ion-card class="weekly-target-card reveal reveal-8" [class.complete]="weeklyTargetCompleted()">
          <ion-card-header>
            <ion-card-title>Weekly Target</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="weekly-target-meta">
              <span>{{ weekRangeLabel() }}</span>
              <span>{{ weeklyProgressDisplay() }}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill weekly-fill" [style.width.%]="weeklyProgressAnimated()"></div>
            </div>
            <p class="weekly-target-detail">
              {{ weeklyMinutesCompleted() }} / {{ weeklyTargetMinutes() }} minutes
              @if (weeklyTargetCompleted()) {
                <strong> complete</strong>
              } @else {
                <span> ({{ weeklyMinutesRemaining() }} min left)</span>
              }
            </p>
          </ion-card-content>
        </ion-card>

        <section class="more-section reveal reveal-9">
          <ion-button expand="block" fill="clear" (click)="toggleMoreSection()">
            {{ showMoreSection() ? 'Hide Secondary Sections' : 'See More Tools & Feedback' }}
            <ion-icon
              name="chevron-forward"
              slot="end"
              [class.more-chevron-open]="showMoreSection()"
            ></ion-icon>
          </ion-button>
        </section>

        @if (showMoreSection()) {
          @if (todaysQuests().length > 0) {
            <ion-card class="quests-card reveal reveal-11">
              <ion-card-header>
                <ion-card-title>Today's Quests</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  @for (quest of todaysQuests().slice(0, 3); track quest.id) {
                    <ion-item>
                      <ion-label>
                        <h3>{{ quest.title }}</h3>
                        <p>{{ quest.progress }} / {{ quest.target }}</p>
                      </ion-label>
                      <ion-badge [color]="quest.completed ? 'success' : 'medium'" slot="end">
                        {{ quest.completed ? 'Complete' : quest.xpReward + ' XP' }}
                      </ion-badge>
                    </ion-item>
                  }
                </ion-list>
                @if (todaysQuests().length > 3) {
                  <ion-button expand="block" fill="clear" (click)="goToQuests()">
                    View All Quests ({{ todaysQuests().length }})
                  </ion-button>
                }
              </ion-card-content>
            </ion-card>
          }

          <ion-card class="feedback-card reveal reveal-12">
            <ion-card-header>
              <ion-card-title>Help Us Improve</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <p>Your feedback is invaluable. Report bugs, request features, or share what would improve your practice flow.</p>

              <ion-button expand="block" fill="solid" (click)="openFeedback()">
                <ion-icon name="chatbubble-ellipses" slot="start"></ion-icon>
                Send Feedback
              </ion-button>

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
        }

        <div class="bottom-spacer"></div>
      </div>
    </ion-content>
  `,
  styles: [`
    .home-content {
      --padding-top: 0;
    }

    .home-container {
      max-width: 600px;
      margin: 0 auto;
      padding-bottom: 0;
      color: #0f172a;
    }

    .bottom-spacer {
      height: 80px;
    }

    .home-container ion-card:not(.pro-upgrade-card) {
      --color: #0f172a;
      color: #0f172a;
    }

    .home-container ion-card:not(.pro-upgrade-card) ion-card-title,
    .home-container ion-card:not(.pro-upgrade-card) ion-label,
    .home-container ion-card:not(.pro-upgrade-card) p,
    .home-container ion-card:not(.pro-upgrade-card) span {
      color: #1f2937;
    }

    .home-container ion-item {
      --color: #1f2937;
    }

    ion-card {
      border-radius: 18px;
      transition: transform 180ms ease, box-shadow 180ms ease;
    }

    ion-card:active {
      transform: translateY(1px) scale(0.996);
    }

    .reveal {
      opacity: 1;
      transform: translateY(0);
      will-change: opacity, transform;
      animation: reveal-in 520ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }

    .reveal-1 { animation-delay: 40ms; }
    .reveal-2 { animation-delay: 80ms; }
    .reveal-3 { animation-delay: 120ms; }
    .reveal-4 { animation-delay: 160ms; }
    .reveal-5 { animation-delay: 200ms; }
    .reveal-6 { animation-delay: 240ms; }
    .reveal-7 { animation-delay: 280ms; }
    .reveal-8 { animation-delay: 320ms; }
    .reveal-9 { animation-delay: 360ms; }
    .reveal-10 { animation-delay: 400ms; }
    .reveal-11 { animation-delay: 440ms; }
    .reveal-12 { animation-delay: 480ms; }

    @keyframes reveal-in {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .instrument-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-top: 1rem;
    }

    .instrument-header h2 {
      margin: 0;
      color: #0f172a;
      font-weight: 800;
    }

    .practice-hero {
      text-align: center;
      margin: 0 0 1rem;
      padding: 1.35rem 1rem 1.5rem;
      border-radius: 18px;
      background:
        radial-gradient(circle at top right, rgba(255, 221, 167, 0.55), transparent 46%),
        linear-gradient(145deg, #5d86f3, #71b4ff);
      color: var(--ion-color-primary-contrast);
      box-shadow: 0 12px 22px rgba(64, 115, 210, 0.22);
      position: relative;
      overflow: hidden;
      will-change: background-position;
      background-size: 130% 130%;
      animation: hero-pan 10s ease-in-out infinite alternate;
    }

    .practice-hero::before {
      content: '';
      position: absolute;
      inset: -40%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent 55%);
      transform: translateY(-20%);
      pointer-events: none;
    }

    .practice-hero.state-active {
      background:
        radial-gradient(circle at top right, rgba(178, 255, 214, 0.48), transparent 46%),
        linear-gradient(145deg, #2f9f72, #4ac798);
      background-size: 130% 130%;
    }

    .practice-hero.state-risk {
      background:
        radial-gradient(circle at top right, rgba(255, 232, 165, 0.5), transparent 46%),
        linear-gradient(145deg, #cc7c2d, #e8a347);
      background-size: 130% 130%;
    }

    .practice-hero.state-broken {
      background:
        radial-gradient(circle at top right, rgba(201, 212, 255, 0.45), transparent 46%),
        linear-gradient(145deg, #6075a7, #7a90bf);
      background-size: 130% 130%;
    }

    @keyframes hero-pan {
      from { background-position: 0% 50%; }
      to { background-position: 100% 50%; }
    }

    .practice-hero-kicker {
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      font-size: 0.8rem;
      opacity: 0.95;
      font-weight: 700;
    }

    .practice-hero h1 {
      margin: 0.3rem 0 0.35rem;
      font-size: 2.25rem;
      line-height: 1.1;
      position: relative;
      z-index: 1;
    }

    .practice-hero p {
      margin: 0 auto;
      max-width: 30ch;
      color: rgba(255, 255, 255, 0.95);
      font-size: 1.05rem;
      position: relative;
      z-index: 1;
    }

    .practice-hero-cta {
      margin-top: 1rem;
      --background: #ffffff;
      --color: var(--ion-color-primary);
      --border-radius: 14px;
      --padding-top: 0.95rem;
      --padding-bottom: 0.95rem;
      --box-shadow: 0 12px 24px rgba(0, 0, 0, 0.22);
      font-weight: 800;
      letter-spacing: 0.02em;
      min-width: min(92%, 320px);
      transition: transform 160ms ease, filter 160ms ease;
      position: relative;
      z-index: 1;
    }

    .practice-hero-cta:hover {
      transform: translateY(-1px);
      filter: brightness(1.03);
    }

    .practice-hero-cta:active {
      transform: translateY(1px);
      filter: brightness(0.98);
    }

    .pulse-cta {
      animation: cta-pulse 2.4s ease-in-out infinite;
    }

    @keyframes cta-pulse {
      0%, 100% {
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.22);
      }
      50% {
        box-shadow: 0 16px 28px rgba(255, 255, 255, 0.28);
      }
    }

    .hero-complete-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      margin-top: 0.75rem;
      padding: 0.4rem 0.75rem;
      border-radius: 999px;
      font-size: 0.875rem;
      background: rgba(255, 255, 255, 0.22);
      border: 1px solid rgba(255, 255, 255, 0.38);
      position: relative;
      z-index: 1;
      color: #ffffff;
      font-weight: 700;
    }

    .stat-chips {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.65rem;
      margin: 0.15rem 0 1rem;
    }

    .stat-chip {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.72rem 0.78rem;
      border-radius: 14px;
      border: 1px solid rgba(149, 175, 228, 0.24);
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(246, 250, 255, 0.9));
      backdrop-filter: blur(4px);
    }

    .stat-chip ion-icon {
      font-size: 1.25rem;
    }

    .stat-chip span {
      display: block;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #374151;
      margin-bottom: 0.12rem;
      font-weight: 700;
    }

    .stat-chip strong {
      font-size: 1.05rem;
      color: #111827;
      font-weight: 800;
    }

    .streak-chip ion-icon { color: #f97316; }
    .level-chip ion-icon { color: #2563eb; }
    .weekly-chip ion-icon { color: #0ea5a4; }

    @media (min-width: 560px) {
      .stat-chips {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .streak-card {
      background: linear-gradient(135deg, #fdf5df, #f7ebd8);
      border: 1px solid rgba(224, 188, 110, 0.28);
      box-shadow: 0 8px 18px rgba(161, 121, 52, 0.12);
    }

    .streak-card ion-card-title {
      color: #0f172a;
      font-weight: 800;
    }

    .streak-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .streak-header ion-icon {
      font-size: 2rem;
    }

    .streak-status {
      font-size: 1.1rem;
      margin: 0.5rem 0;
      color: #1f2937;
      font-weight: 700;
    }

    .longest-streak {
      color: #334155;
      font-size: 0.9rem;
      margin: 0;
      font-weight: 600;
    }

    .quick-actions {
      margin: 1rem 0;
    }

    .quick-actions ion-button {
      margin: 0;
      --border-radius: 12px;
      min-height: 48px;
      font-weight: 650;
      transition: transform 140ms ease, filter 140ms ease;
    }

    .quick-actions ion-button[fill='clear'] {
      --color: #1f2937;
      font-weight: 700;
    }

    .quick-actions ion-button:hover {
      transform: translateY(-1px);
      filter: brightness(1.02);
    }

    .quick-actions ion-button:active {
      transform: translateY(1px);
    }

    .xp-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .progress-track {
      height: 10px;
      width: 100%;
      border-radius: 999px;
      background: rgba(20, 20, 20, 0.1);
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: inherit;
      will-change: width;
      transition: width 750ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .level-fill {
      background: linear-gradient(90deg, #4f86f7, #7bb1ff);
    }

    .weekly-fill {
      background: linear-gradient(90deg, #17bebb, #48d6a4);
    }

    .level-progress-card {
      border: 1px solid rgba(125, 164, 238, 0.32);
      background:
        radial-gradient(circle at 96% 4%, rgba(128, 170, 248, 0.28), transparent 40%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(245, 250, 255, 0.96));
      box-shadow: 0 8px 18px rgba(108, 142, 209, 0.14);
    }

    .level-progress-card ion-card-title {
      color: #0f172a;
      font-weight: 800;
    }

    .level-progress-card .xp-info span {
      color: #1f2937;
      font-weight: 700;
    }

    .weekly-target-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #334155;
    }

    .weekly-target-detail {
      margin: 0.75rem 0 0;
      font-size: 0.95rem;
      color: #1f2937;
      font-weight: 600;
    }

    .weekly-target-card {
      border: 1px solid rgba(77, 198, 178, 0.3);
      background:
        radial-gradient(circle at 95% 8%, rgba(119, 219, 206, 0.24), transparent 38%),
        linear-gradient(180deg, rgba(250, 255, 253, 0.96), rgba(241, 252, 248, 0.96));
      position: relative;
      overflow: hidden;
      box-shadow: 0 8px 18px rgba(84, 168, 150, 0.13);
    }

    .weekly-target-card ion-card-title {
      color: #0f172a;
      font-weight: 800;
    }

    .weekly-target-card .weekly-target-meta span {
      color: #334155;
      font-weight: 700;
    }

    .weekly-target-card .weekly-target-detail strong {
      color: #0f766e;
      font-weight: 800;
    }

    .weekly-target-card::after {
      content: '';
      position: absolute;
      top: -10%;
      left: -20%;
      width: 140%;
      height: 140%;
      pointer-events: none;
      background:
        radial-gradient(circle at 20% 60%, rgba(23, 190, 187, 0.08) 0 2px, transparent 3px),
        radial-gradient(circle at 42% 34%, rgba(23, 190, 187, 0.09) 0 2px, transparent 3px),
        radial-gradient(circle at 70% 70%, rgba(23, 190, 187, 0.08) 0 2px, transparent 3px);
      animation: confetti-float 8s linear infinite;
      opacity: 0;
    }

    .weekly-target-card.complete::after {
      opacity: 1;
    }

    @keyframes confetti-float {
      from { transform: translateY(10%); }
      to { transform: translateY(-10%); }
    }

    .pro-upgrade-card-prominent {
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #0d1b2a, #152238);
      color: #f8f9ff;
      border: 2px solid rgba(255, 209, 102, 0.4);
      box-shadow: 0 16px 32px rgba(255, 209, 102, 0.2);
      animation: pro-card-pulse 3s ease-in-out infinite;
    }

    @keyframes pro-card-pulse {
      0%, 100% {
        box-shadow: 0 16px 32px rgba(255, 209, 102, 0.2);
        border-color: rgba(255, 209, 102, 0.4);
      }
      50% {
        box-shadow: 0 20px 40px rgba(255, 209, 102, 0.35);
        border-color: rgba(255, 209, 102, 0.6);
      }
    }

    .pro-upgrade-card-prominent::after {
      content: '';
      position: absolute;
      top: 0;
      left: -50%;
      width: 200%;
      height: 100%;
      background: linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%);
      transform: translateX(-60%);
      animation: pro-upgrade-shimmer 4s ease-in-out infinite;
      pointer-events: none;
    }

    .pro-upgrade-badge {
      display: inline-block;
      padding: 0.25rem 0.6rem;
      background: linear-gradient(135deg, #ffd166, #ff8fab);
      color: #1b1b1b;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      border-radius: 6px;
      margin-bottom: 0.75rem;
    }

    .pro-upgrade-header-prominent {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .pro-upgrade-header-prominent ion-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .pro-upgrade-header-prominent h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1.35rem;
      font-weight: 800;
      color: #ffffff;
    }

    .pro-upgrade-header-prominent p {
      margin: 0;
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.95rem;
      font-weight: 600;
    }

    .pro-upgrade-footer-prominent {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .pro-price-stack {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .pro-price-main {
      font-weight: 800;
      font-size: 1.25rem;
      color: #ffd166;
    }

    .pro-price-alt {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.75);
      font-weight: 600;
    }

    .pro-upgrade-cta-prominent {
      --background: linear-gradient(135deg, #ffd166, #ff8fab);
      --color: #1b1b1b;
      --border-radius: 12px;
      --box-shadow: 0 10px 20px rgba(255, 142, 112, 0.4);
      --padding-start: 1.5rem;
      --padding-end: 1.5rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      flex-shrink: 0;
      width: 100%;
    }

    @media (min-width: 480px) {
      .pro-upgrade-footer-prominent {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }

      .pro-upgrade-cta-prominent {
        width: auto;
      }
    }

    .pro-upgrade-card {
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #0d1b2a, #152238);
      color: #f8f9ff;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .pro-upgrade-card::after {
      content: '';
      position: absolute;
      top: 0;
      left: -50%;
      width: 200%;
      height: 100%;
      background: linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.18) 50%, transparent 70%);
      transform: translateX(-60%);
      animation: pro-upgrade-shimmer 6s ease-in-out infinite;
      pointer-events: none;
    }

    .pro-upgrade-kicker {
      font-size: 0.7rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.82);
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .pro-upgrade-header {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
    }

    .pro-upgrade-header h3 {
      margin: 0 0 0.2rem 0;
      font-size: 1.2rem;
    }

    .pro-upgrade-header p {
      margin: 0;
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.9rem;
    }

    .pro-upgrade-footer {
      margin-top: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .pro-upgrade-price {
      font-weight: 700;
      color: #ffd166;
    }

    .pro-upgrade-cta {
      --background: linear-gradient(135deg, #ffd166, #ff8fab);
      --color: #1b1b1b;
      --border-radius: 12px;
      --box-shadow: 0 10px 20px rgba(255, 142, 112, 0.35);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    @keyframes pro-upgrade-shimmer {
      0% {
        transform: translateX(-60%);
      }
      50% {
        transform: translateX(0%);
      }
      100% {
        transform: translateX(60%);
      }
    }

    .more-section {
      margin-top: 0.15rem;
    }

    .more-section ion-button {
      --color: #1f2937;
      font-weight: 700;
      letter-spacing: 0.01em;
    }

    .more-chevron-open {
      transform: rotate(90deg);
      transition: transform 180ms ease;
    }

    .quests-card {
      border: 1px solid rgba(120, 120, 120, 0.18);
    }

    .feedback-card {
      border: 1px solid rgba(146, 166, 230, 0.32);
      background:
        radial-gradient(circle at 95% 8%, rgba(173, 189, 255, 0.2), transparent 36%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.97), rgba(247, 250, 255, 0.97));
    }

    .feedback-card p,
    .quests-card ion-label h3,
    .quests-card ion-label p {
      color: #1f2937;
    }

    .ion-list {
      padding: 0;
    }

    .feedback-links {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .feedback-links ion-button {
      min-height: 44px;
    }

    @media (prefers-reduced-motion: reduce) {
      .reveal,
      .pulse-cta,
      .practice-hero,
      .weekly-target-card::after,
      .pro-upgrade-card-prominent {
        animation: none !important;
      }

      .reveal {
        opacity: 1 !important;
        transform: none !important;
      }

      .progress-fill,
      ion-card,
      .practice-hero-cta,
      .quick-actions ion-button {
        transition: none !important;
      }
    }

    @media (prefers-color-scheme: dark) {
      .streak-card {
        border-color: rgba(245, 199, 98, 0.35);
        background: linear-gradient(135deg, rgba(74, 46, 12, 0.96), rgba(96, 63, 20, 0.96));
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.28);
      }

      .feedback-card {
        border-color: rgba(147, 166, 255, 0.38);
        background:
          radial-gradient(circle at 95% 8%, rgba(143, 166, 255, 0.24), transparent 38%),
          linear-gradient(180deg, rgba(24, 31, 58, 0.96), rgba(18, 27, 52, 0.96));
      }

      .level-progress-card {
        border-color: rgba(96, 165, 250, 0.35);
        background:
          radial-gradient(circle at 96% 4%, rgba(96, 165, 250, 0.24), transparent 40%),
          linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(17, 24, 39, 0.96));
      }

      .weekly-target-card {
        border-color: rgba(45, 212, 191, 0.34);
        background:
          radial-gradient(circle at 95% 8%, rgba(45, 212, 191, 0.2), transparent 38%),
          linear-gradient(180deg, rgba(6, 41, 46, 0.95), rgba(8, 47, 56, 0.95));
      }

      .level-progress-card ion-card-title,
      .level-progress-card .xp-info span,
      .weekly-target-card ion-card-title,
      .weekly-target-card .weekly-target-meta span,
      .weekly-target-card .weekly-target-detail,
      .weekly-target-meta {
        color: #f8fafc !important;
      }

      .progress-track {
        background: rgba(255, 255, 255, 0.18);
      }

      .weekly-target-card .weekly-target-detail strong {
        color: #5eead4 !important;
      }

      .streak-card ion-card-title,
      .streak-status,
      .longest-streak,
      .feedback-card ion-card-title,
      .feedback-card p {
        color: #f8fafc !important;
      }

      .home-container,
      .home-container ion-card:not(.pro-upgrade-card) {
        color: #f3f4f6 !important;
        --color: #f3f4f6;
      }

      .home-container ion-card:not(.pro-upgrade-card) ion-card-title,
      .home-container ion-card:not(.pro-upgrade-card) ion-label,
      .home-container ion-card:not(.pro-upgrade-card) p,
      .home-container ion-card:not(.pro-upgrade-card) span,
      .instrument-header h2,
      .stat-chip span,
      .stat-chip strong,
      .streak-status,
      .longest-streak,
      .level-progress-card .xp-info span,
      .weekly-target-meta,
      .weekly-target-card .weekly-target-meta span,
      .weekly-target-detail,
      .feedback-card p,
      .quests-card ion-label h3,
      .quests-card ion-label p {
        color: #e5e7eb !important;
      }

      .home-container ion-item {
        --color: #e5e7eb;
      }

      .quick-actions ion-button[fill='clear'],
      .more-section ion-button {
        --color: #e5e7eb;
      }

      .stat-chip {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.16);
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
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonBadge,
    IonButtons,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonLabel
  ]
})
export class HomePage implements OnInit {
  private router = inject(Router);
  private gamificationService = inject(GamificationService);
  private instrumentService = inject(InstrumentService);
  private questService = inject(QuestService);
  private revenueCat = inject(RevenueCatService);
  private modalController = inject(ModalController);
  private weeklyTargetService = inject(WeeklyTargetService);

  currentInstrumentId = this.instrumentService.currentInstrument;
  currentInstrument = this.instrumentService.currentDisplayName;
  supportsTuner = this.instrumentService.supportsTuner;
  supportsChords = this.instrumentService.supportsChords;
  currentStreak = this.gamificationService.currentStreak;
  longestStreak = this.gamificationService.longestStreak;
  level = this.gamificationService.level;
  levelInfo = this.gamificationService.levelInfo;

  todaysQuests = this.questService.currentInstrumentQuests;
  activeQuestsCount = computed(() => this.todaysQuests().filter((q) => !q.completed).length);
  isPro = this.revenueCat.isPro;
  weekRangeLabel = this.weeklyTargetService.weekRangeLabel;
  weeklyTargetMinutes = this.weeklyTargetService.targetMinutes;
  weeklyMinutesCompleted = this.weeklyTargetService.minutesCompleted;
  weeklyMinutesRemaining = this.weeklyTargetService.remainingMinutes;
  weeklyProgressPercent = this.weeklyTargetService.progressPercent;
  weeklyTargetCompleted = this.weeklyTargetService.isCompleted;

  showMoreSection = signal(false);
  levelProgressAnimated = signal(0);
  weeklyProgressAnimated = signal(0);
  levelProgressDisplay = computed(() => Math.round(this.levelProgressAnimated()));
  weeklyProgressDisplay = computed(() => Math.round(this.weeklyProgressAnimated()));
  showPitchFinderAction = computed(() => this.currentInstrumentId() === 'vocals');

  streakStatus = computed(() => this.gamificationService.getStreakStatus());
  primaryCtaLabel = computed(() => this.streakStatus() === 'active' ? 'Practice Again' : 'Start Practice');
  streakStatusLabel = computed(() => {
    const status = this.streakStatus();
    if (status === 'active') return 'On Fire Today';
    if (status === 'at_risk') return 'Streak At Risk';
    return 'Fresh Start';
  });

  practiceHeroMessage = computed(() => {
    const status = this.streakStatus();
    if (status === 'active') {
      if (this.weeklyTargetCompleted()) {
        return 'Weekly target complete. Keep building consistency with another focused session.';
      }
      return `${this.weeklyMinutesRemaining()} minutes left to reach your weekly target.`;
    }
    if (status === 'at_risk') {
      return `Practice now to protect your ${this.currentStreak()} day streak.`;
    }
    return 'A short focused session is all it takes to restart momentum.';
  });

  streakMessage = computed(() => {
    const status = this.gamificationService.getStreakStatus();
    switch (status) {
      case 'active':
        return "Great job! You've practiced today!";
      case 'at_risk':
        return "Don't forget to practice today!";
      case 'broken':
        return 'Start a new streak today!';
    }
  });

  constructor() {
    addIcons({
      flame,
      trophy,
      star,
      play,
      settings,
      calendar,
      chevronForward,
      musicalNotes,
      musicalNote,
      sparkles,
      chatbubbleEllipses,
      bug,
      bulb,
      barChart
    });
  }

  ngOnInit() {
    this.animateProgress(this.levelInfo().progressPercent, this.levelProgressAnimated);
    this.animateProgress(this.weeklyProgressPercent(), this.weeklyProgressAnimated);
    this.checkTimeBasedPaywall();
  }

  private checkTimeBasedPaywall() {
    if (this.isPro()) return;

    const lastShown = localStorage.getItem('paywall_last_shown');
    const now = Date.now();
    const threeDays = 3 * 24 * 60 * 60 * 1000;

    if (!lastShown || now - parseInt(lastShown) > threeDays) {
      setTimeout(() => {
        if (!this.isPro()) {
          localStorage.setItem('paywall_last_shown', now.toString());
          void this.openPaywall();
        }
      }, 15000); // 15 seconds
    }
  }

  startPractice() {
    this.router.navigate(['/practice']);
  }

  goToChordCharts() {
    this.router.navigate(['/chord-charts']);
  }

  goToTuner() {
    this.router.navigate(['/tuner']);
  }

  goToPitchFinder() {
    this.router.navigate(['/pitch-finder']);
  }

  goToQuests() {
    this.router.navigate(['/quests']);
  }

  goToAchievements() {
    this.router.navigate(['/achievements']);
  }

  goToHistory() {
    this.router.navigate(['/history']);
  }

  goToAnalytics() {
    this.router.navigate(['/analytics']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  toggleMoreSection() {
    this.showMoreSection.update((current) => !current);
  }

  async openFeedback() {
    const modal = await this.modalController.create({
      component: FeedbackModalComponent
    });
    await modal.present();
  }

  async openFeedbackWithType(type: 'bug' | 'feature') {
    const modal = await this.modalController.create({
      component: FeedbackModalComponent,
      componentProps: {
        initialType: type
      }
    });
    await modal.present();
  }

  async openPaywall() {
    const modal = await this.modalController.create({
      component: PaywallModalComponent,
      componentProps: {
        reason: 'Unlock the full chord library, favorites, and advanced filters.'
      }
    });
    await modal.present();
  }

  private animateProgress(target: number, targetSignal: { set: (value: number) => void }) {
    const start = 0;
    const end = Math.max(0, Math.min(100, target));
    const duration = 900;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      targetSignal.set(start + (end - start) * eased);
      if (t < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }
}
