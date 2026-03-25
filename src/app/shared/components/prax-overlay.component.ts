import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MascotComponent } from './mascot.component';

@Component({
  selector: 'app-prax-overlay',
  standalone: true,
  imports: [MascotComponent],
  template: `
    <div class="prax-toast" role="status" aria-live="polite">
      <div class="prax-toast-mascot">
        <app-mascot [mood]="mood" [size]="48"></app-mascot>
      </div>
      <p class="prax-toast-message">{{ message }}</p>
      <button class="prax-toast-close" (click)="dismissed.emit()" aria-label="Dismiss Prax">×</button>
    </div>
  `,
  styles: [`
    .prax-toast {
      position: fixed;
      bottom: 28px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 10px;
      width: min(92vw, 390px);
      padding: 10px 12px 10px 8px;
      border-radius: 22px;
      background: linear-gradient(135deg, #141848 0%, #232b78 100%);
      box-shadow:
        0 10px 36px rgba(0, 0, 0, 0.45),
        0 0 0 1.5px rgba(84, 104, 255, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.09);
      animation: prax-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }

    @keyframes prax-in {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(36px) scale(0.88);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0) scale(1);
      }
    }

    .prax-toast-mascot {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      /* offset the always-visible ♪ note that floats outside SVG bounds */
      margin-left: 8px;
    }

    .prax-toast-message {
      flex: 1;
      margin: 0;
      font-size: 0.875rem;
      font-weight: 650;
      color: rgba(255, 255, 255, 0.95);
      line-height: 1.45;
    }

    .prax-toast-close {
      flex-shrink: 0;
      align-self: flex-start;
      background: rgba(255, 255, 255, 0.13);
      border: none;
      border-radius: 50%;
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.8);
      font-size: 1.05rem;
      line-height: 1;
      padding: 0;
      margin-top: 1px;
      transition: background 160ms ease;
    }

    .prax-toast-close:hover {
      background: rgba(255, 255, 255, 0.25);
    }
  `]
})
export class PraxOverlayComponent {
  @Input() message = '';
  @Input() mood: 'neutral' | 'happy' | 'celebrating' = 'neutral';
  @Output() dismissed = new EventEmitter<void>();
}
