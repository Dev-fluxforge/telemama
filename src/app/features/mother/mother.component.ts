import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Alert,
  DANGER_SIGNS,
  DANGER_SIGN_LIST,
  DangerSignCode,
  DangerSignDefinition,
  Mother,
  PregnancyStage,
} from '../../core/models';
import { NIGERIAN_STATES_LGAS, TelemamaService } from '../../core/telemama.service';
import { StatusBadgeComponent } from '../../shared/status-badge.component';

type MotherTab = 'checkin' | 'status' | 'emergency' | 'enrol';

@Component({
  selector: 'app-mother',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, DatePipe],
  template: `
    <div class="space-y-6">
      <!-- Mother Header & Persona Switcher -->
      <div class="tm-card p-5 bg-white flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-terracotta">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-terracotta-100 text-terracotta flex items-center justify-center text-2xl font-bold">
            🤰
          </div>
          @if (currentMother(); as mother) {
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-xl sm:text-2xl font-bold text-charcoal">
                  {{ mother.name }}
                </h1>
                <app-status-badge [risk]="mother.riskLevel" />
              </div>
              <p class="text-xs text-stone-500">
                {{ mother.assignedFacility }} •
                @if (mother.stage === 'postnatal') {
                  <span class="font-semibold text-stone-700">Day {{ mother.postnatalDay }} Postpartum</span>
                } @else {
                  <span class="font-semibold text-stone-700">Week {{ mother.gestationWeeks }} Pregnant</span>
                }
              </p>
            </div>
          } @else {
            <div><h1 class="text-xl font-bold text-charcoal">Mother Portal</h1></div>
          }
        </div>

        <!-- Quick Switcher for Demo testing -->
        <div class="flex items-center gap-2 text-xs">
          <label for="mother-select" class="text-stone-500 font-medium hidden sm:inline">Switch Mother:</label>
          <select
            id="mother-select"
            [ngModel]="svc.currentMotherId()"
            (ngModelChange)="svc.switchMother($event)"
            class="tm-input text-xs min-h-[38px] py-1 px-2.5 bg-stone-50"
          >
            @for (m of svc.mothers(); track m.id) {
              <option [value]="m.id">{{ m.name }} ({{ m.lga }} - {{ m.riskLevel | uppercase }})</option>
            }
          </select>
        </div>
      </div>

      <!-- Emergency Help Top Banner (Big Visible Help Button trigger) -->
      <div class="rounded-2xl bg-gradient-to-r from-urgent-700 to-terracotta-700 text-white p-4 sm:p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl animate-bounce">🚨</span>
          <div>
            <h2 class="text-base sm:text-lg font-extrabold leading-tight">In severe pain, heavy bleeding, or baby unwell?</h2>
            <p class="text-xs sm:text-sm text-urgent-100">Don't wait for routine check-in. Instant emergency broadcast to family & clinic.</p>
          </div>
        </div>
        <button
          type="button"
          (click)="activeTab.set('emergency')"
          class="tm-btn bg-white text-urgent-800 hover:bg-stone-100 font-extrabold text-sm px-6 py-2.5 shadow-md active:scale-95"
        >
          SOS: I Need Help Now
        </button>
      </div>

      <!-- Navigation Tabs (Touch friendly) -->
      <nav class="flex border-b border-stone-200 gap-1 overflow-x-auto pb-1" aria-label="Mother Flow Tabs">
        <button
          type="button"
          (click)="activeTab.set('checkin')"
          class="tm-btn rounded-b-none border-b-2 text-xs sm:text-sm font-bold px-4 py-2.5 transition-all"
          [class]="activeTab() === 'checkin' ? 'border-terracotta text-terracotta bg-white' : 'border-transparent text-stone-600 hover:text-stone-900'"
        >
          📝 Daily Check-in
        </button>

        <button
          type="button"
          (click)="activeTab.set('status')"
          class="tm-btn rounded-b-none border-b-2 text-xs sm:text-sm font-bold px-4 py-2.5 transition-all"
          [class]="activeTab() === 'status' ? 'border-terracotta text-terracotta bg-white' : 'border-transparent text-stone-600 hover:text-stone-900'"
        >
          🛡️ "You Are Being Watched" Status
        </button>

        <button
          type="button"
          (click)="activeTab.set('emergency')"
          class="tm-btn rounded-b-none border-b-2 text-xs sm:text-sm font-bold px-4 py-2.5 transition-all text-urgent"
          [class]="activeTab() === 'emergency' ? 'border-urgent text-urgent bg-white' : 'border-transparent text-urgent hover:bg-urgent-50'"
        >
          🚨 Emergency SOS Button
        </button>

        <button
          type="button"
          (click)="activeTab.set('enrol')"
          class="tm-btn rounded-b-none border-b-2 text-xs sm:text-sm font-bold px-4 py-2.5 transition-all ml-auto"
          [class]="activeTab() === 'enrol' ? 'border-terracotta text-terracotta bg-white' : 'border-transparent text-stone-600 hover:text-stone-900'"
        >
          ➕ Enrol New Mother
        </button>
      </nav>

      <!-- TAB 1: DAILY CHECK-IN -->
      @if (activeTab() === 'checkin') {
        <div class="space-y-6">
          @if (checkInSuccessMessage()) {
            <div class="p-5 rounded-2xl bg-forest-50 border-2 border-forest-400 text-forest-900 shadow-sm animate-fade-in">
              <div class="flex items-start gap-3">
                <span class="text-3xl">✅</span>
                <div class="space-y-1">
                  <h3 class="text-lg font-bold">Check-in Received & Recorded!</h3>
                  <p class="text-sm text-forest-800">
                    {{ checkInSuccessMessage() }}
                  </p>
                  @if (currentMother(); as mother) {
                    <p class="text-xs text-forest-700">
                      Your assigned health centre ({{ mother.assignedFacility }}) and family contact ({{ mother.nominatedFamilyName }}) have been updated.
                    </p>
                  }
                  <div class="pt-2">
                    <button
                      type="button"
                      (click)="checkInSuccessMessage.set(null)"
                      class="tm-btn tm-btn-forest text-xs py-1.5 px-3 min-h-[36px]"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }

          <div class="tm-card p-6 sm:p-8 space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-charcoal">How are you and baby feeling today?</h2>
              <p class="text-stone-600 text-sm mt-1">
                Tap any signs that apply, or tap the green "I Feel Well" button if you have no symptoms.
              </p>
            </div>

            <!-- Quick "I Feel Well Today" All Clear Button -->
            <button
              type="button"
              (click)="selectFeelWell()"
              class="w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left group"
              [class]="selectedSigns().length === 0 && overallWellbeing() === 'good' ? 'border-forest-600 bg-forest-50/80 shadow-md ring-2 ring-forest/20' : 'border-stone-200 bg-stone-50 hover:border-forest-400'"
            >
              <div class="flex items-center gap-3.5">
                <span class="w-10 h-10 rounded-xl bg-forest-600 text-white flex items-center justify-center text-xl font-bold">
                  ✓
                </span>
                <div>
                  <h3 class="font-bold text-charcoal text-base">I feel well & healthy today</h3>
                  <p class="text-xs text-stone-500">No bleeding, no severe pain, baby is feeding well</p>
                </div>
              </div>
              <span class="text-sm font-bold text-forest-700">
                {{ selectedSigns().length === 0 && overallWellbeing() === 'good' ? 'Selected ✓' : 'Tap to select' }}
              </span>
            </button>

            <!-- Danger Sign Checklist (Icons + Short Text for low literacy) -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Danger Signs Checklist (Check if present):
                </span>
                <span class="text-xs text-stone-500">
                  {{ selectedSigns().length }} symptom{{ selectedSigns().length === 1 ? '' : 's' }} selected
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                @for (item of dangerSigns; track item.code) {
                  <div
                    (click)="toggleSign(item.code)"
                    class="tm-checklist-item"
                    [class.tm-checklist-item-active]="isSignSelected(item.code)"
                    role="checkbox"
                    [attr.aria-checked]="isSignSelected(item.code)"
                    tabindex="0"
                  >
                    <span class="text-3xl shrink-0">{{ item.icon }}</span>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between">
                        <span class="font-bold text-sm text-charcoal">{{ item.shortLabel }}</span>
                        @if (item.severity === 'critical') {
                          <span class="text-[10px] px-1.5 py-0.5 rounded bg-urgent-100 text-urgent-800 font-bold">
                            CRITICAL
                          </span>
                        }
                      </div>
                      <p class="text-xs text-stone-500 line-clamp-2 mt-0.5">{{ item.description }}</p>
                    </div>
                    <span
                      class="w-6 h-6 rounded-lg border-2 flex items-center justify-center text-xs font-bold shrink-0"
                      [class]="isSignSelected(item.code) ? 'bg-urgent border-urgent text-white' : 'border-stone-300 text-transparent'"
                    >
                      ✓
                    </span>
                  </div>
                }
              </div>
            </div>

            <!-- Newborn Feeding Condition (Postnatal) -->
            @if (currentMother(); as cm) {
              @if (cm.stage === 'postnatal') {
                <div class="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <label class="tm-label text-sm">How is your baby latching and suckling?</label>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      (click)="babyWellbeing.set('feeding_well')"
                      class="p-3 rounded-xl border-2 text-left text-xs font-semibold flex items-center gap-2.5 transition-all"
                      [class]="babyWellbeing() === 'feeding_well' ? 'border-forest bg-forest-50 text-forest-900 font-bold' : 'border-stone-200 bg-white'"
                    >
                      <span class="text-xl">🍼</span>
                      <span>Baby is latching vigorously & feeding well</span>
                    </button>

                    <button
                      type="button"
                      (click)="babyWellbeing.set('feeding_poorly')"
                      class="p-3 rounded-xl border-2 text-left text-xs font-semibold flex items-center gap-2.5 transition-all"
                      [class]="babyWellbeing() === 'feeding_poorly' ? 'border-urgent bg-urgent-50 text-urgent-900 font-bold' : 'border-stone-200 bg-white'"
                    >
                      <span class="text-xl">⚠️</span>
                      <span>Baby refusing breast or too weak to suckle</span>
                    </button>
                  </div>
                </div>
              }
            }

            <!-- Optional Notes -->
            <div>
              <label for="mother-notes" class="tm-label">Anything else you would like your midwife to know? (Optional)</label>
              <textarea
                id="mother-notes"
                rows="2"
                [(ngModel)]="customNote"
                class="tm-input text-sm resize-none"
                placeholder="e.g. Taking medications on time, pain started 2 hours ago..."
              ></textarea>
            </div>

            <!-- Submit Button with clear touch target -->
            <div class="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <span class="text-xs text-stone-500">
                🔒 Encrypted & accessible to your registered care team
              </span>
              <button
                type="button"
                (click)="submitDailyCheckIn()"
                class="tm-btn tm-btn-primary px-8 text-base font-bold shadow-md"
              >
                Submit Daily Check-in →
              </button>
            </div>
          </div>
        </div>
      }

      <!-- TAB 2: "YOU ARE BEING WATCHED" STATUS SCREEN -->
      @if (activeTab() === 'status') {
        @if (currentMother(); as mother) {
          <div class="space-y-6">
            <!-- Continuous Protection Hero Status Card -->
            <div class="tm-card p-6 sm:p-8 bg-gradient-to-br from-forest-900 to-forest-800 text-white rounded-3xl shadow-xl relative overflow-hidden">
              <div class="relative z-10 space-y-4 max-w-2xl">
                <div class="inline-flex items-center gap-2 px-3 py-1 bg-forest-700/80 rounded-full text-xs font-bold border border-forest-500/50">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Continuous 24/7 Monitoring Active
                </div>

                <h2 class="text-2xl sm:text-3xl font-extrabold leading-tight">
                  You are safe. Telemama is actively watching over you and your baby.
                </h2>

                <p class="text-cream-100 text-sm leading-relaxed">
                  Your assigned primary care unit at <strong class="text-white">{{ mother.assignedFacility }}</strong> and your nominated family caregiver <strong class="text-white">{{ mother.nominatedFamilyName }}</strong> are linked to your profile. Any detected warning triggers immediate clinical triage.
                </p>

                <!-- Progress in Postnatal / Pregnancy Window -->
                <div class="p-4 bg-forest-950/60 rounded-2xl border border-forest-700 space-y-2 mt-4">
                  <div class="flex justify-between text-xs font-semibold text-forest-200">
                    <span>Care Phase: {{ mother.stage === 'postnatal' ? 'Postpartum Recovery' : 'Antenatal Protection' }}</span>
                    <span>{{ mother.stage === 'postnatal' ? 'Day ' + mother.postnatalDay + ' of 42 Days' : 'Week ' + mother.gestationWeeks + ' of 40 Weeks' }}</span>
                  </div>
                  <!-- Progress bar -->
                  <div class="w-full bg-forest-800 rounded-full h-3 overflow-hidden">
                    <div
                      class="bg-terracotta h-3 rounded-full transition-all duration-500"
                      [style.width]="mother.stage === 'postnatal' ? ((mother.postnatalDay || 1) / 42 * 100) + '%' : ((mother.gestationWeeks || 1) / 40 * 100) + '%'"
                    ></div>
                  </div>
                  <p class="text-[11px] text-forest-300">
                    The first 48 hours and 14 days carry 65% of maternal risks in Nigeria. Telemama verifies health daily.
                  </p>
                </div>

                <div class="pt-2 flex flex-wrap gap-3">
                  <a
                    [href]="'tel:' + mother.facilityPhone"
                    class="tm-btn bg-white text-forest-900 hover:bg-cream-100 text-xs font-bold px-4 py-2"
                  >
                    📞 Call {{ mother.assignedFacility }}
                  </a>
                  <a
                    [href]="'tel:' + mother.nominatedFamilyPhone"
                    class="tm-btn bg-forest-700 text-white hover:bg-forest-600 border border-forest-500 text-xs font-bold px-4 py-2"
                  >
                    👨‍👩‍👧 Call {{ mother.nominatedFamilyName }} ({{ mother.nominatedFamilyRelation }})
                  </a>
                </div>
              </div>
            </div>

            <!-- Recent Check-In History for this Mother -->
            <div class="tm-card p-6">
              <h3 class="text-lg font-bold text-charcoal mb-4 flex items-center justify-between">
                <span>Past Check-Ins & Health Log</span>
                <span class="text-xs font-normal text-stone-500">{{ mother.checkIns.length }} logged</span>
              </h3>

              @if (mother.checkIns.length) {
                <div class="space-y-3">
                  @for (ci of mother.checkIns; track ci.id) {
                    <div class="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div class="space-y-1">
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-charcoal">{{ ci.date }}</span>
                          <span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-stone-200 text-stone-700">
                            via {{ ci.channel }}
                          </span>
                          <span
                            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                            [class]="ci.riskTriggered === 'red' ? 'bg-urgent text-white' : ci.riskTriggered === 'amber' ? 'bg-amber-500 text-white' : 'bg-forest text-white'"
                          >
                            {{ ci.riskTriggered | uppercase }}
                          </span>
                        </div>
                        @if (ci.signs.length) {
                          <p class="text-urgent font-medium">
                            Symptoms: {{ getSignLabels(ci.signs) }}
                          </p>
                        } @else {
                          <p class="text-forest-700 font-medium">✓ No danger signs reported</p>
                        }
                        @if (ci.notes) {
                          <p class="text-stone-500 italic">"{{ ci.notes }}"</p>
                        }
                      </div>
                      <span class="text-stone-400 text-[11px]">{{ ci.timestamp | date: 'shortTime' }}</span>
                    </div>
                  }
                </div>
              } @else {
                <p class="text-xs text-stone-500">No previous check-in records yet.</p>
              }
            </div>
          </div>
        }
      }

      <!-- TAB 3: BIG RED EMERGENCY SOS BUTTON -->
      @if (activeTab() === 'emergency') {
        @if (currentMother(); as mother) {
          <div class="space-y-6">
            <div class="tm-card p-6 sm:p-10 border-4 border-urgent bg-urgent-50/50 text-center space-y-6">
              <div class="max-w-lg mx-auto space-y-3">
                <span class="text-5xl block animate-bounce">🆘</span>
                <h2 class="text-2xl sm:text-3xl font-black text-urgent-800">
                  EMERGENCY SOS: I NEED HELP NOW
                </h2>
                <p class="text-sm text-stone-700 leading-relaxed">
                  Tapping this button triggers an immediate high-priority emergency alert. An automated siren SMS and direct phone call alert will be dispatched to your family and {{ mother.assignedFacility }}.
                </p>
              </div>

              <!-- Big Emergency Trigger Button (min 80px high, large touch target) -->
              <div class="py-4">
                <button
                  type="button"
                  (click)="triggerEmergencySOS()"
                  class="w-full sm:w-auto min-w-[280px] sm:min-w-[340px] min-h-[80px] rounded-3xl bg-urgent text-white text-xl sm:text-2xl font-black uppercase tracking-wider shadow-2xl hover:bg-urgent-700 active:scale-95 transition-all border-4 border-white ring-8 ring-urgent/20"
                >
                  🚨 I NEED HELP NOW 🚨
                </button>
              </div>

              @if (sosDispatched()) {
                <!-- Live Emergency Siren Feedback Banner -->
                <div class="p-6 rounded-2xl bg-urgent text-white text-left space-y-4 shadow-xl border-2 border-white animate-pulse">
                  <div class="flex items-center gap-3">
                    <span class="text-3xl">📡</span>
                    <div>
                      <h3 class="text-lg font-bold">EMERGENCY SOS BROADCAST ACTIVE!</h3>
                      <p class="text-xs text-urgent-100">Dispatched at {{ sosDispatched()?.timestamp | date: 'mediumTime' }}</p>
                    </div>
                  </div>

                  <div class="bg-urgent-900/60 p-4 rounded-xl space-y-2 text-xs">
                    <p class="font-bold">What is happening right now:</p>
                    <ul class="list-disc list-inside space-y-1 text-urgent-100">
                      <li>Emergency call and SMS sent to {{ mother.nominatedFamilyName }} ({{ mother.nominatedFamilyPhone }})</li>
                      <li>Triage ward at {{ mother.assignedFacility }} alerted with your health record</li>
                      <li>Community emergency transport network notified for pickup at {{ mother.community }}, {{ mother.lga }}</li>
                    </ul>
                  </div>

                  <div class="p-3 bg-white text-charcoal rounded-xl text-xs font-bold text-center">
                    Stay calm. Lie down on your left side with legs slightly elevated. Do not walk alone.
                  </div>

                  <div class="flex flex-wrap gap-2 pt-2">
                    <a
                      [href]="'tel:' + mother.facilityPhone"
                      class="tm-btn bg-white text-urgent-800 text-xs py-2 px-4 font-bold"
                    >
                      📞 Call Clinic Directly Now
                    </a>
                    <button
                      type="button"
                      (click)="sosDispatched.set(null)"
                      class="tm-btn bg-urgent-900 text-white text-xs py-2 px-4 ml-auto"
                    >
                      Dismiss Siren
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      }

      <!-- TAB 4: ENROL A NEW MOTHER -->
      @if (activeTab() === 'enrol') {
        <div class="tm-card p-6 sm:p-8 space-y-6">
          <div>
            <h2 class="text-2xl font-bold text-charcoal">Enrol Mother onto Telemama</h2>
            <p class="text-stone-600 text-sm mt-1">
              Register a pregnant or newly delivered mother for automated 2G USSD check-ins and emergency triage support.
            </p>
          </div>

          <form (ngSubmit)="handleEnrol()" class="space-y-6">
            <!-- Section 1: Mother Details -->
            <div class="space-y-4">
              <h3 class="text-sm font-bold text-terracotta uppercase tracking-wider border-b border-stone-200 pb-1">
                1. Mother Information
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="tm-label">Full Name *</label>
                  <input
                    type="text"
                    [(ngModel)]="enrolForm.name"
                    name="name"
                    required
                    placeholder="e.g. Zainab Abdullahi"
                    class="tm-input text-sm"
                  />
                </div>

                <div>
                  <label class="tm-label">Phone Number (Any basic phone) *</label>
                  <input
                    type="tel"
                    [(ngModel)]="enrolForm.phone"
                    name="phone"
                    required
                    placeholder="+234 803 000 0000"
                    class="tm-input text-sm"
                  />
                </div>

                <div>
                  <label class="tm-label">State *</label>
                  <select
                    [(ngModel)]="enrolForm.state"
                    name="state"
                    (ngModelChange)="onStateChange($event)"
                    class="tm-input text-sm"
                  >
                    @for (st of statesOptions; track st.state) {
                      <option [value]="st.state">{{ st.state }}</option>
                    }
                  </select>
                </div>

                <div>
                  <label class="tm-label">Local Government Area (LGA) *</label>
                  <select
                    [(ngModel)]="enrolForm.lga"
                    name="lga"
                    class="tm-input text-sm"
                  >
                    @for (l of currentLgaList(); track l) {
                      <option [value]="l">{{ l }}</option>
                    }
                  </select>
                </div>

                <div class="sm:col-span-2">
                  <label class="tm-label">Community / Nearest Landmark *</label>
                  <input
                    type="text"
                    [(ngModel)]="enrolForm.community"
                    name="community"
                    required
                    placeholder="e.g. Near Central Market, Omi Adio"
                    class="tm-input text-sm"
                  />
                </div>
              </div>
            </div>

            <!-- Section 2: Clinical Care Stage -->
            <div class="space-y-4">
              <h3 class="text-sm font-bold text-terracotta uppercase tracking-wider border-b border-stone-200 pb-1">
                2. Pregnancy & Delivery Status
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="tm-label">Current Stage *</label>
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      (click)="enrolForm.stage = 'postnatal'"
                      class="p-3 rounded-xl border-2 text-xs font-bold transition-all"
                      [class]="enrolForm.stage === 'postnatal' ? 'border-terracotta bg-terracotta-50 text-terracotta' : 'border-stone-200 bg-white'"
                    >
                      👶 Delivered (Postnatal)
                    </button>
                    <button
                      type="button"
                      (click)="enrolForm.stage = 'pregnant'"
                      class="p-3 rounded-xl border-2 text-xs font-bold transition-all"
                      [class]="enrolForm.stage === 'pregnant' ? 'border-terracotta bg-terracotta-50 text-terracotta' : 'border-stone-200 bg-white'"
                    >
                      🤰 Currently Pregnant
                    </button>
                  </div>
                </div>

                <div>
                  <label class="tm-label">
                    {{ enrolForm.stage === 'postnatal' ? 'Delivery Date' : 'Expected Delivery Date (EDD)' }} *
                  </label>
                  <input
                    type="date"
                    [(ngModel)]="enrolForm.eddOrDeliveryDate"
                    name="eddOrDeliveryDate"
                    required
                    class="tm-input text-sm"
                  />
                </div>

                <div class="sm:col-span-2">
                  <label class="tm-label">Primary Health Centre / Facility *</label>
                  <input
                    type="text"
                    [(ngModel)]="enrolForm.assignedFacility"
                    name="assignedFacility"
                    required
                    placeholder="e.g. Adeoyo Maternity Teaching Hospital"
                    class="tm-input text-sm"
                  />
                </div>
              </div>
            </div>

            <!-- Section 3: Nominated Family Support -->
            <div class="space-y-4">
              <h3 class="text-sm font-bold text-terracotta uppercase tracking-wider border-b border-stone-200 pb-1">
                3. Nominated Family Support Person
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="tm-label">Family Member Name *</label>
                  <input
                    type="text"
                    [(ngModel)]="enrolForm.nominatedFamilyName"
                    name="nominatedFamilyName"
                    required
                    placeholder="e.g. Usman Abdullahi"
                    class="tm-input text-sm"
                  />
                </div>

                <div>
                  <label class="tm-label">Relationship *</label>
                  <select
                    [(ngModel)]="enrolForm.nominatedFamilyRelation"
                    name="nominatedFamilyRelation"
                    class="tm-input text-sm"
                  >
                    <option value="Husband">Husband</option>
                    <option value="Mother">Mother</option>
                    <option value="Mother-in-law">Mother-in-law</option>
                    <option value="Sister">Sister</option>
                    <option value="Aunt">Aunt</option>
                    <option value="Community Caregiver">Community Caregiver</option>
                  </select>
                </div>

                <div>
                  <label class="tm-label">Family Phone Number *</label>
                  <input
                    type="tel"
                    [(ngModel)]="enrolForm.nominatedFamilyPhone"
                    name="nominatedFamilyPhone"
                    required
                    placeholder="+234 802 000 0000"
                    class="tm-input text-sm"
                  />
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-stone-200 flex justify-end gap-3">
              <button
                type="button"
                (click)="activeTab.set('checkin')"
                class="tm-btn tm-btn-ghost text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="tm-btn tm-btn-primary text-sm font-bold px-7"
              >
                Complete Enrolment & Activate
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `,
})
export class MotherComponent {
  svc = inject(TelemamaService);

