// src/app/shared/components/guitar-chord-diagram.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuitarChordPosition } from '../../core/models/chord.model';

/**
 * Renders a visual chord diagram for guitar
 * Shows fretboard with finger positions
 */
@Component({
  selector: 'app-guitar-chord-diagram',
  template: `
    <div class="chord-diagram">
      <!-- Chord name -->
      @if (chordName) {
        <div class="chord-name">{{ chordName }}</div>
      }

      <!-- SVG Diagram -->
      <svg
        [attr.width]="width"
        [attr.height]="height"
        [attr.viewBox]="'0 0 ' + width + ' ' + height"
        class="diagram-svg"
      >
        <!-- Nut (if showing open position) -->
        @if (position.baseFret === 1) {
          <rect
            [attr.x]="marginLeft"
            [attr.y]="marginTop - 4"
            [attr.width]="fretboardWidth"
            height="6"
            fill="#333"
          />
        }

        <!-- Fret number indicator (if not open position) -->
        @if (position.baseFret > 1) {
          <text
            [attr.x]="marginLeft - 15"
            [attr.y]="marginTop + stringSpacing"
            class="fret-number"
          >
            {{ position.baseFret }}fr
          </text>
        }

        <!-- Frets (horizontal lines) -->
        @for (i of fretLines; track i) {
          <line
            [attr.x1]="marginLeft"
            [attr.y1]="marginTop + (i * fretHeight)"
            [attr.x2]="marginLeft + fretboardWidth"
            [attr.y2]="marginTop + (i * fretHeight)"
            stroke="#999"
            stroke-width="2"
          />
        }

        <!-- Strings (vertical lines) -->
        @for (i of stringLines; track i) {
          <line
            [attr.x1]="marginLeft + (i * stringSpacing)"
            [attr.y1]="marginTop"
            [attr.x2]="marginLeft + (i * stringSpacing)"
            [attr.y2]="marginTop + ((position.frets - 1) * fretHeight)"
            stroke="#666"
            [attr.stroke-width]="i === 0 ? 3 : (7 - i) * 0.5"
          />
        }

        <!-- Open/Muted string markers -->
        @for (marker of stringMarkers; track marker.string) {
          @if (marker.type === 'o') {
            <circle
              [attr.cx]="marginLeft + (marker.string * stringSpacing)"
              [attr.cy]="marginTop - 15"
              r="6"
              fill="none"
              stroke="#333"
              stroke-width="2"
            />
          }
          @if (marker.type === 'x') {
            <g>
              <line
                [attr.x1]="marginLeft + (marker.string * stringSpacing) - 5"
                [attr.y1]="marginTop - 20"
                [attr.x2]="marginLeft + (marker.string * stringSpacing) + 5"
                [attr.y2]="marginTop - 10"
                stroke="#333"
                stroke-width="2"
              />
              <line
                [attr.x1]="marginLeft + (marker.string * stringSpacing) - 5"
                [attr.y1]="marginTop - 10"
                [attr.x2]="marginLeft + (marker.string * stringSpacing) + 5"
                [attr.y2]="marginTop - 20"
                stroke="#333"
                stroke-width="2"
              />
            </g>
          }
        }

        <!-- Finger positions (dots) -->
        @for (dot of fingerDots; track dot.string + '-' + dot.fret) {
          <circle
            [attr.cx]="marginLeft + (dot.string * stringSpacing)"
            [attr.cy]="marginTop + (dot.fret * fretHeight) - (fretHeight / 2)"
            r="10"
            fill="#2196F3"
            stroke="#fff"
            stroke-width="2"
          />
          @if (dot.finger) {
            <text
              [attr.x]="marginLeft + (dot.string * stringSpacing)"
              [attr.y]="marginTop + (dot.fret * fretHeight) - (fretHeight / 2) + 5"
              class="finger-number"
            >
              {{ dot.finger }}
            </text>
          }
        }

        <!-- Barre indicators -->
        @for (barre of barres; track barre.fret) {
          <line
            [attr.x1]="marginLeft + (barre.fromString * stringSpacing)"
            [attr.y1]="marginTop + (barre.fret * fretHeight) - (fretHeight / 2)"
            [attr.x2]="marginLeft + (barre.toString * stringSpacing)"
            [attr.y2]="marginTop + (barre.fret * fretHeight) - (fretHeight / 2)"
            stroke="#2196F3"
            stroke-width="20"
            stroke-linecap="round"
          />
        }
      </svg>

      <!-- String labels (E A D G B e) -->
      <div class="string-labels">
        @for (label of stringLabels; track label.index) {
          <span [style.left.px]="marginLeft + (label.index * stringSpacing) - 5">
            {{ label.name }}
          </span>
        }
      </div>
    </div>
  `,
  styles: [`
    .chord-diagram {
      display: inline-block;
      text-align: center;
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .chord-name {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .diagram-svg {
      display: block;
      margin: 0 auto;
    }

    .fret-number {
      font-size: 12px;
      fill: #666;
      text-anchor: end;
    }

    .finger-number {
      font-size: 12px;
      fill: white;
      text-anchor: middle;
      font-weight: bold;
    }

    .string-labels {
      position: relative;
      height: 20px;
      margin-top: 8px;
    }

    .string-labels span {
      position: absolute;
      font-size: 11px;
      color: #999;
      font-weight: bold;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class GuitarChordDiagramComponent implements OnInit {
  @Input() position!: GuitarChordPosition;
  @Input() chordName?: string;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  // Diagram dimensions
  width = 150;
  height = 200;
  marginTop = 30;
  marginLeft = 25;
  fretboardWidth = 100;
  stringSpacing = 20;
  fretHeight = 35;

  // Calculated values
  fretLines: number[] = [];
  stringLines: number[] = [];
  fingerDots: Array<{ string: number; fret: number; finger?: number }> = [];
  stringMarkers: Array<{ string: number; type: 'o' | 'x' }> = [];
  barres: Array<{ fret: number; fromString: number; toString: number }> = [];
  stringLabels: Array<{ index: number; name: string }> = [];

  ngOnInit() {
    this.calculateDimensions();
    this.generateDiagram();
  }

  private calculateDimensions() {
    const sizes = {
      small: { width: 120, height: 160, fretHeight: 28, stringSpacing: 16 },
      medium: { width: 150, height: 200, fretHeight: 35, stringSpacing: 20 },
      large: { width: 200, height: 260, fretHeight: 45, stringSpacing: 26 }
    };

    const dimensions = sizes[this.size];
    this.width = dimensions.width;
    this.height = dimensions.height;
    this.fretHeight = dimensions.fretHeight;
    this.stringSpacing = dimensions.stringSpacing;
    this.fretboardWidth = this.stringSpacing * (this.position.strings - 1);
  }

  private generateDiagram() {
    // Generate fret lines
    this.fretLines = Array.from({ length: this.position.frets }, (_, i) => i);

    // Generate string lines
    this.stringLines = Array.from({ length: this.position.strings }, (_, i) => i);

    // String labels (for 6-string guitar)
    const guitarStrings = ['E', 'A', 'D', 'G', 'B', 'e'];
    this.stringLabels = this.stringLines.map(i => ({
      index: i,
      name: guitarStrings[i] || ''
    }));

    // Process fingering
    this.position.fingering.forEach((fret, stringIndex) => {
      if (fret === 'o') {
        this.stringMarkers.push({ string: stringIndex, type: 'o' });
      } else if (fret === 'x') {
        this.stringMarkers.push({ string: stringIndex, type: 'x' });
      } else if (typeof fret === 'number') {
        const finger = this.position.fingers?.[stringIndex];
        this.fingerDots.push({
          string: stringIndex,
          fret: fret,
          finger: finger || undefined
        });
      }
    });

    // Process barres
    if (this.position.barres) {
      this.barres = this.position.barres.map(b => ({
        fret: b.fret,
        fromString: b.fromString,
        toString: b.toString
      }));
    }
  }
}
