# PracticeQuest Roadmap -> GitHub Issues

Use these as copy/paste issue drafts. They are scoped to avoid interfering with existing quests/achievements logic.

## Milestone: MVP

### Issue 1: Practice Session Templates (Builder)
- Labels: `feature`, `practice`, `mvp`
- Estimate: `5-8 points`
- Depends on: none

**Description**
Add reusable session templates (for example: Technique-heavy, Balanced, Repertoire-first) and let users start a practice session from a template.

**Acceptance Criteria**
- User can choose a template on the practice setup screen.
- A template pre-fills category/time-block guidance before session start.
- Existing manual category flow still works.
- Session save path remains compatible with quests/achievements.

**Implementation Notes (files)**
- `src/app/core/models/practice-template.model.ts` (new)
- `src/app/core/services/practice-template.service.ts` (new)
- `src/app/core/models/storage-keys.model.ts` (add template key)
- `src/app/pages/practice/practice.page.ts` (template selector + apply template)

---

### Issue 2: Repertoire Tracker (Local-first)
- Labels: `feature`, `repertoire`, `mvp`
- Estimate: `8-13 points`
- Depends on: none

**Description**
Add a repertoire/exercise list with statuses (`Learning`, `Polishing`, `Ready`) and last-practiced metadata.

**Acceptance Criteria**
- User can create, edit, archive, and delete repertoire items.
- User can set status and optional notes.
- Last practiced date updates when item is attached to a session.
- Home shows a small “Next up” repertoire suggestion block.

**Implementation Notes (files)**
- `src/app/core/models/repertoire-item.model.ts` (new)
- `src/app/core/services/repertoire.service.ts` (new)
- `src/app/core/models/storage-keys.model.ts` (add repertoire key)
- `src/main.ts` (route)
- `src/app/pages/repertoire/repertoire.page.ts` (new)
- `src/app/pages/home/home.page.ts` (preview block)
- `src/app/pages/practice/practice.page.ts` (optional link session -> repertoire item)

---

### Issue 3: Post-Session Reflection Prompts
- Labels: `feature`, `practice`, `mvp`
- Estimate: `3-5 points`
- Depends on: none

**Description**
After completing a session, prompt for quick reflection (what improved, what struggled, next focus).

**Acceptance Criteria**
- Reflection prompt appears after session completion and before returning home.
- User can skip reflection.
- Reflection data is stored with the session and visible in history.
- Existing session completion XP/quest/achievement behavior unchanged.

**Implementation Notes (files)**
- `src/app/core/models/practice-session.model.ts` (add reflection fields)
- `src/app/pages/practice/practice.page.ts` (reflection modal/alert flow)
- `src/app/pages/history/history.page.ts` (display reflection)

---

### Issue 4: Smart Daily Reminder Content
- Labels: `feature`, `notifications`, `mvp`
- Estimate: `3-5 points`
- Depends on: notification baseline already merged

**Description**
Use recent practice history to customize reminder text (for example: neglected category reminder).

**Acceptance Criteria**
- Reminder body adapts based on recent session/category gaps.
- If no meaningful pattern exists, default reminder text is used.
- Scheduling behavior (time, permission, enable/disable) remains stable.

**Implementation Notes (files)**
- `src/app/core/services/notification.service.ts` (content logic)
- `src/app/core/services/practice.service.ts` (read-only helper queries if needed)

## Milestone: v1.1

### Issue 5: Tempo Progress Tracking Per Exercise
- Labels: `feature`, `analytics`, `v1.1`
- Estimate: `8-13 points`
- Depends on: Issue 2

**Description**
Track clean BPM progression per repertoire/exercise and show trend history.

**Acceptance Criteria**
- User can log BPM checkpoints linked to repertoire/exercise.
- History shows chronological BPM entries.
- App displays simple trend indicator (up/down/stable).

**Implementation Notes (files)**
- `src/app/core/models/tempo-record.model.ts` (new)
- `src/app/core/services/tempo-progress.service.ts` (new)
- `src/app/core/models/storage-keys.model.ts` (add tempo key)
- `src/app/pages/history/history.page.ts` (trend display)
- `src/app/pages/repertoire/repertoire.page.ts` (record entry point)

---

### Issue 6: Weekly Plan Engine (Beyond Minutes)
- Labels: `feature`, `planning`, `v1.1`
- Estimate: `8-13 points`
- Depends on: Issue 1

**Description**
Evolve weekly targets into a plan with category allocation (for example 40% technique, 30% repertoire, etc.).

