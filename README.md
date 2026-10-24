# Telemama (front-end prototype)
Maternal and newborn danger-sign monitoring for Nigeria. Angular (standalone, signals, lazy routes) + TypeScript + Tailwind CSS 3. No backend: `src/app/core/telemama.service.ts` holds seeded in-memory data as signals.

## Run
```
npm install
npm start        # http://localhost:4200
```
Requires Node 20.19+ (or 22). `npm run build` for a production build.

## 30-second demo
1. Open `/mother`, tap **2** (or type `1,4`). Try the Yorùbá toggle.
2. A red banner appears on every route. Click **Open clinic**: Folake is now **Urgent**, top of the list, with the "Patient incoming" card.
3. `/family` shows the alert with Call her / Call clinic / Find transport. **Reset demo data** restarts.

## Rules
Urgent = any danger sign reported. Watch = a scheduled check-in missed. Otherwise Stable. Schedule: 24 hours, day 3, days 7 to 14, week 6 (windows in `core/models.ts`).

## Structure
`core/` models + service · `shared/` status badge · `features/{mother,family,clinic}` lazy routes.

## Known gaps
No designer exports were attached, so layout follows the brief's tokens, not pixel specs. Yorùbá text and clinic prep prompts are placeholders for expert review. State is per browser tab (no cross-tab sync). Phone numbers are fake. Not compiled or run here (no network in my sandbox).
