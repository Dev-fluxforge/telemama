# Telemama 🤱🇳🇬
### Continuous Maternal & Newborn Monitoring and Alert System for Nigeria

Telemama is an accessible, low-bandwidth, Africa-first frontend application designed to eliminate maternal and newborn mortality caused by delays in recognizing danger signs and seeking emergency care during the critical 48-hour and 42-day postpartum window.

---

## 🌟 Key Highlights & Design Decisions
- **Zero-Data 2G USSD Compatibility (`*384*24#`)**: Simulates the exact feature phone USSD menu tree that rural mothers with basic phones navigate without internet or airtime costs.
- **Low-Literacy Friendly Interface**: Visual danger-sign checklist with clear icons, plain English descriptions, large touch targets (min 48px), and high contrast.
- **Warm & Trustworthy African Palette**: Cream (`#F7F1E9`), Terracotta (`#C2410C`), Deep Forest Green (`#14532D`), and Charcoal (`#1F2937`).
- **Closed-Loop Emergency Response**: Simultaneously alerts nominated family members and primary healthcare facilities with actionable first-aid steps and clinical triage protocols.
- **Offline-First & Local Storage Persistence**: All enrolments, check-ins, alerts, response logs, and simulated transport bookings persist across page reloads via `localStorage`.

---

## 🚀 Tech Stack
- **Framework**: Angular 20 (Standalone Components, Signals, Computed properties, Effects, Lazy Loaded Routes)
- **Styling**: Tailwind CSS 3.4 (Tailored design tokens for cream, terracotta, forest, urgent, and amber)
- **Typography**: Google Fonts (*Plus Jakarta Sans* & *Ubuntu*)
- **Language**: TypeScript Strict Mode
- **Architecture**: Clean folder structure (`core/`, `shared/`, `features/`)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── app.component.ts         # Global persistent alert ticker, navigation & demo controller
│   ├── app.routes.ts            # Lazy loaded routes for all core flows
│   ├── core/
│   │   ├── models.ts            # Strongly typed models: Mother, Alert, DangerSign, CheckIn, Transport
│   │   └── telemama.service.ts  # Reactive signals state, Nigerian seed data (7 mothers), localStorage
│   ├── features/
│   │   ├── home/                # Landing page: value proposition, stats, role entry points & demo scenarios
│   │   ├── mother/              # Mother flow: daily checklist, status screen, SOS button, enrolment form
│   │   ├── family/              # Family flow: alert inbox, "What to do now" cards, 1-tap call & transport
│   │   ├── clinic/              # Facility dashboard: risk flags (Green/Amber/Red), triage deck, response log
│   │   └── ussd/                # Realistic 2G feature phone simulator with keypad & live GSM logs
│   └── shared/
│       ├── status-badge.component.ts    # High-contrast Green/Amber/Red risk badges
│       ├── alert-card.component.ts      # Reusable clinical alert card with quick actions
│       └── transport-modal.component.ts # Interactive emergency keke / ambulance dispatch simulator
├── styles.css                   # Tailwind directives, component tokens, touch targets
└── index.html                   # HTML5 semantic structure, meta descriptions & typography
```

---

## 🛠️ How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (available at http://localhost:4200)
npm start
# or
ng serve

# 3. Production build test
npm run build
```

---

## ⏱️ Live Hackathon Pitch Demo Script (Under 3 Minutes)

Follow this 5-step walkthrough to wow judges in under 3 minutes:

### 1. Landing Page (0:00 - 0:35)
- Open `http://localhost:4200`.
- Highlight the problem: *Maternal mortality in Nigeria is driven by delays in seeking care and reaching care.*
- Show the 4 role entry points: **Mother**, **Family Support**, **Clinic Console**, and **2G USSD Phone**.

