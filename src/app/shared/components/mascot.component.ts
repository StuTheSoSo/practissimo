import { Component, Input } from '@angular/core';

type Mood = 'neutral' | 'happy' | 'celebrating';

@Component({
  selector: 'app-mascot',
  standalone: true,
  imports: [],
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 60"
      [attr.width]="size"
      [attr.height]="size"
      [class.mascot-celebrating]="mood === 'celebrating'"
      [class.mascot-happy]="mood === 'happy'"
      aria-hidden="true"
      overflow="visible"
    >
      <!-- Floating ♪ note (always visible) -->
      <text x="-6" y="20" font-size="13" fill="#6ea4fb" opacity="0.65"
            font-family="Georgia, 'Times New Roman', serif">♪</text>

      @if (mood === 'celebrating') {
        <text x="58" y="18" font-size="11" fill="#f6b24a" opacity="0.9"
              font-family="Georgia, 'Times New Roman', serif">♫</text>
        <text x="55" y="7" font-size="9" fill="#a78bfa" opacity="0.75"
              font-family="Georgia, 'Times New Roman', serif">♩</text>
      }

      <!-- Headphone band -->
      <path d="M 10 24 Q 30 5 50 24" stroke="#1e2555" stroke-width="3.5" fill="none" stroke-linecap="round"/>

      <!-- Left studio headphone cup -->
      <circle cx="8" cy="26" r="7" fill="#1e2555"/>
      <circle cx="8" cy="26" r="5" fill="#374080"/>
      <!-- Vinyl record center -->
      <circle cx="8" cy="26" r="2.2" fill="#5468ff"/>
      <circle cx="8" cy="26" r="0.9" fill="#1e2555"/>

      <!-- Right studio headphone cup -->
      <circle cx="52" cy="26" r="7" fill="#1e2555"/>
      <circle cx="52" cy="26" r="5" fill="#374080"/>
      <circle cx="52" cy="26" r="2.2" fill="#5468ff"/>
      <circle cx="52" cy="26" r="0.9" fill="#1e2555"/>

      <!-- Robot head -->
      <rect x="13" y="13" width="34" height="23" rx="6" fill="#5468ff"/>

      <!-- Antenna stem -->
      <line x1="30" y1="13" x2="30" y2="5" stroke="#1e2555" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Quarter-note head on antenna (tilted oval = ♩ head) -->
      <ellipse cx="32.5" cy="3.5" rx="4.2" ry="2.8" fill="#f6b24a" transform="rotate(-22 32.5 3.5)"/>

      <!-- Left eye -->
      <ellipse cx="22" cy="23" rx="4.2" [attr.ry]="eyeRy" fill="white"/>
      <ellipse cx="22" cy="24" rx="2.3" [attr.ry]="pupilRy" fill="#0f0f2e"/>
      <circle cx="23.8" cy="21.8" r="1.1" fill="white" opacity="0.65"/>

      <!-- Right eye -->
      <ellipse cx="38" cy="23" rx="4.2" [attr.ry]="eyeRy" fill="white"/>
      <ellipse cx="38" cy="24" rx="2.3" [attr.ry]="pupilRy" fill="#0f0f2e"/>
      <circle cx="39.8" cy="21.8" r="1.1" fill="white" opacity="0.65"/>

      <!-- Mouth -->
      <path [attr.d]="mouthPath" stroke="white" stroke-width="2.2" fill="none" stroke-linecap="round"/>

      <!-- Neck -->
      <rect x="24" y="36" width="12" height="4" rx="2" fill="#3850d4"/>

      <!-- Body -->
      <rect x="14" y="40" width="32" height="18" rx="5" fill="#4858ef"/>

      <!-- Equalizer bars — VU meter chest -->
      <rect x="18" y="51" width="3.5" height="6"  rx="1.2" fill="rgba(255,255,255,0.50)"/>
      <rect x="23" y="46" width="3.5" height="11" rx="1.2" fill="rgba(255,255,255,0.75)"/>
      <rect x="28" y="48" width="3.5" height="9"  rx="1.2" fill="rgba(255,255,255,0.65)"/>
      <rect x="33" y="50" width="3.5" height="7"  rx="1.2" fill="rgba(255,255,255,0.55)"/>
      <rect x="38" y="53" width="3.5" height="4"  rx="1.2" fill="rgba(255,255,255,0.45)"/>

      <!-- Left arm -->
      <line x1="14" y1="45"
            [attr.x2]="leftArmX2" [attr.y2]="leftArmY2"
            stroke="#4858ef" stroke-width="6" stroke-linecap="round"/>
      <circle [attr.cx]="leftArmX2" [attr.cy]="leftArmY2" r="3.5" fill="#3850d4"/>

      <!-- Right arm -->
      <line x1="46" y1="45"
            [attr.x2]="rightArmX2" [attr.y2]="rightArmY2"
            stroke="#4858ef" stroke-width="6" stroke-linecap="round"/>
      <circle [attr.cx]="rightArmX2" [attr.cy]="rightArmY2" r="3.5" fill="#3850d4"/>
    </svg>
  `,
  styles: [`
    :host {
      display: inline-block;
      line-height: 0;
    }

    .mascot-celebrating {
      animation: mascot-bounce 0.5s ease-in-out infinite alternate;
      transform-origin: bottom center;
    }

    .mascot-happy {
      animation: mascot-wiggle 1.4s ease-in-out infinite;
      transform-origin: bottom center;
    }

    @keyframes mascot-bounce {
      from { transform: translateY(0) scale(1); }
      to   { transform: translateY(-9px) scale(1.05); }
    }

    @keyframes mascot-wiggle {
      0%, 100% { transform: rotate(0deg); }
      25%       { transform: rotate(-4deg); }
      75%       { transform: rotate(4deg); }
    }
  `]
})
export class MascotComponent {
  @Input() mood: Mood = 'neutral';
  @Input() size = 60;

  get eyeRy(): number {
    switch (this.mood) {
      case 'celebrating': return 1.4;
      case 'happy':       return 2.4;
      default:            return 3.8;
    }
  }

  get pupilRy(): number {
    switch (this.mood) {
      case 'celebrating': return 0.7;
      case 'happy':       return 1.4;
      default:            return 2.0;
    }
  }

  get mouthPath(): string {
    switch (this.mood) {
      case 'celebrating': return 'M 20 28 Q 30 38 40 28';
      case 'happy':       return 'M 21 29 Q 30 34 39 29';
      default:            return 'M 23 29 L 37 29';
    }
  }

  get leftArmX2(): number {
    switch (this.mood) {
      case 'celebrating': return 3;
      case 'happy':       return 5;
      default:            return 7;
    }
  }

  get leftArmY2(): number {
    switch (this.mood) {
      case 'celebrating': return 33;
      case 'happy':       return 46;
      default:            return 55;
    }
  }

  get rightArmX2(): number {
    switch (this.mood) {
      case 'celebrating': return 57;
      case 'happy':       return 55;
      default:            return 53;
    }
  }

  get rightArmY2(): number {
    switch (this.mood) {
      case 'celebrating': return 33;
      case 'happy':       return 46;
      default:            return 55;
    }
  }
}
