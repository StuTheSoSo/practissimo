import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { STORAGE_KEYS } from '../models/storage-keys.model';
import { ReminderSettings } from '../models/reminder-settings.model';
import { StorageService } from './storage.service';

interface LocalNotificationSchema {
  id: number;
  title: string;
  body: string;
  schedule?: {
    at?: Date;
    allowWhileIdle?: boolean;
  };
  channelId?: string;
  extra?: Record<string, unknown>;
}

interface LocalNotificationsPlugin {
  checkPermissions(): Promise<{ display: 'prompt' | 'prompt-with-rationale' | 'granted' | 'denied' }>;
  requestPermissions(): Promise<{ display: 'prompt' | 'prompt-with-rationale' | 'granted' | 'denied' }>;
  schedule(options: { notifications: LocalNotificationSchema[] }): Promise<void>;
  cancel(options: { notifications: Array<{ id: number }> }): Promise<void>;
  createChannel(options: {
    id: string;
    name: string;
    description?: string;
    importance?: number;
    visibility?: number;
  }): Promise<void>;
  addListener(
    eventName: 'localNotificationActionPerformed',
    listenerFunc: (event: { notification: { extra?: Record<string, unknown> } }) => void
  ): Promise<{ remove: () => Promise<void> }>;
}

const LocalNotifications = registerPlugin<LocalNotificationsPlugin>('LocalNotifications');

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly REMINDER_CHANNEL_ID = 'practice-reminders';
  private readonly REMINDER_BASE_ID = 71000;
  private readonly DAYS_TO_SCHEDULE = 14;

  private storage = inject(StorageService);
  private router = inject(Router);

  private reminderSettings = signal<ReminderSettings>({
    enabled: false,
    time: '19:00'
  });

  readonly settings = this.reminderSettings.asReadonly();
  readonly enabled = computed(() => this.reminderSettings().enabled);
  readonly reminderTime = computed(() => this.reminderSettings().time);
  readonly reminderTimeLabel = computed(() => this.toTimeLabel(this.reminderSettings().time));

  constructor() {
    effect(() => {
      this.storage.set(STORAGE_KEYS.REMINDER_SETTINGS, this.reminderSettings());
    });
  }

  async initialize(): Promise<void> {
    const saved = await this.storage.get<ReminderSettings>(STORAGE_KEYS.REMINDER_SETTINGS);
    if (saved) {
      this.reminderSettings.set({
        enabled: !!saved.enabled,
        time: this.isValidTime(saved.time) ? saved.time : '19:00'
      });
    }

    if (!Capacitor.isNativePlatform()) {
      return;
    }

    await this.ensureAndroidChannel();
    await this.registerListeners();
    await this.syncSchedule();
  }

  async setEnabled(enabled: boolean): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      this.reminderSettings.update(s => ({ ...s, enabled: false }));
      return false;
    }

    if (enabled) {
      const allowed = await this.requestPermission();
      if (!allowed) {
        this.reminderSettings.update(s => ({ ...s, enabled: false }));
        await this.clearReminderNotifications();
        return false;
      }
    }

    this.reminderSettings.update(s => ({ ...s, enabled }));
    await this.syncSchedule();
    return true;
  }

  async setReminderTime(time: string): Promise<void> {
    if (!this.isValidTime(time)) {
      return;
    }

    this.reminderSettings.update(s => ({
      ...s,
      time
    }));

    await this.syncSchedule();
  }

  async onPracticeCompleted(): Promise<void> {
    // Skip today's reminder once user has already practiced.
    if (!this.enabled()) return;
    await this.scheduleUpcomingReminders(true);
  }

  private async syncSchedule(): Promise<void> {
    if (!this.enabled()) {
      await this.clearReminderNotifications();
      return;
    }

    await this.scheduleUpcomingReminders(false);
  }

  private async requestPermission(): Promise<boolean> {
    try {
      const current = await LocalNotifications.checkPermissions();
      if (current.display === 'granted') {
        return true;
      }

      const requested = await LocalNotifications.requestPermissions();
      return requested.display === 'granted';
    } catch {
      return false;
    }
  }

  private async scheduleUpcomingReminders(skipToday: boolean): Promise<void> {
    await this.clearReminderNotifications();

    const [hours, minutes] = this.reminderTime()
      .split(':')
      .map(v => Number(v));
    const now = new Date();
    const notifications: LocalNotificationSchema[] = [];

    for (let dayOffset = 0; dayOffset < this.DAYS_TO_SCHEDULE; dayOffset++) {
      if (skipToday && dayOffset === 0) {
        continue;
      }

      const scheduledAt = new Date();
      scheduledAt.setDate(scheduledAt.getDate() + dayOffset);
      scheduledAt.setHours(hours, minutes, 0, 0);

      if (scheduledAt <= now) {
        continue;
      }

      notifications.push({
        id: this.REMINDER_BASE_ID + dayOffset,
        title: 'PracticeQuest Reminder',
        body: 'Time to practice and keep your streak alive.',
        schedule: { at: scheduledAt, allowWhileIdle: true },
        channelId: this.REMINDER_CHANNEL_ID,
        extra: {
          route: '/practice'
        }
      });
    }

    if (notifications.length === 0) {
      return;
    }

    try {
      await LocalNotifications.schedule({
        notifications
      });
    } catch {
      // Native plugin may not be installed yet.
    }
  }

  private async clearReminderNotifications(): Promise<void> {
    const notifications = Array.from({ length: this.DAYS_TO_SCHEDULE }, (_, index) => ({
      id: this.REMINDER_BASE_ID + index
    }));

    try {
      await LocalNotifications.cancel({ notifications });
    } catch {
      // Native plugin may not be installed yet.
    }
  }

  private async ensureAndroidChannel(): Promise<void> {
    try {
      await LocalNotifications.createChannel({
        id: this.REMINDER_CHANNEL_ID,
        name: 'Practice Reminders',
        description: 'Daily reminders to keep practicing',
        importance: 4,
        visibility: 1
      });
    } catch {
      // iOS or missing native plugin.
    }
  }

  private async registerListeners(): Promise<void> {
    try {
      await LocalNotifications.addListener('localNotificationActionPerformed', event => {
        const route = event.notification.extra?.['route'];
        if (typeof route === 'string' && route.length > 0) {
          void this.router.navigate([route]);
        }
      });
    } catch {
      // Native plugin may not be installed yet.
    }

    await App.addListener('appStateChange', state => {
      if (state.isActive) {
        void this.syncSchedule();
      }
    });
  }

  private isValidTime(time: string): boolean {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
  }

  private toTimeLabel(time: string): string {
    const [hours, minutes] = time.split(':').map(v => Number(v));
    const value = new Date();
    value.setHours(hours, minutes, 0, 0);
    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit'
    }).format(value);
  }
}
