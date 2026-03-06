import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AlertController,
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonProgressBar,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  archive,
  checkmarkCircle,
  create,
  pauseCircle,
  sparkles,
  trash,
  trendingUp
} from 'ionicons/icons';
import { GOAL_TEMPLATES } from '../../core/config/goal-templates.config';
import { Goal, GoalPriority, GoalTemplate } from '../../core/models/goal.model';
import { GoalsService } from '../../core/services/goals.service';

@Component({
  selector: 'app-goals',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Goals</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="addGoal()">
            <ion-icon name="add" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="goals-container">
        <ion-button expand="block" (click)="addGoal()">
          <ion-icon name="add" slot="start"></ion-icon>
          Add Goal
        </ion-button>
        <ion-card>
          <ion-card-header>
            <ion-card-title>
              <ion-icon name="trending-up"></ion-icon>
              Active Goals ({{ activeGoals().length }})
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            @if (activeGoals().length === 0) {
              <p class="empty-state">No active goals yet. Add your first goal to start tracking progress.</p>
            } @else {
              <ion-list>
                @for (goal of activeGoals(); track goal.id) {
                  <ion-item>
                    <ion-label>
                      <h3>{{ goal.title }}</h3>
                      @if (goal.description) {
                        <p>{{ goal.description }}</p>
                      }
                      <p>
                        <ion-badge [color]="priorityColor(goal.priority)">{{ goal.priority }}</ion-badge>
                        @if (goal.dueDate) {
                          <span class="meta-pill">Due {{ formatDate(goal.dueDate) }}</span>
                        }
                      </p>

                      @if (goal.metric) {
                        <p>{{ goal.metric.currentValue }} / {{ goal.metric.targetValue }} {{ goal.metric.unit }}</p>
                        <ion-progress-bar [value]="metricProgress(goal)"></ion-progress-bar>
                      }
                    </ion-label>
                  </ion-item>
                  <div class="actions-row">
                    <ion-button size="small" fill="outline" (click)="editGoal(goal)">
                      <ion-icon name="create" slot="start"></ion-icon>
                      Edit
                    </ion-button>
                    @if (goal.metric) {
                      <ion-button size="small" fill="outline" color="success" (click)="updateMetricProgress(goal)">
                        Update Progress
                      </ion-button>
                    }
                    <ion-button size="small" color="success" (click)="completeGoal(goal)">
                      <ion-icon name="checkmark-circle" slot="start"></ion-icon>
                      Complete
                    </ion-button>
                    <ion-button size="small" fill="clear" color="medium" (click)="archiveGoal(goal)">
                      <ion-icon name="archive" slot="start"></ion-icon>
                      Archive
                    </ion-button>
                  </div>
                }
              </ion-list>
            }
          </ion-card-content>
        </ion-card>

        

        @if (suggestedGoals().length > 0) {
          <ion-card>
            <ion-card-header>
              <ion-card-title>
                <ion-icon name="sparkles"></ion-icon>
                Suggested Goals ({{ suggestedGoals().length }})
              </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-list>
                @for (goal of suggestedGoals(); track goal.id) {
                  <ion-item>
                    <ion-label>
                      <h3>{{ goal.title }}</h3>
                      @if (goal.description) {
                        <p>{{ goal.description }}</p>
                      }
                      <p>{{ suggestionReasonLabel(goal) }}</p>
                      @if (goal.metric) {
                        <p>{{ goal.metric.targetValue }} {{ goal.metric.unit }} target</p>
                      }
                    </ion-label>
                  </ion-item>
                  <div class="actions-row">
                    <ion-button size="small" (click)="acceptSuggestion(goal)">
                      <ion-icon name="checkmark-circle" slot="start"></ion-icon>
                      Accept
                    </ion-button>
                    <ion-button size="small" fill="outline" color="medium" (click)="snoozeSuggestion(goal)">
                      <ion-icon name="pause-circle" slot="start"></ion-icon>
                      Snooze
                    </ion-button>
                    <ion-button size="small" fill="clear" color="danger" (click)="dismissSuggestion(goal)">
                      <ion-icon name="trash" slot="start"></ion-icon>
                      Dismiss
                    </ion-button>
                  </div>
                }
              </ion-list>
            </ion-card-content>
          </ion-card>
        }

        
        <ion-card>
          <ion-card-header>
            <ion-card-title>Completed Goals ({{ completedGoals().length }})</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            @if (completedGoals().length === 0) {
              <p class="empty-state">Completed goals will appear here.</p>
            } @else {
              <ion-list>
                @for (goal of completedGoals(); track goal.id) {
                  <ion-item>
                    <ion-label>
                      <h3>{{ goal.title }}</h3>
                      <p>Completed {{ formatDate(goal.updatedAt) }}</p>
                    </ion-label>
                  </ion-item>
                }
              </ion-list>
            }
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .goals-container {
      max-width: 700px;
      margin: 0 auto;
    }

    ion-card-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .actions-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding: 0.25rem 0 1rem;
    }

    .empty-state {
      color: var(--ion-color-medium);
      text-align: center;
      padding: 0.75rem 0;
    }

    ion-list {
      padding: 0;
    }

    ion-item {
      --padding-start: 0;
      --inner-padding-end: 0;
    }

    .meta-pill {
      margin-left: 0.5rem;
      color: var(--ion-color-medium);
      font-size: 0.85rem;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonBackButton,
    IonBadge,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonProgressBar,
    IonTitle,
    IonToolbar
  ]
})
export class GoalsPage {
  private alertController = inject(AlertController);
  private goalsService = inject(GoalsService);

