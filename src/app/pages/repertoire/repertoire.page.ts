import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonProgressBar,
  IonSegment,
  IonSegmentButton,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  archive,
  chevronForward,
  create,
  trash,
  checkmark,
  musicalNote
} from 'ionicons/icons';
import { RepertoireService } from '../../core/services/repertoire.service';
import { InstrumentService } from '../../core/services/instrument.service';
import { RepertoireStatus } from '../../core/models/repertoire-item.model';

@Component({
  selector: 'app-repertoire',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Repertoire</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="addNewItem()">
            <ion-icon name="add" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="repertoire-container">
        <!-- Segment Control for Status Filters -->
        <ion-segment
          [value]="selectedStatus()"
          (ionChange)="onStatusChange($event)"
          class="status-filter"
        >
          <ion-segment-button value="Learning">
            <ion-label>Learning ({{ learningCount() }})</ion-label>
          </ion-segment-button>
          <ion-segment-button value="Polishing">
            <ion-label>Polishing ({{ polishingCount() }})</ion-label>
          </ion-segment-button>
          <ion-segment-button value="Ready">
            <ion-label>Ready ({{ readyCount() }})</ion-label>
          </ion-segment-button>
          <ion-segment-button value="Archived">
            <ion-label>Archived ({{ archivedCount() }})</ion-label>
          </ion-segment-button>
        </ion-segment>

        <!-- Empty State -->
        @if (filteredItems().length === 0) {
          <ion-card class="empty-state">
            <ion-card-content>
              <ion-icon name="musical-note"></ion-icon>
              <p>
                @switch (selectedStatus()) {
                  @case ('Learning') {
                    No items you're learning yet. Add a piece below!
                  }
                  @case ('Polishing') {
                    No items in the polishing stage yet.
                  }
                  @case ('Ready') {
                    No items ready to perform yet.
                  }
                  @case ('Archived') {
                    No archived items.
                  }
                }
              </p>
              <ion-button (click)="addNewItem()" expand="block">
                <ion-icon name="add" slot="start"></ion-icon>
                Add Repertoire Item
              </ion-button>
            </ion-card-content>
          </ion-card>
        }

        <!-- Items List -->
        @for (item of filteredItems(); track item.id) {
          <ion-card class="repertoire-card" [class.ready]="item.status === 'Ready'">
            <ion-card-header>
              <ion-card-title>
                <div class="title-row">
                  <div>
                    <h2>{{ item.title }}</h2>
                    @if (item.composer) {
                      <p class="composer">by {{ item.composer }}</p>
                    }
                  </div>
                  <ion-badge [color]="statusColor(item.status)">
                    {{ item.status }}
                  </ion-badge>
                </div>
              </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <div class="item-details">
                <!-- Practice Info -->
                <div class="detail-row">
                  <span class="label">Practiced:</span>
                  @if (item.lastPracticed) {
                    <span>{{ daysAgo(item.lastPracticed) }} days ago</span>
                  } @else {
                    <span class="text-muted">Not yet</span>
                  }
                </div>

                <div class="detail-row">
                  <span class="label">Sessions:</span>
                  <span>{{ item.practiceCount }}</span>
                </div>

                <!-- Tempo Tracking -->
                @if (item.targetTempo) {
                  <div class="detail-row">
                    <span class="label">Tempo:</span>
                    <span>
                      {{ item.currentTempo || 0 }} / {{ item.targetTempo }} BPM
                      @if (item.currentTempo && item.targetTempo) {
                        <ion-progress-bar
                          [value]="item.currentTempo / item.targetTempo"
                          class="inline-progress"
                        ></ion-progress-bar>
                      }
                    </span>
                  </div>
                }

                <!-- Notes -->
                @if (item.notes) {
                  <div class="detail-row notes">
                    <span class="label">Notes:</span>
                    <p>{{ item.notes }}</p>
                  </div>
                }
              </div>

              <!-- Actions -->
              <div class="actions-row">
                @if (selectedStatus() !== 'Archived') {
                  @if (item.status !== 'Ready') {
                    <ion-button size="small" fill="outline" (click)="promoteStatus(item.id, item.status)">
                      <ion-icon name="checkmark" slot="start"></ion-icon>
                      {{ promotionLabel(item.status) }}
                    </ion-button>
                  }
                  <ion-button size="small" fill="outline" (click)="editItem(item)">
                    <ion-icon name="create" slot="start"></ion-icon>
                    Edit
                  </ion-button>
                  <ion-button size="small" fill="outline" color="warning" (click)="archiveItem(item.id)">
                    <ion-icon name="archive" slot="start"></ion-icon>
                    Archive
                  </ion-button>
                } @else {
                  <ion-button size="small" fill="outline" color="success" (click)="restoreItem(item.id)">
                    <ion-icon name="checkmark" slot="start"></ion-icon>
                    Restore
                  </ion-button>
                }

                <ion-button size="small" color="danger" fill="clear" (click)="deleteItem(item.id)">
                  <ion-icon name="trash"></ion-icon>
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        }

        <!-- Add New Item Button (Floating) -->
        @if (filteredItems().length > 0) {
          <div style="height: 60px;"></div>
        }
      </div>

      <!-- Floating Action Button Style -->
      <div class="fab-button">
        <ion-button (click)="addNewItem()" shape="round" size="large" color="primary">
          <ion-icon name="add" slot="icon-only"></ion-icon>
        </ion-button>
      </div>
    </ion-content>
  `,
  styles: [`
    .repertoire-container {
      padding-bottom: 80px;
    }

    .status-filter {
      margin-bottom: 20px;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;

      ion-icon {
        font-size: 60px;
        color: var(--ion-color-medium);
        display: block;
        margin-bottom: 20px;
      }

      p {
        margin-bottom: 20px;
        color: var(--ion-color-medium-shade);
      }
    }

    .repertoire-card {
      margin-bottom: 16px;
      border-left: 4px solid var(--ion-color-warning);

      &.ready {
        border-left-color: var(--ion-color-success);
        background: var(--ion-color-success) url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="white" opacity="0.05"/></svg>');
      }
    }

    .title-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;

      h2 {
        margin: 8px 0 0;
      }

      ion-badge {
        flex-shrink: 0;
        margin-top: 8px;
      }
    }

    .composer {
      font-size: 13px;
      color: var(--ion-color-medium);
      margin: 4px 0 0;
      font-style: italic;
    }

    .item-details {
      margin: 16px 0;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      font-size: 14px;
      border-bottom: 1px solid var(--ion-color-light);

      &:last-child {
        border-bottom: none;
      }

      .label {
        font-weight: 600;
        color: var(--ion-color-medium-shade);
      }

      .text-muted {
        color: var(--ion-color-medium);
        font-style: italic;
      }

      &.notes {
        flex-direction: column;
        align-items: flex-start;

        p {
          margin: 8px 0 0;
          font-size: 13px;
          color: var(--ion-color-medium);
        }
      }
    }

    .inline-progress {
      height: 4px;
      margin: 4px 0 0;
      border-radius: 2px;
    }

    .actions-row {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      flex-wrap: wrap;

      ion-button {
        --padding-start: 8px;
        --padding-end: 8px;
      }
    }

    .fab-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 100;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonLabel,
    IonBadge,
    IonProgressBar,
    IonSegment,
    IonSegmentButton
  ]
})
export class RepertoirePage {
  private repertoireService = inject(RepertoireService);
  private instrumentService = inject(InstrumentService);
  private alertController = inject(AlertController);

