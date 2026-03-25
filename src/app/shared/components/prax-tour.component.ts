import {
  Component,
  computed,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { MascotComponent } from './mascot.component';

interface TourStep {
  selector: string;
  message: string;
  mood: 'neutral' | 'happy' | 'celebrating';
}

const TOUR_STEPS: TourStep[] = [
  {
    selector: '.practice-hero',
    message: "This is your practice launchpad! Tap \"Start Practice\" whenever you're ready to play. 🎵",
    mood: 'happy',
  },
  {
    selector: '.stat-strip',
    message: "Your streak, level and weekly progress are always visible right here. Keep those numbers climbing! 🎶",
    mood: 'happy',
  },
  {
    selector: '.progress-card',
    message: 'Every session earns XP and levels you up. Watch both bars fill as you practice more! ⭐',
    mood: 'happy',
  },
  {
    selector: '.actions-grid',
    message: "Quests, Achievements, Chord Charts and more live here. Go explore — I'll be cheering you on! 🎉",
    mood: 'celebrating',
  },
];

@Component({
  selector: 'app-prax-tour',
  standalone: true,
  imports: [MascotComponent],
  template: `
    <div class="tour-overlay">
      @if (spotlightRect()) {
        <div class="tour-spotlight" [style]="spotlightStyle()"></div>
      }

      <div class="tour-bubble" [style]="bubblePositionStyle()">
        <div class="tour-bubble-mascot">
          <app-mascot [mood]="currentStep().mood" [size]="52"></app-mascot>
        </div>
        <div class="tour-bubble-body">
          <p class="tour-message">{{ currentStep().message }}</p>
          <div class="tour-actions">
            <button class="tour-skip" (click)="skip()">Skip tour</button>
            <button class="tour-next" (click)="next()">
              {{ isLastStep() ? "Let's go! 🎵" : 'Next →' }}
            </button>
          </div>
        </div>
      </div>

      <div class="tour-dots">
        @for (step of steps; track $index) {
          <div class="tour-dot" [class.active]="$index === currentStepIndex()"></div>
        }
      </div>
    </div>
  `,
  styles: [`
    .tour-overlay {
      position: fixed;
      inset: 0;
      z-index: 10000;
      pointer-events: all;
    }

    .tour-spotlight {
      position: fixed;
      border-radius: 12px;
      /* The enormous box-shadow creates the dark overlay everywhere except this element */
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.74);
      pointer-events: none;
      z-index: 10001;
      transition:
        left 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        top 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        width 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      outline: 2.5px solid rgba(84, 104, 255, 0.9);
      outline-offset: 3px;
      animation: spotlight-pulse 2s ease-in-out infinite;
    }

    @keyframes spotlight-pulse {
      0%, 100% { outline-color: rgba(84, 104, 255, 0.9); }
      50%       { outline-color: rgba(110, 164, 251, 0.4); }
    }

    .tour-bubble {
      position: fixed;
      left: 12px;
      right: 12px;
      z-index: 10002;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      background: linear-gradient(135deg, #141848 0%, #232b78 100%);
      border-radius: 20px;
      padding: 12px 14px 12px 8px;
      box-shadow:
        0 16px 48px rgba(0, 0, 0, 0.6),
        0 0 0 1.5px rgba(84, 104, 255, 0.55),
        inset 0 1px 0 rgba(255, 255, 255, 0.09);
      animation: bubble-in 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }

    @keyframes bubble-in {
      from { opacity: 0; transform: scale(0.86) translateY(14px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    .tour-bubble-mascot {
      flex-shrink: 0;
      margin-left: 6px;
      display: flex;
      align-items: center;
    }

    .tour-bubble-body {
      flex: 1;
      min-width: 0;
    }

    .tour-message {
      margin: 4px 0 10px;
      font-size: 0.875rem;
      font-weight: 650;
      color: rgba(255, 255, 255, 0.95);
      line-height: 1.5;
    }

    .tour-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .tour-skip {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.45);
      font-size: 0.8rem;
      cursor: pointer;
      padding: 4px 2px;
      text-decoration: underline;
      text-underline-offset: 2px;
    }

    .tour-next {
      background: linear-gradient(135deg, #5468ff, #7c8dff);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 8px 18px;
      font-size: 0.875rem;
      font-weight: 700;
      cursor: pointer;
      transition: filter 140ms ease, transform 140ms ease;
      box-shadow: 0 4px 14px rgba(84, 104, 255, 0.45);
    }

    .tour-next:hover  { filter: brightness(1.1); }
    .tour-next:active { transform: scale(0.97); }

    .tour-dots {
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10002;
      display: flex;
      gap: 7px;
      padding: 6px 10px;
      background: rgba(0, 0, 0, 0.35);
      border-radius: 999px;
    }

    .tour-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.28);
      transition: background 0.25s ease, transform 0.25s ease;
    }

    .tour-dot.active {
      background: #6ea4fb;
      transform: scale(1.35);
    }
  `],
})
export class PraxTourComponent implements OnInit, OnDestroy {
  @Output() completed = new EventEmitter<void>();

  readonly steps = TOUR_STEPS;
  currentStepIndex = signal(0);
  spotlightRect = signal<DOMRect | null>(null);

  currentStep = computed(() => this.steps[this.currentStepIndex()]);
  isLastStep = computed(() => this.currentStepIndex() === this.steps.length - 1);

  private stepTimerId: number | null = null;

  spotlightStyle = computed(() => {
    const rect = this.spotlightRect();
    if (!rect) return {};
    const pad = 8;
    return {
      left: `${rect.left - pad}px`,
      top: `${rect.top - pad}px`,
      width: `${rect.width + pad * 2}px`,
      height: `${rect.height + pad * 2}px`,
    };
  });

  bubblePositionStyle = computed(() => {
    const rect = this.spotlightRect();
    const pad = 8;
    const gap = 16;
    const approxBubbleH = 140;

    if (!rect) return { bottom: '32px' };

    const spBottom = rect.bottom + pad;
    const spTop = rect.top - pad;

    if (spBottom + approxBubbleH + gap < window.innerHeight - 16) {
      return { top: `${spBottom + gap}px` };
    } else {
      return { bottom: `${window.innerHeight - spTop + gap}px` };
    }
  });

  ngOnInit() {
    this.goToStep(0);
  }

  ngOnDestroy() {
    if (this.stepTimerId !== null) clearTimeout(this.stepTimerId);
  }

  @HostListener('window:resize')
  onResize() {
    this.measureStep(this.currentStepIndex());
  }

  private goToStep(index: number) {
    this.currentStepIndex.set(index);
    this.measureStep(index);
  }

  private measureStep(index: number) {
    const step = this.steps[index];
    const el = document.querySelector(step.selector);
    if (!el) {
      this.spotlightRect.set(null);
      return;
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (this.stepTimerId !== null) clearTimeout(this.stepTimerId);
    this.stepTimerId = window.setTimeout(() => {
      this.spotlightRect.set(el.getBoundingClientRect());
    }, 420);
  }

  next() {
    if (this.isLastStep()) {
      this.finish();
    } else {
      this.goToStep(this.currentStepIndex() + 1);
    }
  }

  skip() {
    this.finish();
  }

  private finish() {
    localStorage.setItem('prax_tour_v1_done', '1');
    this.completed.emit();
  }
}
