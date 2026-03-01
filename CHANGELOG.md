# NutriTrack Changelog

All notable changes to NutriTrack are documented here.

---

## [0.3.0] — 2026-02-28 22:29 EST
### Fixed
- New food entries now save correctly (added `created_at` timestamp to inserts)

---

## [0.2.0] — 2026-02-28 22:26 EST
### Added
- **Edit food entries** — tap any logged item to edit
- **Delete food entries** — red delete button with confirmation
- List refreshes after save/delete

---

## [0.1.0] — 2026-02-28 22:24 EST
### Added
- **Macro tracking** — protein, carbs, fat inputs in food logging form
- **Progress bars** — calories (green), protein (blue), carbs (orange), fat (purple)
- **Settings page** (`/settings`) — customize daily goals
- **Goals persistence** — saved to localStorage
- **Default goals** — 2800 cal, 180g protein, 300g carbs, 80g fat
- Gear icon in header linking to settings

---

## [0.0.1] — 2026-02-28 22:08 EST
### Initial Release
- Next.js 14 + TypeScript + Tailwind CSS
- Supabase integration for food logging
- Mobile-first design
- Daily food log with meal categories (Breakfast, Lunch, Dinner, Snacks)
- Calorie tracking with progress bar
- Bottom sheet modal for adding food
- Deployed to Vercel

---

*Built with Claude Code + Vibe Coding methodology*