**Acceptance Criteria**
- User can set weekly total minutes and category split.
- App shows weekly progress by category and total.
- Weekly rollover preserves target config but resets progress.

**Implementation Notes (files)**
- `src/app/core/models/weekly-target.model.ts` (extend or split into plan/progress models)
- `src/app/core/services/weekly-target.service.ts` (plan + progress computation)
- `src/app/pages/settings/settings.page.ts` (plan editor)
- `src/app/pages/home/home.page.ts` (summary display)

---

### Issue 7: Practice Quality Score
- Labels: `feature`, `gamification`, `v1.1`
- Estimate: `5-8 points`
- Depends on: Issues 3 and 6

**Description**
Add a practice quality score based on consistency, balance, and completion quality.

**Acceptance Criteria**
- Score is computed independently from XP/quests/achievements.
- User can view current score and key factors affecting it.
- Score updates after session completion and weekly rollover.

**Implementation Notes (files)**
- `src/app/core/models/practice-quality.model.ts` (new)
- `src/app/core/services/practice-quality.service.ts` (new)
- `src/app/core/models/storage-keys.model.ts` (add quality key if persisted)
- `src/app/pages/home/home.page.ts` (score card)

## Milestone: v1.2

### Issue 8: Assignment Mode (Teacher/Student Lite)
- Labels: `feature`, `teaching`, `v1.2`
- Estimate: `13+ points`
- Depends on: Issue 2

**Description**
Support local assignment workflows (tasks, due dates, completion state) as groundwork for future sync.

**Acceptance Criteria**
- User can create assignment with due date and linked repertoire items.
- Assignment progress updates as linked items are practiced.
- Overdue and upcoming assignments are clearly separated.

**Implementation Notes (files)**
- `src/app/core/models/assignment.model.ts` (new)
- `src/app/core/services/assignment.service.ts` (new)
- `src/app/core/models/storage-keys.model.ts` (add assignment key)
- `src/main.ts` (route)
- `src/app/pages/assignments/assignments.page.ts` (new)
- `src/app/pages/home/home.page.ts` (upcoming assignment preview)

---

### Issue 9: Lesson Prep Mode
- Labels: `feature`, `teaching`, `v1.2`
- Estimate: `8-13 points`
- Depends on: Issue 8

**Description**
Add lesson countdown and prep checklist prioritizing weak/overdue work.

**Acceptance Criteria**
- User can set next lesson date/time.
- App generates prep checklist from assignments + repertoire status.
- Checklist supports complete/incomplete tracking.

**Implementation Notes (files)**
- `src/app/core/models/lesson-prep.model.ts` (new)
- `src/app/core/services/lesson-prep.service.ts` (new)
- `src/app/pages/home/home.page.ts` (lesson countdown + checklist link)
- `src/app/pages/settings/settings.page.ts` (lesson date configuration)

---

### Issue 10: Monthly Milestone Review
- Labels: `feature`, `insights`, `v1.2`
- Estimate: `5-8 points`
- Depends on: Issues 5 and 7

**Description**
Provide month-over-month self-review for consistency, tempo growth, and category balance.

**Acceptance Criteria**
- User can view previous month vs current month metrics.
- Monthly summary includes at least: total minutes, sessions, top category, tempo improvement indicator.
- User can add a short monthly reflection note.

**Implementation Notes (files)**
- `src/app/core/services/monthly-review.service.ts` (new)
- `src/app/core/models/monthly-review.model.ts` (new)
- `src/app/core/models/storage-keys.model.ts` (add monthly review key)
- `src/app/pages/history/history.page.ts` (monthly review section)

## Tech Debt / Enablement Issues

### Issue 11: Shared Date Utilities
- Labels: `tech-debt`
- Estimate: `2-3 points`

**Description**
Centralize week/month boundary and timezone-safe date helpers to avoid duplicate logic.

**Implementation Notes (files)**
- `src/app/core/utils/date.utils.ts` (new)
- Refactor call sites in weekly target, notifications, history, and future analytics services.

---

### Issue 12: Analytics Event Hooks (Optional)
- Labels: `tech-debt`, `analytics`
- Estimate: `3-5 points`

**Description**
Add a lightweight event hook layer to measure feature adoption (templates used, reminders enabled, reflection completion).

**Implementation Notes (files)**
- `src/app/core/services/analytics.service.ts` (new abstraction)
- Insert non-blocking events in `practice.page.ts`, `settings.page.ts`, `home.page.ts`.