  dangerSigns: DangerSignDefinition[] = DANGER_SIGN_LIST;
  statesOptions = NIGERIAN_STATES_LGAS;

  activeTab = signal<MotherTab>('checkin');
  selectedSigns = signal<DangerSignCode[]>([]);
  overallWellbeing = signal<'good' | 'fair' | 'poor'>('good');
  babyWellbeing = signal<'feeding_well' | 'feeding_poorly' | 'not_applicable'>('feeding_well');
  customNote = '';
  checkInSuccessMessage = signal<string | null>(null);
  sosDispatched = signal<Alert | null>(null);

  // Enrol form
  enrolForm = {
    name: '',
    phone: '',
    state: 'Oyo',
    lga: 'Ibadan North',
    community: '',
    stage: 'postnatal' as PregnancyStage,
    eddOrDeliveryDate: '2026-10-22',
    nominatedFamilyName: '',
    nominatedFamilyPhone: '',
    nominatedFamilyRelation: 'Husband',
    assignedFacility: 'Adeoyo Maternity Teaching Hospital',
  };

  currentMother = computed(() => this.svc.currentMother());

  currentLgaList = computed(() => {
    const found = this.statesOptions.find((s) => s.state === this.enrolForm.state);
    return found ? found.lgas : [];
  });

  onStateChange(newState: string) {
    const found = this.statesOptions.find((s) => s.state === newState);
    if (found && found.lgas.length > 0) {
      this.enrolForm.lga = found.lgas[0];
    }
  }

