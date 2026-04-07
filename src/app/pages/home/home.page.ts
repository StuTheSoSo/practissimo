// src/app/pages/home/home.page.ts
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
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
  barChart,
  heart,
  download,
  checkmarkDone
} from 'ionicons/icons';
import { GamificationService } from '../../core/services/gamification.service';
import { InstrumentService } from '../../core/services/instrument.service';
import { QuestService } from '../../core/services/quest.service';
import { RevenueCatService } from '../../core/services/revenuecat.service';
import { FeedbackModalComponent } from 'src/app/shared/components/feedback.component';
import { PaywallModalComponent } from 'src/app/shared/components/paywall-modal.component';
import { WeeklyTargetService } from '../../core/services/weekly-target.service';
import { RepertoireService } from '../../core/services/repertoire.service';
import { PracticeService } from '../../core/services/practice.service';
import { MascotComponent } from 'src/app/shared/components/mascot.component';
import { PraxOverlayComponent } from 'src/app/shared/components/prax-overlay.component';
import { PraxTourComponent } from 'src/app/shared/components/prax-tour.component';

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
          <h1>{{ streakStatus() === 'active' ? 'Session Complete' : 'Practice with Purpose' }}</h1>
          <p>{{ practiceHeroMessage() }}</p>

          @if (streakStatus() === 'at_risk') {
            <div class="risk-countdown">
              ⏰ {{ hoursUntilMidnight() }}h left to save your streak
            </div>
          }

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

        <section class="stat-strip reveal reveal-3">
          <div class="stat-item">
            <ion-icon name="flame" [className]="flameIconClass()"></ion-icon>
            <strong>{{ currentStreak() }}</strong>
            <span>day streak</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <ion-icon name="star" class="level-icon"></ion-icon>
            <strong>{{ level() }}</strong>
            <span>level</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <ion-icon name="calendar" class="weekly-icon"></ion-icon>
            @if (weeklyTargetCompleted()) {
              <strong class="weekly-done">&#x2713;&nbsp;Done</strong>
            } @else {
              <strong>{{ weeklyMinutesRemaining() }}m</strong>
            }
            <span>weekly</span>
          </div>
        </section>

        <ion-card class="progress-card reveal reveal-4">
          <ion-card-content>
            <div class="prog-section" style="position: relative">
              <div class="prog-label-row">
                <span class="prog-label-text">
                  <ion-icon name="star" class="prog-icon"></ion-icon>
                  Level {{ level() }}
                </span>
                <span class="prog-value">
                  @if (xpPopupAmount() !== null) {
                    <span class="xp-popup">+{{ xpPopupAmount() }} XP</span>
                  }
                  {{ displayedXp() }} XP &middot; {{ levelProgressDisplay() }}%
                </span>
              </div>
              <div class="progress-track">
                <div class="progress-fill level-fill" [style.width.%]="levelProgressAnimated()"></div>
              </div>
            </div>
            <div class="prog-section" style="margin-top: 14px">
              <div class="prog-label-row">
                <span class="prog-label-text">
                  <ion-icon name="calendar" class="prog-icon weekly-prog-icon"></ion-icon>
                  Weekly Goal
                </span>
                <span class="prog-value">
                  {{ weeklyMinutesCompleted() }}/{{ weeklyTargetMinutes() }} min &middot; {{ weeklyProgressDisplay() }}%
                </span>
              </div>
              <div class="progress-track">
                <div class="progress-fill weekly-fill" [style.width.%]="weeklyProgressAnimated()"></div>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <section class="actions-grid reveal reveal-5">
          <div class="action-tile" (click)="goToQuests()" role="button">
            <div class="action-tile-icon trophy-bg">
              <ion-icon name="trophy"></ion-icon>
              @if (activeQuestsCount() > 0) {
                <ion-badge color="danger" class="tile-badge">{{ activeQuestsCount() }}</ion-badge>
              }
            </div>
            <span>Quests</span>
          </div>
          <div class="action-tile" (click)="goToAchievements()" role="button">
            <div class="action-tile-icon star-bg">
              <ion-icon name="star"></ion-icon>
            </div>
            <span>Achievements</span>
          </div>
          @if (supportsChords()) {
            <div class="action-tile" (click)="goToChordCharts()" role="button">
              <div class="action-tile-icon chords-bg">
                <ion-icon name="musical-notes"></ion-icon>
              </div>
              <span>Chords</span>
            </div>
          }
          @if (showPitchFinderAction()) {
            <div class="action-tile" (click)="goToPitchFinder()" role="button">
              <div class="action-tile-icon pitch-bg">
                <ion-icon name="musical-note"></ion-icon>
              </div>
              <span>Pitch Finder</span>
            </div>
          } @else if (supportsTuner()) {
            <div class="action-tile" (click)="goToTuner()" role="button">
              <div class="action-tile-icon tuner-bg">
                <ion-icon name="musical-note"></ion-icon>
              </div>
              <span>Tuner</span>
            </div>
          }
          <div class="action-tile" (click)="goToRepertoire()" role="button">
            <div class="action-tile-icon repertoire-bg">
              <ion-icon name="musical-notes"></ion-icon>
            </div>
            <span>Repertoire</span>
          </div>
          <div class="action-tile" (click)="goToGoals()" role="button">
            <div class="action-tile-icon goals-bg">
              <ion-icon name="checkmark-done"></ion-icon>
            </div>
            <span>Goals</span>
          </div>
          <div class="action-tile" (click)="goToHistory()" role="button">
            <div class="action-tile-icon history-bg">
              <ion-icon name="calendar"></ion-icon>
            </div>
            <span>History</span>
          </div>
          <div class="action-tile" (click)="goToAnalytics()" role="button">
            <div class="action-tile-icon analytics-bg">
              <ion-icon name="bar-chart"></ion-icon>
            </div>
            <span>Analytics</span>
          </div>
        </section>


	        @if (!isPro()) {
	          <ion-card class="pro-upgrade-card-prominent reveal reveal-9">
	            <ion-card-content>
	              <div class="pro-upgrade-badge">⚡ Limited Time</div>
	              <div class="pro-upgrade-header-prominent">
	                <ion-icon name="sparkles" color="warning"></ion-icon>
	                <div>
	                  <h3>Master Your Practice</h3>
	                  <p>Everything you need to level up faster</p>
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
	              <div class="pro-benefits">
	                <div class="benefit-item">
	                  <ion-icon name="musical-notes" color="primary"></ion-icon>
	                  <div>
	                    <strong>200+ Chords</strong>
	                    <span>Master intermediate & advanced techniques</span>
	                  </div>
	                </div>
	                <div class="benefit-item">
	                  <ion-icon name="heart" color="danger"></ion-icon>
	                  <div>
	                    <strong>Save Favorites</strong>
	                    <span>Quick access to your most-used chords</span>
	                  </div>
	                </div>
	                <div class="benefit-item">
	                  <ion-icon name="bar-chart" color="success"></ion-icon>
	                  <div>
	                    <strong>Advanced Analytics</strong>
	                    <span>Track progress with detailed insights</span>
	                  </div>
	                </div>
	                <div class="benefit-item">
	                  <ion-icon name="download" color="warning"></ion-icon>
	                  <div>
	                    <strong>Export History</strong>
	                    <span>Download unlimited practice data</span>
	                  </div>
	                </div>
	              </div>
	            </ion-card-content>
	          </ion-card>
	        }

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

        <!-- Repertoire Preview -->
        @if (nextUpRepertoire().length > 0) {
          <ion-card class="repertoire-card reveal reveal-13">
            <ion-card-header>
              <ion-card-title>
                <ion-icon name="musical-notes"></ion-icon>
                Next Up ({{ nextUpRepertoire().length }})
              </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <p class="intro-text">Pieces and exercises waiting for practice:</p>
              <ion-list>
                @for (item of nextUpRepertoire(); track item.id) {
                  <ion-item lines="inset" (click)="goToRepertoire()" button>
                    <ion-label>
                      <h3>{{ item.title }}</h3>
                      @if (item.composer) {
                        <p>{{ item.composer }}</p>
                      }
                      <p class="item-meta">
                        {{ item.status }}
                        @if (item.lastPracticed) {
                          · {{ daysSincePracticed(item.lastPracticed) }}d ago
                        } @else {
                          · Not yet practiced
                        }
                      </p>
                    </ion-label>
                    <ion-icon name="chevron-forward" slot="end"></ion-icon>
                  </ion-item>
                }
              </ion-list>
              <ion-button
                expand="block"
                fill="outline"
                (click)="goToRepertoire()"
                style="margin-top: 12px;"
              >
                <ion-icon name="musical-note" slot="start"></ion-icon>
                View All Repertoire
              </ion-button>
            </ion-card-content>
          </ion-card>
        }

        <div class="bottom-spacer"></div>
      </div>

      @if (showPraxOverlay()) {
        <app-prax-overlay
          [message]="praxMessage()"
          [mood]="praxMood()"
          (dismissed)="dismissPrax()"
        ></app-prax-overlay>
      }

      @if (showTour()) {
        <app-prax-tour (completed)="onTourCompleted()"></app-prax-tour>
      }
    </ion-content>
  `,
  styles: [`
    .repertoire-card {
      margin-bottom: 16px;
    }

    .repertoire-card ion-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
    }

    .repertoire-card ion-icon {
      font-size: 24px;
      color: var(--ion-color-primary);
    }

    .repertoire-card .intro-text {
      font-size: 14px;
      color: var(--ion-color-medium);
      margin: 0 0 12px 0;
    }

    .repertoire-card .item-meta {
      font-size: 12px;
      color: var(--ion-color-medium);
    }

    .repertoire-card ion-list {
      margin: 0;
    }

    .repertoire-card ion-item {
      --padding-start: 0;
      --inner-padding-end: 0;
      --border-color: rgba(230, 230, 230, 0.5);
    }

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

	    .home-container ion-card:not(.pro-upgrade-card):not(.pro-upgrade-card-prominent) {
	      --color: #0f172a;
	      color: #0f172a;
	    }

	    .home-container ion-card:not(.pro-upgrade-card):not(.pro-upgrade-card-prominent) ion-card-title,
	    .home-container ion-card:not(.pro-upgrade-card):not(.pro-upgrade-card-prominent) ion-label,
	    .home-container ion-card:not(.pro-upgrade-card):not(.pro-upgrade-card-prominent) p,
	    .home-container ion-card:not(.pro-upgrade-card):not(.pro-upgrade-card-prominent) span {
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
      animation: hero-pan 10s ease-in-out infinite alternate, risk-border-pulse 1.6s ease-in-out infinite;
      outline: 3px solid rgba(239, 68, 68, 0.8);
      outline-offset: 0px;
    }

    @keyframes risk-border-pulse {
      0%, 100% { outline-color: rgba(239, 68, 68, 0.9); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
      50%       { outline-color: rgba(239, 68, 68, 0.4); box-shadow: 0 0 0 8px rgba(239, 68, 68, 0.18); }
    }

    .risk-countdown {
      display: inline-block;
      margin-top: 0.6rem;
      padding: 0.35rem 0.8rem;
      border-radius: 999px;
      background: rgba(239, 68, 68, 0.28);
      border: 1px solid rgba(239, 68, 68, 0.55);
      font-size: 0.85rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: 0.02em;
      position: relative;
      z-index: 1;
      animation: risk-countdown-pulse 1.6s ease-in-out infinite;
    }

    @keyframes risk-countdown-pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.7; }
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

    /* ── Stat Strip ── */
    .stat-strip {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 0.85rem 1rem;
      border-radius: 18px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(246, 250, 255, 0.92));
      border: 1px solid rgba(149, 175, 228, 0.22);
      backdrop-filter: blur(6px);
      margin: 0.75rem 0 0.85rem;
    }

    .stat-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.15rem;
    }

    .stat-item ion-icon {
      font-size: 1.25rem;
      margin-bottom: 0.1rem;
    }

    .stat-item strong {
      font-size: 1.15rem;
      font-weight: 800;
      color: #111827;
      line-height: 1.1;
    }

    .stat-item span {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: #6b7280;
      font-weight: 600;
    }

    .stat-divider {
      width: 1px;
      height: 32px;
      background: rgba(0, 0, 0, 0.1);
      flex-shrink: 0;
    }

    .level-icon { color: #4f86f7; }
    .weekly-icon { color: #0ea5a4; }
    .weekly-done { color: #059669 !important; }

    @keyframes flame-flicker {
      0%, 100% { transform: scale(1) rotate(0deg);    opacity: 1; }
      25%       { transform: scale(1.1) rotate(-3deg); opacity: 0.85; }
      50%       { transform: scale(0.94) rotate(2deg); opacity: 0.95; }
      75%       { transform: scale(1.06) rotate(-1deg); opacity: 0.88; }
    }

    .flame-icon {
      animation: flame-flicker 2s ease-in-out infinite;
      display: inline-block;
      color: #f97316;
    }

    .flame-hot {
      filter: drop-shadow(0 0 5px rgba(249, 115, 22, 0.9))
              drop-shadow(0 0 10px rgba(249, 115, 22, 0.5));
    }

    .flame-super-hot {
      color: #60a5fa !important;
      filter: drop-shadow(0 0 6px rgba(96, 165, 250, 0.95))
              drop-shadow(0 0 14px rgba(147, 197, 253, 0.65))
              drop-shadow(0 0 24px rgba(191, 219, 254, 0.4));
    }

    /* ── Combined Progress Card ── */
    .progress-card {
      border: 1px solid rgba(125, 164, 238, 0.28);
      background:
        radial-gradient(circle at 96% 4%, rgba(128, 170, 248, 0.2), transparent 40%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.97), rgba(245, 250, 255, 0.97));
      box-shadow: 0 6px 16px rgba(108, 142, 209, 0.1);
      margin-bottom: 1rem;
    }

    .prog-section { position: relative; }

    .prog-label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .prog-label-text {
      font-size: 0.82rem;
      font-weight: 700;
      color: #1f2937;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .prog-icon { font-size: 0.95rem; color: #4f86f7; }
    .weekly-prog-icon { color: #0ea5a4; }

    .prog-value {
      font-size: 0.78rem;
      font-weight: 600;
      color: #6b7280;
      position: relative;
    }

    .progress-track {
      height: 8px;
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

    .level-fill  { background: linear-gradient(90deg, #4f86f7, #7bb1ff); }
    .weekly-fill { background: linear-gradient(90deg, #17bebb, #48d6a4); }

    .xp-popup {
      position: absolute;
      right: 0;
      top: -20px;
      background: linear-gradient(135deg, #4f86f7, #7bb1ff);
      color: #fff;
      font-size: 0.78rem;
      font-weight: 800;
      padding: 0.2rem 0.55rem;
      border-radius: 999px;
      pointer-events: none;
      white-space: nowrap;
      animation: xp-float-up 1.8s ease-out forwards;
      z-index: 10;
    }

    @keyframes xp-float-up {
      0%   { opacity: 1; transform: translateY(0);    }
      60%  { opacity: 1; transform: translateY(-16px); }
      100% { opacity: 0; transform: translateY(-32px); }
    }

    /* ── Actions Grid ── */
    .actions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.7rem;
      margin: 0 0 1rem;
    }

    .action-tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.45rem;
      padding: 1rem 0.5rem 0.85rem;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(0, 0, 0, 0.07);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      cursor: pointer;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      transition: transform 140ms ease, box-shadow 140ms ease;
      text-align: center;
    }

    .action-tile:hover { box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1); }
    .action-tile:active { transform: scale(0.94); box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06); }

    .action-tile-icon {
      width: 50px;
      height: 50px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .action-tile-icon ion-icon { font-size: 1.5rem; color: #fff; }

    .action-tile > span {
      font-size: 0.78rem;
      font-weight: 700;
      color: #374151;
    }

    .tile-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      font-size: 0.65rem;
      min-width: 18px;
      height: 18px;
    }

    /* Tile icon backgrounds */
    .trophy-bg      { background: linear-gradient(135deg, #f59e0b, #f97316); }
    .star-bg        { background: linear-gradient(135deg, #6366f1, #818cf8); }
    .chords-bg      { background: linear-gradient(135deg, #ec4899, #f43f5e); }
    .pitch-bg       { background: linear-gradient(135deg, #14b8a6, #0ea5e9); }
    .tuner-bg       { background: linear-gradient(135deg, #14b8a6, #0ea5e9); }
    .repertoire-bg  { background: linear-gradient(135deg, #8b5cf6, #a78bfa); }
    .history-bg     { background: linear-gradient(135deg, #0ea5e9, #38bdf8); }
    .goals-bg       { background: linear-gradient(135deg, #22c55e, #4ade80); }
    .analytics-bg   { background: linear-gradient(135deg, #3b82f6, #60a5fa); }

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

    .pro-benefits {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1.25rem;
      padding-top: 1.25rem;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
    }

    .benefit-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .benefit-item ion-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
      margin-top: 0.1rem;
    }

    .benefit-item div {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .benefit-item strong {
      font-size: 0.95rem;
      color: #ffffff;
      font-weight: 700;
    }

    .benefit-item span {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.75);
      line-height: 1.3;
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
      color: #1f2937 !important;
      text-shadow: 0 1px 2px rgba(255,255,255,0.25);
    }

    @media (prefers-color-scheme: dark) {
      .more-section ion-button {
        --color: #f8fafc;
        color: #f8fafc !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.7);
      }
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
      min-height: 52px;
      height: 52px;
    }

    @media (prefers-reduced-motion: reduce) {
      .reveal,
      .pulse-cta,
      .practice-hero,
      .pro-upgrade-card-prominent {
        animation: none !important;
      }

      .reveal {
        opacity: 1 !important;
        transform: none !important;
      }

      .progress-fill,
      ion-card,
      .practice-hero-cta {
        transition: none !important;
      }
    }

    @media (prefers-color-scheme: dark) {
      /* Studio dark hero — deep indigo with amber glow */
      .practice-hero {
        background:
          radial-gradient(circle at top right, rgba(246, 178, 74, 0.22), transparent 46%),
          linear-gradient(145deg, #160e38, #241856);
        box-shadow: 0 12px 28px rgba(124, 92, 252, 0.3);
      }

      .practice-hero.state-active {
        background:
          radial-gradient(circle at top right, rgba(178, 255, 214, 0.22), transparent 46%),
          linear-gradient(145deg, #0f2e1e, #1a4a30);
      }

      .practice-hero.state-risk {
        background:
          radial-gradient(circle at top right, rgba(246, 178, 74, 0.25), transparent 46%),
          linear-gradient(145deg, #2e1008, #4a1e0e);
      }

      .practice-hero.state-broken {
        background:
          radial-gradient(circle at top right, rgba(150, 150, 180, 0.18), transparent 46%),
          linear-gradient(145deg, #141420, #1e1e30);
      }

      /* Amber CTA text on white button pops against the indigo hero */
      .practice-hero-cta {
        --color: #f6b24a;
      }

      /* Feedback card — standard dark studio surface */
      .feedback-card {
        border-color: rgba(246, 178, 74, 0.14);
        background: rgba(18, 18, 22, 0.97);
      }

      /* Amber level XP fill */
      .level-fill {
        background: linear-gradient(90deg, #f6b24a, #ffd080);
      }

      /* Amber XP pop-up chip */
      .xp-popup {
        background: linear-gradient(135deg, #f6b24a, #ffd080);
        color: #1a0e00;
      }

      .progress-track {
        background: rgba(255, 255, 255, 0.12);
      }



      .streak-card ion-card-title,
      .streak-status,
      .longest-streak,
      .feedback-card ion-card-title,
      .feedback-card p {
        color: #f8fafc !important;
      }

	      .home-container,
	      .home-container ion-card:not(.pro-upgrade-card):not(.pro-upgrade-card-prominent) {
	        color: #f3f4f6 !important;
	        --color: #f3f4f6;
	      }

	      .home-container ion-card:not(.pro-upgrade-card):not(.pro-upgrade-card-prominent) ion-card-title,
	      .home-container ion-card:not(.pro-upgrade-card):not(.pro-upgrade-card-prominent) ion-label,
	      .home-container ion-card:not(.pro-upgrade-card):not(.pro-upgrade-card-prominent) p,
	      .home-container ion-card:not(.pro-upgrade-card):not(.pro-upgrade-card-prominent) span,
	      .instrument-header h2,
	      .stat-chip span,
	      .stat-chip strong,
	      .streak-status,
	      .longest-streak,
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

      /* Stat strip — dark studio */
      .stat-strip {
        background: rgba(18, 18, 26, 0.92);
        border-color: rgba(246, 178, 74, 0.14);
        backdrop-filter: blur(6px);
      }

      .stat-item strong { color: #f3f4f6; }
      .stat-item span   { color: #9ca3af; }
      .stat-divider     { background: rgba(255, 255, 255, 0.1); }
      .level-icon       { color: #f6b24a; }
      .weekly-done      { color: #5eead4 !important; }

      /* Progress card — dark glass */
      .progress-card {
        border-color: rgba(246, 178, 74, 0.2);
        background:
          radial-gradient(circle at 96% 4%, rgba(246, 178, 74, 0.1), transparent 40%),
          rgba(18, 18, 22, 0.97);
      }

      .prog-label-text { color: #e5e7eb; }
      .prog-value      { color: #9ca3af; }
      .progress-track  { background: rgba(255, 255, 255, 0.1); }
      .level-fill      { background: linear-gradient(90deg, #f6b24a, #ffd080); }
      .xp-popup        { background: linear-gradient(135deg, #f6b24a, #ffd080); color: #1a0e00; }

      /* Action tiles — dark */
      .action-tile {
        background: rgba(22, 22, 32, 0.92);
        border-color: rgba(255, 255, 255, 0.07);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      .action-tile > span { color: #d1d5db; }


      .stat-chip {
        background: rgba(18, 18, 26, 0.92);
        border-color: rgba(246, 178, 74, 0.14);
        backdrop-filter: blur(6px);
      }

      /* Level icon in amber to match XP theme */
      .level-chip ion-icon {
        color: #f6b24a;
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
    IonList,
    IonItem,
    IonLabel,
    PraxOverlayComponent,
    PraxTourComponent
  ]
})
export class HomePage implements OnInit, OnDestroy {
  private router = inject(Router);
  private gamificationService = inject(GamificationService);
  private instrumentService = inject(InstrumentService);
  private questService = inject(QuestService);
  private revenueCat = inject(RevenueCatService);
  private modalController = inject(ModalController);
  private weeklyTargetService = inject(WeeklyTargetService);
  private repertoireService = inject(RepertoireService);
  private practiceService = inject(PracticeService);

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

  hasAnySessions = computed(() => this.practiceService.allSessions().length > 0);

  showMoreSection = signal(false);
  showPraxOverlay = signal(false);
  praxMessage = signal('');
  praxMood = signal<'neutral' | 'happy' | 'celebrating'>('neutral');
  showTour = signal(false);
  private praxTimerIds: number[] = [];
  private praxShowCount = 0;
  levelProgressAnimated = signal(0);
  weeklyProgressAnimated = signal(0);
  xpPopupAmount = signal<number | null>(null);
  displayedXp = signal(0);
  levelProgressDisplay = computed(() => Math.round(this.levelProgressAnimated()));
  weeklyProgressDisplay = computed(() => Math.round(this.weeklyProgressAnimated()));
  showPitchFinderAction = computed(() => this.currentInstrumentId() === 'vocals');

  streakStatus = computed(() => this.gamificationService.getStreakStatus());
  primaryCtaLabel = computed(() => this.streakStatus() === 'active' ? 'Practice Again' : 'Start a short, intentional session');
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
      return `Practice a short, intentional session to protect your ${this.currentStreak()} day streak.`;
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

  nextUpRepertoire = computed(() => this.repertoireService.nextUpItems().slice(0, 3));

  private calcHoursUntilMidnight(): number {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return Math.ceil((midnight.getTime() - now.getTime()) / (1000 * 60 * 60));
  }

  flameIconClass = computed(() => {
    const streak = this.currentStreak();
    if (streak >= 30) return 'flame-icon flame-super-hot';
    if (streak >= 7) return 'flame-icon flame-hot';
    return 'flame-icon';
  });

  hoursUntilMidnight = signal(this.calcHoursUntilMidnight());

	  private midnightIntervalId: number | null = null;
	  private paywallTimeoutId: number | null = null;

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
      barChart,
      heart,
      download,
      checkmarkDone
    });
  }

	  ngOnInit() {
	    const currentXp = this.levelInfo().currentXp;
	    const rawPopup = sessionStorage.getItem('_pq_xp_popup');
	    const xpGained = rawPopup ? Number.parseInt(rawPopup, 10) : 0;
	    sessionStorage.removeItem('_pq_xp_popup');

	    if (xpGained > 0) {
	      // Count up from pre-session XP to current
	      const startXp = Math.max(0, currentXp - xpGained);
	      this.displayedXp.set(startXp);
	      this.animateNumber(startXp, currentXp, this.displayedXp);
	      // Show the floating +XP chip
	      this.xpPopupAmount.set(xpGained);
	      setTimeout(() => this.xpPopupAmount.set(null), 1800);
	    } else {
	      this.displayedXp.set(currentXp);
	    }

	    this.animateProgress(this.levelInfo().progressPercent, this.levelProgressAnimated);
    this.animateProgress(this.weeklyProgressPercent(), this.weeklyProgressAnimated);
	    this.checkTimeBasedPaywall();
	    this.midnightIntervalId = window.setInterval(() => {
	      this.hoursUntilMidnight.set(this.calcHoursUntilMidnight());
	    }, 60_000);
    if (localStorage.getItem('prax_tour_v1_done')) {
      this.schedulePrax();
    } else {
      const id = window.setTimeout(() => this.showTour.set(true), 1200);
      this.praxTimerIds.push(id);
    }
	  }

	  ngOnDestroy() {
	    if (this.paywallTimeoutId !== null) {
	      clearTimeout(this.paywallTimeoutId);
	      this.paywallTimeoutId = null;
	    }
	    if (this.midnightIntervalId !== null) {
	      clearInterval(this.midnightIntervalId);
	      this.midnightIntervalId = null;
	    }
    for (const id of this.praxTimerIds) {
      clearTimeout(id);
    }
    this.praxTimerIds = [];
	  }

  private schedulePrax() {
    const id = window.setTimeout(() => this.triggerPrax(), 45_000);
    this.praxTimerIds.push(id);
  }

  private triggerPrax() {
    if (this.praxShowCount >= 3) return;
    this.praxShowCount++;
    const { message, mood } = this.pickPraxMessage();
    this.praxMessage.set(message);
    this.praxMood.set(mood);
    this.showPraxOverlay.set(true);
    const autoId = window.setTimeout(() => this.dismissPrax(), 8_000);
    this.praxTimerIds.push(autoId);
    if (this.praxShowCount < 3) {
      const nextId = window.setTimeout(() => this.triggerPrax(), 4 * 60_000);
      this.praxTimerIds.push(nextId);
    }
  }

  dismissPrax() {
    this.showPraxOverlay.set(false);
  }

  onTourCompleted() {
    this.showTour.set(false);
    this.schedulePrax();
  }

  private pickPraxMessage(): { message: string; mood: 'neutral' | 'happy' | 'celebrating' } {
    const status = this.streakStatus();
    const streak = this.currentStreak();
    const hours = this.hoursUntilMidnight();
    const weeklyDone = this.weeklyTargetCompleted();
    const remaining = this.weeklyMinutesRemaining();

    if (status === 'at_risk' && hours <= 3) {
      return { message: `Only ${hours}h left tonight — save that ${streak}-day streak! 🎵`, mood: 'neutral' };
    }
    if (status === 'at_risk') {
      return { message: `Hey! Your ${streak}-day streak is on the line today 🎶`, mood: 'neutral' };
    }
    if (weeklyDone) {
      return { message: `Weekly goal crushed! You're an absolute practice machine 🎉`, mood: 'celebrating' };
    }
    if (status === 'active' && streak >= 14) {
      return { message: `${streak} days straight! You're seriously building something 🔥`, mood: 'happy' };
    }
    if (status === 'active' && streak >= 7) {
      return { message: `${streak}-day streak! Keep that momentum going 🎵`, mood: 'happy' };
    }
    if (status === 'active') {
      return {
        message: remaining > 0
          ? `Great practice today! ${remaining} min left on your weekly goal 🎶`
          : `Practiced today — nice work! Weekly goal complete 🎵`,
        mood: 'happy'
      };
    }
    if (status === 'broken') {
      return { message: `Fresh start — every great musician just keeps showing up 🎶`, mood: 'neutral' };
    }
    const pool: { message: string; mood: 'neutral' | 'happy' | 'celebrating' }[] = [
      { message: 'Even 5 minutes of focused practice moves the needle 🎵', mood: 'neutral' },
      { message: 'Your instrument is waiting for you 🎶', mood: 'neutral' },
      { message: 'Consistency beats intensity — keep showing up! 🎵', mood: 'happy' },
    ];
    return pool[Math.floor(Math.random() * pool.length)];
  }

	  private checkTimeBasedPaywall() {
	    if (this.isPro()) return;
	    if (this.paywallTimeoutId !== null) return;

	    const lastShownRaw = localStorage.getItem('paywall_last_shown');
	    const lastShown = lastShownRaw ? Number.parseInt(lastShownRaw, 10) : 0;
	    const now = Date.now();
	    const oneWeek = 7 * 24 * 60 * 60 * 1000;

	    if (!lastShown || Number.isNaN(lastShown) || now - lastShown > oneWeek) {
	      this.paywallTimeoutId = window.setTimeout(() => {
	        this.paywallTimeoutId = null;
	        if (!this.isPro()) {
	          localStorage.setItem('paywall_last_shown', Date.now().toString());
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

  goToGoals() {
    this.router.navigate(['/goals']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  goToRepertoire() {
    this.router.navigate(['/repertoire']);
  }

  daysSincePracticed(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
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

  private animateNumber(from: number, to: number, targetSignal: { set: (value: number) => void }) {
    const duration = 900;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      targetSignal.set(Math.round(from + (to - from) * eased));
      if (t < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }
}
