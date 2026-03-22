# Practissimo UI Fun & Unique Ideas

Reference doc for planned UX/UI improvements. Each idea includes an implementation prompt ready to paste into Copilot Chat.

---

## Quick Wins (Low Effort / High Impact)


---


---


---

### 8. Satisfying Micro-Interactions
Small tactile responses throughout the app that make every tap feel good.

**Implementation Prompt:**
> Add global micro-interaction styles to `src/global.scss`. Apply to all `ion-button` and card-style elements: (1) a subtle `scale(0.96)` on `:active` with a fast `80ms ease` transition back to `scale(1.02)` then `scale(1)` — a "squish bounce". (2) On cards with `(click)` handlers, apply a slight 3D tilt effect on press using CSS `perspective(600px) rotateX(2deg) rotateY(-1deg)` transitions. (3) On achievement unlock, add a shimmer sweep animation across the badge using a `::after` pseudo-element with a `linear-gradient` moving left-to-right.

---

### 9. Weekly Target Celebration
Hitting the weekly goal should feel like an event, not a color change.

**Implementation Prompt:**
> In `home.page.ts`, detect when the weekly target transitions from incomplete to complete (compare previous value to current computed signal). When it completes, trigger: (1) a brief CSS confetti shower on the weekly target card using absolutely-positioned `::before`/`::after` pseudo-elements or injected `<span>` elements with randomized colors and `fall` keyframe animations, (2) the progress bar overflowing with a "burst" glow effect, (3) copy changing to "🎉 Weekly goal smashed!" for 3 seconds before settling to the regular complete state. All CSS, no confetti libraries.

---

## High Effort / Very High Impact

### 10. Instrument Hero Card
The home screen should feel personal to the player's chosen instrument.

**Implementation Prompt:**
> In `home.page.ts`, replace the generic practice hero banner background with an instrument-specific SVG silhouette illustration. Create inline SVG markup for each supported instrument (guitar, bass, piano, drums, violin, vocals) — minimalist silhouettes, not detailed. Position the SVG absolutely behind the card content with `opacity: 0.08` (subtle watermark style). Read the current instrument from `instrument.service` and conditionally render the correct SVG. On scroll, apply a subtle parallax translate to the SVG using a `(scroll)` or `IntersectionObserver` binding.

---

### 11. Tiered Level Badge System
The star icon for level is generic. Visual progression keeps players motivated.

**Implementation Prompt:**
> In `home.page.ts` and anywhere the player level is displayed, replace the generic star icon with a tiered badge component. Define tiers: Bronze (levels 1–9, `#cd7f32`), Silver (10–24, `#c0c0c0`), Gold (25–49, `#ffd700`), Diamond (50+, `#b9f2ff` with shimmer). Render the badge as an inline SVG shield shape with the tier color fill and the level number inside. For Diamond tier, add a CSS shimmer animation on the badge. Read the current level from `gamification.service`.

---

### 12. Mascot Character
A quirky character that guides, celebrates, and personalizes the app experience.

**Implementation Prompt:**
> Design and implement a minimal mascot character for Practissimo — a tiny robot with headphones (rendered as inline SVG, ~60x60px). Add the mascot to: (1) the onboarding flow in `onboarding.page.ts`, appearing next to each step with a speech bubble of contextual encouragement, (2) the home page empty state (no sessions ever logged), (3) the milestone modal in `milestone-modal.component.ts`, where the mascot does a celebration animation (bounce + arms up using CSS `@keyframes`). The mascot SVG should be defined in a shared `mascot.component.ts` standalone component with an `@Input() mood: 'neutral' | 'happy' | 'celebrating'` that changes the eye/arm positions via conditional SVG attribute bindings.

---

## Priority Order (Recommended Build Sequence)

1. Animated Flame Streak ← start here, 30-min win
2. Streak at Risk Drama
3. XP Pop-Up Counter Animation
4. Personality in Empty States
5. Dark Studio Color Palette
6. Micro-Interactions
7. Weekly Target Celebration
8. Stage Mode During Practice
9. Quest Cards RPG Redesign
10. Tiered Level Badge System
11. Instrument Hero Card
12. Mascot Character