  isSignSelected(code: DangerSignCode): boolean {
    return this.selectedSigns().includes(code);
  }

  toggleSign(code: DangerSignCode) {
    this.selectedSigns.update((prev) => {
      if (prev.includes(code)) {
        return prev.filter((c) => c !== code);
      } else {
        return [...prev, code];
      }
    });
  }

  selectFeelWell() {
    this.selectedSigns.set([]);
    this.overallWellbeing.set('good');
    this.babyWellbeing.set('feeding_well');
  }

  getSignLabels(codes: DangerSignCode[]): string {
    return codes.map((c) => DANGER_SIGNS[c]?.shortLabel || c).join(', ');
  }

  submitDailyCheckIn() {
    const mother = this.currentMother();
    if (!mother) return;

    const signs = this.selectedSigns();
    const result = this.svc.submitCheckIn({
      motherId: mother.id,
      signs,
      wellbeing: signs.length ? 'poor' : this.overallWellbeing(),
      babyWellbeing: this.babyWellbeing(),
      notes: this.customNote,
      channel: 'web',
    });

    if (result.alertCreated) {
      this.checkInSuccessMessage.set(
        `URGENT ALERT RECORDED: You reported ${signs.length} symptom(s). Your clinic and family support have been notified immediately.`
      );
    } else {
      this.checkInSuccessMessage.set(
        'Thank you! Your check-in is saved. Nurse on duty at ' + mother.assignedFacility + ' has verified your stable status.'
      );
    }

    // Reset inputs
    this.selectedSigns.set([]);
    this.customNote = '';
    // Switch to status view after short delay to show reassurance
    setTimeout(() => {
      this.activeTab.set('status');
    }, 1500);
  }

  triggerEmergencySOS() {
    const mother = this.currentMother();
    if (!mother) return;
    const alert = this.svc.triggerEmergencySOS(mother.id, 'EMERGENCY: Mother pressed the big SOS button on the Mother Portal.');
    this.sosDispatched.set(alert);
  }

  handleEnrol() {
    if (!this.enrolForm.name || !this.enrolForm.phone) return;
    const enrolled = this.svc.enrollMother(this.enrolForm);
    this.checkInSuccessMessage.set(`Welcome ${enrolled.name}! You are now enrolled in continuous monitoring.`);
    this.activeTab.set('status');
  }
}
