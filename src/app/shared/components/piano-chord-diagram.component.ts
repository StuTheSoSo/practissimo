// src/app/shared/components/piano-chord-diagram.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PianoChordPosition, PianoNote } from '../../core/models/chord.model';

/**
 * Renders a visual chord diagram for piano
 * Shows keyboard with highlighted keys and finger numbers
 */
@Component({
  selector: 'app-piano-chord-diagram',
  template: `
    <div class="chord-diagram">
      <!-- Chord name -->
      @if (chordName) {
        <div class="chord-name">{{ chordName }}</div>
      }

      <!-- Piano Keyboard -->
      <svg
        [attr.width]="width"
        [attr.height]="height"
        [attr.viewBox]="'0 0 ' + width + ' ' + height"
        class="diagram-svg"
      >
        <!-- White keys -->
        @for (key of whiteKeys; track key.note + key.octave) {
          <g>
            <rect
              [attr.x]="key.x"
              [attr.y]="marginTop"
              [attr.width]="whiteKeyWidth"
              [attr.height]="whiteKeyHeight"
              [attr.fill]="key.isPressed ? '#2196F3' : '#fff'"
              stroke="#333"
              stroke-width="2"
              [attr.class]="key.isPressed ? 'pressed-key' : ''"
            />
            <!-- Finger number on white keys -->
            @if (key.finger) {
              <circle
                [attr.cx]="key.x + whiteKeyWidth / 2"
                [attr.cy]="marginTop + whiteKeyHeight - 20"
                r="12"
                [attr.fill]="key.isPressed ? '#fff' : '#2196F3'"
                stroke="#333"
                stroke-width="2"
              />
              <text
                [attr.x]="key.x + whiteKeyWidth / 2"
                [attr.y]="marginTop + whiteKeyHeight - 15"
                class="finger-number"
                [attr.fill]="key.isPressed ? '#2196F3' : '#fff'"
              >
                {{ key.finger }}
              </text>
            }
            <!-- Note label -->
            <text
              [attr.x]="key.x + whiteKeyWidth / 2"
              [attr.y]="marginTop + whiteKeyHeight + 15"
              class="note-label"
            >
              {{ key.note }}{{ key.octave }}
            </text>
          </g>
        }

        <!-- Black keys (drawn on top) -->
        @for (key of blackKeys; track key.note + key.octave) {
          <g>
            <rect
              [attr.x]="key.x"
              [attr.y]="marginTop"
              [attr.width]="blackKeyWidth"
              [attr.height]="blackKeyHeight"
              [attr.fill]="key.isPressed ? '#2196F3' : '#000'"
              stroke="#333"
              stroke-width="2"
              [attr.class]="key.isPressed ? 'pressed-key' : ''"
            />
            <!-- Finger number on black keys -->
            @if (key.finger) {
              <circle
                [attr.cx]="key.x + blackKeyWidth / 2"
                [attr.cy]="marginTop + blackKeyHeight - 15"
                r="10"
                [attr.fill]="key.isPressed ? '#000' : '#2196F3'"
                stroke="#fff"
                stroke-width="2"
              />
              <text
                [attr.x]="key.x + blackKeyWidth / 2"
                [attr.y]="marginTop + blackKeyHeight - 10"
                class="finger-number"
                [attr.fill]="key.isPressed ? '#2196F3' : '#fff'"
              >
                {{ key.finger }}
              </text>
            }
          </g>
        }
      </svg>

      <!-- Hand indicator -->
      @if (position.leftHand) {
        <div class="hand-indicator">
          <small>Left Hand</small>
        </div>
      } @else {
        <div class="hand-indicator">
          <small>Right Hand</small>
        </div>
      }
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
      overflow: visible;
      width: 100%;
      max-width: 100%;
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
      overflow: visible;
      max-width: 100%;
      height: auto;
    }

    .pressed-key {
      filter: drop-shadow(0 4px 8px rgba(33, 150, 243, 0.4));
    }

    .finger-number {
      font-size: 14px;
      font-weight: bold;
      text-anchor: middle;
      dominant-baseline: middle;
    }

    .note-label {
      font-size: 10px;
      fill: #666;
      text-anchor: middle;
      font-weight: bold;
    }

    .hand-indicator {
      margin-top: 0.5rem;
      color: #666;
      font-style: italic;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class PianoChordDiagramComponent implements OnInit {
  @Input() position!: PianoChordPosition;
  @Input() chordName?: string;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  // Diagram dimensions
  width = 400;
  height = 220;
  marginTop = 30;
  marginBottom = 30;
  whiteKeyWidth = 40;
  whiteKeyHeight = 120;
  blackKeyWidth = 24;
  blackKeyHeight = 75;

  // Processed keys
  whiteKeys: Array<{
    note: string;
    octave: number;
    x: number;
    isPressed: boolean;
    finger?: number;
  }> = [];

  blackKeys: Array<{
    note: string;
    octave: number;
    x: number;
    isPressed: boolean;
    finger?: number;
  }> = [];

  // Piano key layout (one octave pattern)
  private readonly whiteKeyPattern = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  private readonly blackKeyPositions: Record<string, number> = {
    'C#': 0.7,  // Between C and D
    'D#': 1.7,  // Between D and E
    'F#': 3.7,  // Between F and G
    'G#': 4.7,  // Between G and A
    'A#': 5.7   // Between A and B
  };

  ngOnInit() {
    this.calculateDimensions();
    this.generateKeyboard();
  }

  private calculateDimensions() {
    const sizes = {
      small: { width: 300, height: 180, whiteKeyWidth: 30, blackKeyWidth: 18, whiteKeyHeight: 100 },
      medium: { width: 400, height: 220, whiteKeyWidth: 40, blackKeyWidth: 24, whiteKeyHeight: 120 },
      large: { width: 500, height: 260, whiteKeyWidth: 50, blackKeyWidth: 30, whiteKeyHeight: 140 }
    };

    const dimensions = sizes[this.size];
    this.height = dimensions.height;
    this.whiteKeyWidth = dimensions.whiteKeyWidth;
    this.blackKeyWidth = dimensions.blackKeyWidth;
    this.whiteKeyHeight = dimensions.whiteKeyHeight;
    this.blackKeyHeight = this.whiteKeyHeight * 0.6;
  }

  private generateKeyboard() {
    // Determine range of keys to show (based on chord notes)
    const octaves = this.getOctaveRange();
    const pressedNotes = new Set(
      this.position.notes.map(n => `${n.note}${n.octave}`)
    );

    // Generate white keys
    let whiteKeyIndex = 0;
    for (let octave = octaves.start; octave <= octaves.end; octave++) {
      for (const note of this.whiteKeyPattern) {
        const noteKey = `${note}${octave}`;
        const isPressed = pressedNotes.has(noteKey);
        const finger = this.position.notes.find(
          n => n.note === note && n.octave === octave
        )?.finger;

        this.whiteKeys.push({
          note,
          octave,
          x: whiteKeyIndex * this.whiteKeyWidth,
          isPressed,
          finger
        });

        whiteKeyIndex++;
      }
    }

    // Generate black keys
    whiteKeyIndex = 0;
    for (let octave = octaves.start; octave <= octaves.end; octave++) {
      for (const [note, position] of Object.entries(this.blackKeyPositions)) {
        const baseNote = note.replace('#', '');
        const noteKey = `${note}${octave}`;
        const altNoteKey = `${this.getEnharmonic(note)}${octave}`; // e.g., C# = Db

        const isPressed = pressedNotes.has(noteKey) || pressedNotes.has(altNoteKey);
        const finger = this.position.notes.find(
          n => (n.note === note || n.note === this.getEnharmonic(note)) && n.octave === octave
        )?.finger;

        // Calculate x position relative to the octave
        const octaveOffset = (octave - octaves.start) * 7;
        const xPosition = (octaveOffset + position) * this.whiteKeyWidth - (this.blackKeyWidth / 2);

        this.blackKeys.push({
          note,
          octave,
          x: xPosition,
          isPressed,
          finger
        });
      }
    }

    // Adjust width to fit all keys
    this.width = this.whiteKeys.length * this.whiteKeyWidth;
    // Add padding for labels
    this.height = this.marginTop + this.whiteKeyHeight + this.marginBottom;
  }

  private getOctaveRange(): { start: number; end: number } {
    if (this.position.notes.length === 0) {
      return { start: 4, end: 4 }; // Default to middle octave
    }

    const octaves = this.position.notes.map(n => n.octave);
    const minOctave = Math.min(...octaves);
    const maxOctave = Math.max(...octaves);

    // Show one octave range, expanding if needed
    return {
      start: Math.max(3, minOctave - 1),
      end: Math.min(5, maxOctave + 1)
    };
  }

  private getEnharmonic(note: string): string {
    const enharmonics: Record<string, string> = {
      'C#': 'Db',
      'D#': 'Eb',
      'F#': 'Gb',
      'G#': 'Ab',
      'A#': 'Bb',
      'Db': 'C#',
      'Eb': 'D#',
      'Gb': 'F#',
      'Ab': 'G#',
      'Bb': 'A#'
    };
    return enharmonics[note] || note;
  }
}
