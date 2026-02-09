// src/app/core/services/keep-awake.service.ts
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { KeepAwake } from '@capacitor-community/keep-awake';

@Injectable({
  providedIn: 'root'
})
export class KeepAwakeService {
  private wakeLock: any | null = null;
  private isActive = false;
  private readonly visibilityHandler = () => this.handleVisibilityChange();

  constructor() {
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  async keepAwake(): Promise<void> {
    if (this.isActive) return;
    this.isActive = true;

    const platform = Capacitor.getPlatform();
    if (platform !== 'web') {
      try {
        await KeepAwake.keepAwake();
        return;
      } catch {
        // Fall back to web wake lock when possible.
      }
    }

    await this.requestWebWakeLock();
  }

  async allowSleep(): Promise<void> {
    if (!this.isActive) return;
    this.isActive = false;

    const platform = Capacitor.getPlatform();
    if (platform !== 'web') {
      try {
        await KeepAwake.allowSleep();
      } catch {
        // Ignore and still release web wake lock if present.
      }
    }

    await this.releaseWebWakeLock();
  }

  private async requestWebWakeLock(): Promise<void> {
    const wakeLock = (navigator as any).wakeLock;
    if (!wakeLock?.request) return;

    try {
      this.wakeLock = await wakeLock.request('screen');
    } catch {
      // Some browsers require a user gesture; ignore.
    }
  }

  private async releaseWebWakeLock(): Promise<void> {
    if (!this.wakeLock) return;

    try {
      await this.wakeLock.release();
    } catch {
      // Ignore release errors.
    } finally {
      this.wakeLock = null;
    }
  }

  private handleVisibilityChange(): void {
    if (document.visibilityState !== 'visible') return;

    if (this.isActive) {
      void this.requestWebWakeLock();
    }
  }
}