### 2. The 2G Basic Phone USSD Simulator (0:35 - 1:15)
- Click on the **2G USSD (*384*24#)** tab in the top navigation.
- Show the realistic feature phone interface with screen and keypad.
- **Action**: Click the quick shortcut **"Report Heavy Bleeding (SOS)"** or dial `*384*24#`, press `2` (Danger Signs), then `1` (Heavy Bleeding).
- Point to the live **GSM Network Gateway Log** on the right side: shows real-time SMS broadcast to the husband and the local clinic.
- Notice the **Red Persistent Siren Banner** that immediately drops down across the top of the entire website!

### 3. Mother Flow (1:15 - 1:50)
- Navigate to the **Mother** tab.
- Show the low-literacy icon checklist: 🩸 Heavy Bleeding, 🤕 Severe Headache, 🌡️ High Fever, 🦵 Swollen Face/Feet, 🍼 Baby Not Feeding.
- Show the **"You Are Being Watched" Status Tab**: highlights the 42-day postpartum recovery tracker and assigned health centre (Adeoyo Maternity Teaching Hospital).
- Point out the **Big Emergency "I NEED HELP NOW" Button**: one tap triggers immediate sirens and location dispatch.

### 4. Family / Support Person Flow (1:50 - 2:20)
- Navigate to the **Family** tab.
- Demonstrate the **Alert Inbox** for Folake Adeyemi.
- Highlight the **"WHAT YOU MUST DO RIGHT NOW"** step-by-step guidance written in clear, non-medical English:
  1. Go to Folake immediately (do not leave her alone).
  2. Keep her lying down with legs elevated.
  3. Call Adeoyo Maternity Hospital.
  4. Dispatch emergency transport.
- Click **"Request Emergency Transport"**: shows the interactive simulation assigning a local Keke Tricycle driver (`Alhaji Tunde`, plate `OYO-592-BDJ`, ETA 8 mins).

### 5. Health Worker / Clinic Console (2:20 - 3:00)
- Navigate to the **Clinic Console** tab.
- Show the triage dashboard with **Green / Amber / Red** risk indicators.
- Filter by Red Alerts: Folake Adeyemi and Amina Abubakar appear at the top.
- Click on Folake to view the **Patient Incoming Triage Deck**:
  - Highlights specific clinical preparation instructions for midwives: *Prepare IV 16G cannulas, 20 IU Oxytocin infusion in 500mL Hartmann / Normal Saline, Misoprostol 800mcg rectal, crossmatch blood.*
- Type a note in the **Quick Response Log**: *"Midwife Blessing: Triage bay 2 prepared, IV set ready, Keke driver en route with patient."* and click **Save Clinical Log Entry**.
- Show the **"Enrol Discharged Mother"** modal for seamless hospital discharge onboarding.

---

## 📊 Seeded Nigerian Mothers & Scenarios

| Mother Name | Location | Stage | Risk Flag | Reported Scenario |
| :--- | :--- | :--- | :--- | :--- |
| **Folake Adeyemi** | Ibadan North, Oyo | Postnatal Day 4 | 🚨 **RED (Urgent)** | Heavy bleeding & severe headache via USSD |
| **Amina Abubakar** | Kano Municipal, Kano | 35 Weeks Pregnant | 🚨 **RED (Urgent)** | Severe headache & blurred vision (Pre-eclampsia) |
| **Chioma Okafor** | Surulere, Lagos | Postnatal Day 9 | ⚠️ **AMBER (Watch)** | Severe swelling in ankles; missed 1 milestone |
| **Blessing Eze** | Yaba, Lagos | 37 Weeks Pregnant | ⚠️ **AMBER (Watch)** | Reduced fetal movement reported |
| **Hauwa Ibrahim** | Kaduna North, Kaduna | Postnatal Day 14 | ✓ **GREEN (Stable)** | Baby latching and suckling actively |
| **Temitope Ogunleye** | Abeokuta South, Ogun | 28 Weeks Pregnant | ✓ **GREEN (Stable)** | Routine antenatal check normal |
| **Ngozi Nwosu** | Enugu North, Enugu | Postnatal Day 21 | ✓ **GREEN (Stable)** | 3-week check normal, immunizations complete |

---

## 💡 Demo Controllers (Bottom Toolbar)
Judges can test instant transitions at any time using the global bottom bar:
- **🚨 Scenario: Bleeding Emergency**: Instantly loads Folake's red alert triage.
- **✓ Scenario: All Stable**: Sets all monitored mothers to peaceful green status.
- **🔄 Reset Demo**: Restores baseline seeded data.
