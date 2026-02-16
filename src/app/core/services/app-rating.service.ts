import { Injectable, inject } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { AlertController } from '@ionic/angular/standalone';
import { environment } from '../../../environments/environment';
import { STORAGE_KEYS } from '../models/storage-keys.model';
import { StorageService } from './storage.service';

interface AppRatingState {
  launchCount: number;
  promptCount: number;
  lastPromptedAt: string | null;
  lastPromptLaunchCount: number;
  neverAskAgain: boolean;
  hasRated: boolean;
}

const DEFAULT_STATE: AppRatingState = {
  launchCount: 0,
  promptCount: 0,
  lastPromptedAt: null,
  lastPromptLaunchCount: 0,
  neverAskAgain: false,
  hasRated: false
};

const FIRST_PROMPT_MIN_LAUNCHES = 8;
const REPEAT_PROMPT_EVERY_LAUNCHES = 15;
const PROMPT_COOLDOWN_DAYS = 21;

@Injectable({
  providedIn: 'root'
})
export class AppRatingService {
  private storage = inject(StorageService);
  private alertController = inject(AlertController);
  private promptInProgress = false;

  async maybePromptForRating(): Promise<void> {
    if (!this.isNativeMobile()) return;
    if (this.promptInProgress) return;

    const state = await this.getState();
    if (state.neverAskAgain || state.hasRated) return;

    state.launchCount += 1;
    await this.saveState(state);

    if (!this.shouldPrompt(state)) return;

    this.promptInProgress = true;
    try {
      await this.presentRatingPrompt(state);
    } finally {
      this.promptInProgress = false;
    }
  }

  private async presentRatingPrompt(state: AppRatingState): Promise<void> {
    const updatedState: AppRatingState = {
      ...state,
      promptCount: state.promptCount + 1,
      lastPromptedAt: new Date().toISOString(),
      lastPromptLaunchCount: state.launchCount
    };
    await this.saveState(updatedState);

    const alert = await this.alertController.create({
      header: 'Enjoying PracticeQuest?',
      message: 'Would you mind leaving a quick rating?',
      buttons: [
        {
          text: 'Never',
          role: 'cancel',
          handler: () => {
            void this.updateState(s => ({ ...s, neverAskAgain: true }));
          }
        },
        {
          text: 'Maybe Later',
          role: 'cancel'
        },
        {
          text: 'Rate App',
          handler: () => {
            void this.handleRateNow();
          }
        }
      ]
    });

    await alert.present();
  }

  private async handleRateNow(): Promise<void> {
    await this.updateState(s => ({ ...s, hasRated: true }));
    this.openStoreRatingPage();
  }

  private openStoreRatingPage(): void {
    const platform = Capacitor.getPlatform();
    if (platform === 'ios') {
      const appStoreId = environment.appRating?.iosAppStoreId;
      if (!appStoreId) return;
      window.open(`https://apps.apple.com/app/id${appStoreId}?action=write-review`, '_blank');
      return;
    }

    if (platform === 'android') {
      const packageName = environment.appRating?.androidPackageName ?? 'com.practissimo.app';
      window.open(`https://play.google.com/store/apps/details?id=${packageName}`, '_blank');
    }
  }

  private shouldPrompt(state: AppRatingState): boolean {
    if (state.launchCount < FIRST_PROMPT_MIN_LAUNCHES) return false;

    if (state.promptCount > 0) {
      const launchesSinceLastPrompt = state.launchCount - state.lastPromptLaunchCount;
      if (launchesSinceLastPrompt < REPEAT_PROMPT_EVERY_LAUNCHES) return false;
    }

    if (!state.lastPromptedAt) return true;

    const lastPromptTime = new Date(state.lastPromptedAt).getTime();
    if (Number.isNaN(lastPromptTime)) return true;

    const cooldownMs = PROMPT_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
    return Date.now() - lastPromptTime >= cooldownMs;
  }

  private isNativeMobile(): boolean {
    const platform = Capacitor.getPlatform();
    return platform === 'ios' || platform === 'android';
  }

  private async getState(): Promise<AppRatingState> {
    const stored = await this.storage.get<AppRatingState>(STORAGE_KEYS.APP_RATING_STATE);
    return { ...DEFAULT_STATE, ...(stored ?? {}) };
  }

  private async saveState(state: AppRatingState): Promise<void> {
    await this.storage.set(STORAGE_KEYS.APP_RATING_STATE, state);
  }

  private async updateState(updateFn: (state: AppRatingState) => AppRatingState): Promise<void> {
    const state = await this.getState();
    await this.saveState(updateFn(state));
  }
}
