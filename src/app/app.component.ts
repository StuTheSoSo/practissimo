// src/app/app.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StorageService } from './core/services/storage.service';
import { InstrumentService } from './core/services/instrument.service';
import { GamificationService } from './core/services/gamification.service';
import { PracticeService } from './core/services/practice.service';
import { QuestService } from './core/services/quest.service';
import { AchievementService } from './core/services/achievement.service';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
  standalone: true,
  imports: [IonApp, IonRouterOutlet]
})
export class AppComponent implements OnInit {
  private storage = inject(StorageService);
  private instrumentService = inject(InstrumentService);
  private gamificationService = inject(GamificationService);
  private practiceService = inject(PracticeService);
  private questService = inject(QuestService);
  private achievementService = inject(AchievementService);

  async ngOnInit() {
    // Initialize storage first
    await this.storage.init();

    // Initialize all services
    await Promise.all([
      this.instrumentService.initialize(),
      this.gamificationService.initialize(),
      this.practiceService.initialize(),
      this.questService.initialize(),
      this.achievementService.initialize()
    ]);
  }
}
