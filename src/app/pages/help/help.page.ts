import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonAccordionGroup, IonAccordion, IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonLabel
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/settings"></ion-back-button>
        </ion-buttons>
        <ion-title>Help & FAQ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-accordion-group>
        <ion-accordion value="getting-started">
          <ion-item slot="header">
            <ion-label>
              <h2>Getting Started</h2>
            </ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <p><strong>1. Choose your instrument</strong> in Settings</p>
            <p><strong>2. Set a practice category</strong> (Scales, Technique, etc.)</p>
            <p><strong>3. Start the timer</strong> and begin practicing</p>
            <p><strong>4. Stop when done</strong> to earn XP and track progress</p>
          </div>
        </ion-accordion>

        <ion-accordion value="practice-timer">
          <ion-item slot="header">
            <ion-label>
              <h2>How does the practice timer work?</h2>
            </ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <p>The practice timer tracks your session time and keeps your device awake while practicing.</p>
            <p><strong>Pause/Resume:</strong> Take breaks without losing your session</p>
            <p><strong>Categories:</strong> Track what you practice (Scales, Technique, Repertoire, etc.)</p>
            <p><strong>Notes:</strong> Add optional notes about your session</p>
          </div>
        </ion-accordion>

        <ion-accordion value="streaks-xp">
          <ion-item slot="header">
            <ion-label>
              <h2>Streaks & XP</h2>
            </ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <p><strong>Streaks:</strong> Practice at least once per day to maintain your streak. Longer streaks earn bonus XP!</p>
            <p><strong>XP (Experience Points):</strong> Earned for each practice session. More practice time = more XP.</p>
            <p><strong>Levels:</strong> Gain levels as you accumulate XP. Each level requires more XP than the last.</p>
          </div>
        </ion-accordion>

        <ion-accordion value="quests">
          <ion-item slot="header">
            <ion-label>
              <h2>What are Quests?</h2>
            </ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <p>Quests are daily and weekly challenges that reward you for consistent practice.</p>
            <p><strong>Daily Quests:</strong> Complete simple tasks each day (practice 15 min, try 2 categories, etc.)</p>
            <p><strong>Weekly Quests:</strong> Longer-term goals that reset each week</p>
            <p>Complete quests to earn bonus XP and achievements!</p>
          </div>
        </ion-accordion>

        <ion-accordion value="achievements">
          <ion-item slot="header">
            <ion-label>
              <h2>Achievements</h2>
            </ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <p>Unlock achievements by reaching milestones:</p>
            <p>• First practice session</p>
            <p>• 7-day streak</p>
            <p>• 100 total practice sessions</p>
            <p>• 1000 minutes practiced</p>
            <p>Check the Achievements page to see all available achievements and your progress!</p>
          </div>
        </ion-accordion>

        <ion-accordion value="weekly-target">
          <ion-item slot="header">
            <ion-label>
              <h2>Weekly Practice Target</h2>
            </ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <p>Set a weekly practice goal in Settings (default: 90 minutes).</p>
            <p>Track your progress on the Home screen. The target resets every Monday.</p>
            <p>Tip: Start with a realistic goal and increase it as you build consistency!</p>
          </div>
        </ion-accordion>

        <ion-accordion value="reminders">
          <ion-item slot="header">
            <ion-label>
              <h2>Practice Reminders</h2>
            </ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <p>Enable daily reminders in Settings to build a consistent practice habit.</p>
            <p><strong>Smart Reminders:</strong> Messages adapt based on your practice history</p>
            <p><strong>Streak Protection:</strong> Get a late reminder if you haven't practiced yet</p>
            <p>You can customize the reminder time to fit your schedule.</p>
          </div>
        </ion-accordion>

        <ion-accordion value="tools">
          <ion-item slot="header">
            <ion-label>
              <h2>Practice Tools</h2>
            </ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <p><strong>Metronome:</strong> Keep steady time with adjustable BPM and time signatures</p>
            <p><strong>Tuner:</strong> Tune your instrument with visual feedback</p>
            <p><strong>Pitch Finder:</strong> Identify notes as you play</p>
            <p><strong>Chord Charts:</strong> Reference library for guitar and piano chords</p>
          </div>
        </ion-accordion>

        <ion-accordion value="pro-features">
          <ion-item slot="header">
            <ion-label>
              <h2>Pro Features</h2>
            </ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <p>Upgrade to Pro to unlock:</p>
            <p>• 200+ chord charts</p>
            <p>• Save favorite chords</p>
            <p>• Advanced filters</p>
            <p>• Support ongoing development</p>
            <p>Check the upgrade prompt on the Home screen for current pricing.</p>
          </div>
        </ion-accordion>

        <ion-accordion value="data-privacy">
          <ion-item slot="header">
            <ion-label>
              <h2>Data & Privacy</h2>
            </ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <p>All your practice data is stored locally on your device.</p>
            <p>We don't collect or share your practice history, notes, or personal information.</p>
            <p>Microphone access (for tuner/pitch finder) is only used during those features and never recorded.</p>
          </div>
        </ion-accordion>

        <ion-accordion value="troubleshooting">
          <ion-item slot="header">
            <ion-label>
              <h2>Troubleshooting</h2>
            </ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <p><strong>Timer not starting?</strong> Make sure you've selected a practice category first.</p>
            <p><strong>Reminders not working?</strong> Check notification permissions in your device settings.</p>
            <p><strong>Tuner not responding?</strong> Grant microphone permission and ensure no other app is using the mic.</p>
            <p><strong>Lost progress?</strong> Data is stored locally - avoid clearing app data or reinstalling.</p>
          </div>
        </ion-accordion>
      </ion-accordion-group>
    </ion-content>
  `,
  styles: [`
    ion-accordion {
      margin-bottom: 8px;
    }

    ion-accordion h2 {
      font-weight: 600;
      font-size: 1rem;
    }

    ion-accordion div[slot="content"] {
      line-height: 1.6;
    }

    ion-accordion div[slot="content"] p {
      margin: 8px 0;
    }

    ion-accordion div[slot="content"] p:first-child {
      margin-top: 0;
    }

    ion-accordion div[slot="content"] p:last-child {
      margin-bottom: 0;
    }
  `]
})
export class HelpPage {}