  selectedStatus = signal<RepertoireStatus>('Learning');

  learningCount = computed(() => this.repertoireService.learningItems().length);
  polishingCount = computed(() => this.repertoireService.polishingItems().length);
  readyCount = computed(() => this.repertoireService.readyItems().length);
  archivedCount = computed(() => this.repertoireService.archivedItems().length);

  filteredItems = computed(() => {
    const status = this.selectedStatus();
    if (status === 'Archived') {
      return this.repertoireService.archivedItems();
    }
    return this.repertoireService.currentInstrumentItems().filter(
      item => item.status === status
    );
  });

  constructor() {
    addIcons({
      add,
      archive,
      chevronForward,
      create,
      trash,
      checkmark,
      musicalNote
    });
  }

  onStatusChange(event: any): void {
    const value = event.detail.value as RepertoireStatus;
    if (value) {
      this.selectedStatus.set(value);
    }
  }

  async addNewItem(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Add Repertoire Item',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Piece/Exercise name',
          attributes: { required: true }
        },
        {
          name: 'composer',
          type: 'text',
          placeholder: 'Composer (optional)'
        },
        {
          name: 'targetTempo',
          type: 'number',
          placeholder: 'Target BPM (optional)'
        },
        {
          name: 'notes',
          type: 'textarea',
          placeholder: 'Notes (optional)'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: (data) => {
            if (!data.title || data.title.trim() === '') {
              return false;
            }
            this.repertoireService.addItem(
              data.title.trim(),
              this.instrumentService.currentInstrument(),
              data.composer?.trim(),
              data.notes?.trim(),
              data.targetTempo ? parseInt(data.targetTempo) : undefined
            );
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async editItem(item: any): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Edit Repertoire Item',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Piece/Exercise name',
          value: item.title
        },
        {
          name: 'composer',
          type: 'text',
          placeholder: 'Composer (optional)',
          value: item.composer || ''
        },
        {
          name: 'targetTempo',
          type: 'number',
          placeholder: 'Target BPM (optional)',
          value: item.targetTempo || ''
        },
        {
          name: 'currentTempo',
          type: 'number',
          placeholder: 'Current BPM (optional)',
          value: item.currentTempo || ''
        },
        {
          name: 'notes',
          type: 'textarea',
          placeholder: 'Notes (optional)',
          value: item.notes || ''
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: (data) => {
            if (!data.title || data.title.trim() === '') {
              return false;
            }
            this.repertoireService.updateItem(item.id, {
              title: data.title.trim(),
              composer: data.composer?.trim(),
              targetTempo: data.targetTempo ? parseInt(data.targetTempo) : undefined,
              currentTempo: data.currentTempo ? parseInt(data.currentTempo) : undefined,
              notes: data.notes?.trim()
            });
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  promoteStatus(itemId: string, currentStatus: RepertoireStatus): void {
    const nextStatus: Record<RepertoireStatus, RepertoireStatus> = {
      'Learning': 'Polishing',
      'Polishing': 'Ready',
      'Ready': 'Ready',
      'Archived': 'Learning'
    };

    this.repertoireService.updateStatus(itemId, nextStatus[currentStatus]);
  }

  promotionLabel(status: RepertoireStatus): string {
    const labels: Record<RepertoireStatus, string> = {
      'Learning': 'Move to Polishing',
      'Polishing': 'Mark Ready',
      'Ready': 'Ready',
      'Archived': 'Restore'
    };
    return labels[status];
  }

  statusColor(status: RepertoireStatus): string {
    const colors: Record<RepertoireStatus, string> = {
      'Learning': 'warning',
      'Polishing': 'primary',
      'Ready': 'success',
      'Archived': 'medium'
    };
    return colors[status];
  }

  async deleteItem(itemId: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Delete Item',
      message: 'Are you sure? This cannot be undone.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.repertoireService.deleteItem(itemId)
        }
      ]
    });

    await alert.present();
  }

  archiveItem(itemId: string): void {
    this.repertoireService.archiveItem(itemId);
  }

  restoreItem(itemId: string): void {
    this.repertoireService.restoreFromArchive(itemId);
  }

  daysAgo(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }
}