  activeGoals = this.goalsService.activeGoals;
  completedGoals = this.goalsService.completedGoals;
  suggestedGoals = this.goalsService.suggestedGoalsQueue;
  overdueGoals = this.goalsService.overdueGoals;

  hasOverdueGoals = computed(() => this.overdueGoals().length > 0);

  constructor() {
    addIcons({ add, archive, checkmarkCircle, create, pauseCircle, sparkles, trash, trendingUp });
  }

  async addGoal(): Promise<void> {
    const type = await this.promptGoalType();
    if (!type) {
      return;
    }

    if (type === 'template') {
      await this.addTemplateGoal();
      return;
    }

    await this.addFreeFormGoal();
  }

  async editGoal(goal: Goal): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Edit Goal',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Goal title',
          value: goal.title
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Description',
          value: goal.description || ''
        },
        {
          name: 'dueDate',
          type: 'date',
          value: goal.dueDate ? goal.dueDate.slice(0, 10) : ''
        }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: (data: { title: string; description: string; dueDate: string }) => {
            const title = (data.title || '').trim();
            if (!title) {
              return false;
            }

            this.goalsService.updateGoal(goal.id, {
              title,
              description: data.description?.trim() || undefined,
              dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined
            });

            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async updateMetricProgress(goal: Goal): Promise<void> {
    if (!goal.metric) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Update Progress',
      message: `${goal.title}: ${goal.metric.currentValue} / ${goal.metric.targetValue} ${goal.metric.unit}`,
      inputs: [
        {
          name: 'progress',
          type: 'number',
          value: goal.metric.currentValue,
          min: 0,
          max: goal.metric.targetValue
        }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: (data: { progress: string }) => {
            const value = Number(data.progress);
            if (!Number.isFinite(value)) {
              return false;
            }
            this.goalsService.setMetricProgress(goal.id, value);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  completeGoal(goal: Goal): void {
    this.goalsService.completeGoal(goal.id);
  }

  archiveGoal(goal: Goal): void {
    this.goalsService.archiveGoal(goal.id);
  }

  acceptSuggestion(goal: Goal): void {
    this.goalsService.acceptSuggestion(goal.id);
  }

  dismissSuggestion(goal: Goal): void {
    this.goalsService.dismissSuggestion(goal.id);
  }

  snoozeSuggestion(goal: Goal): void {
    this.goalsService.snoozeSuggestion(goal.id, 3);
  }

  metricProgress(goal: Goal): number {
    if (!goal.metric || goal.metric.targetValue <= 0) {
      return 0;
    }

    return Math.min(1, Math.max(0, goal.metric.currentValue / goal.metric.targetValue));
  }

  priorityColor(priority: GoalPriority): string {
    if (priority === 'high') return 'danger';
    if (priority === 'low') return 'medium';
    return 'primary';
  }

  suggestionReasonLabel(goal: Goal): string {
    if (goal.suggestionReason === 'neglected_category') {
      return 'Suggested because this category has been neglected recently.';
    }

    if (goal.suggestionReason === 'consistency_gap') {
      return 'Suggested to improve your consistency pattern.';
    }

    if (goal.suggestionReason === 'short_sessions') {
      return 'Suggested to increase average session depth.';
    }

    return 'Suggested from your practice analytics.';
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleDateString();
  }

  private async promptGoalType(): Promise<'template' | 'free-form' | null> {
    let selectedType: 'template' | 'free-form' = 'template';
    const alert = await this.alertController.create({
      header: 'Create Goal',
      inputs: [
        {
          type: 'radio',
          label: 'Template Goal',
          value: 'template',
          checked: true
        },
        {
          type: 'radio',
          label: 'Free-Form Goal',
          value: 'free-form'
        }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Next',
          handler: (value: 'template' | 'free-form') => {
            selectedType = value || 'template';
            return true;
          }
        }
      ]
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    if (result.role === 'cancel') {
      return null;
    }

    return selectedType;
  }

  private async addTemplateGoal(): Promise<void> {
    const template = await this.promptTemplate();
    if (!template) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Template Goal Details',
      inputs: [
        {
          name: 'title',
          type: 'text',
          value: template.title,
          placeholder: 'Goal title'
        },
        {
          name: 'target',
          type: 'number',
          value: template.metric.defaultTarget,
          min: 1
        },
        {
          name: 'dueDate',
          type: 'date'
        }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Create',
          handler: (data: { title: string; target: string; dueDate: string }) => {
            const title = (data.title || '').trim();
            const target = Number(data.target);
            if (!title || !Number.isFinite(target) || target <= 0) {
              return false;
            }

            this.goalsService.createGoal({
              title,
              description: template.description,
              priority: 'medium',
              dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
              metric: {
                type: template.metric.type,
                unit: template.metric.unit,
                targetValue: target,
                currentValue: 0
              }
            });
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  private async addFreeFormGoal(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'New Goal',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Goal title'
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'What outcome do you want?'
        },
        {
          name: 'dueDate',
          type: 'date'
        }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Create',
          handler: (data: { title: string; description: string; dueDate: string }) => {
            const title = (data.title || '').trim();
            if (!title) {
              return false;
            }

            this.goalsService.createGoal({
              title,
              description: data.description?.trim() || undefined,
              dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
              priority: 'medium'
            });
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  private async promptTemplate(): Promise<GoalTemplate | null> {
    let selectedTemplateId = GOAL_TEMPLATES[0]?.id || '';
    const alert = await this.alertController.create({
      header: 'Choose Template',
      inputs: GOAL_TEMPLATES.map((template, index) => ({
        type: 'radio' as const,
        label: `${template.title} (${template.metric.defaultTarget} ${template.metric.unit})`,
        value: template.id,
        checked: index === 0
      })),
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Select',
          handler: (value: string) => {
            selectedTemplateId = value || selectedTemplateId;
            return true;
          }
        }
      ]
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    if (result.role === 'cancel') {
      return null;
    }

    return GOAL_TEMPLATES.find(template => template.id === selectedTemplateId) || null;
  }
}
