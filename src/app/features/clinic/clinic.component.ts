import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  Alert,
  AlertStatus,
  CheckInRecord,
  DANGER_SIGNS,
  DangerSignCode,
  Mother,
  PregnancyStage,
  ResponseLogItem,
  RiskLevel,
} from '../../core/models';
import { NIGERIAN_STATES_LGAS, TelemamaService } from '../../core/telemama.service';
import { StatusBadgeComponent } from '../../shared/status-badge.component';
import { TransportModalComponent } from '../../shared/transport-modal.component';

@Component({
  selector: 'app-clinic',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, DatePipe, TransportModalComponent],
  template: `
    <div class="space-y-6">
      <!-- Clinic Header & Statistics Dashboard -->
      <div class="tm-card p-6 bg-white border-l-4 border-l-forest shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-forest-600 animate-pulse"></span>
              <span class="text-xs font-bold uppercase tracking-wider text-forest-800">
                Primary Health Facility Triage Console
              </span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-charcoal mt-1">
              Adeoyo & Partner Facilities Dashboard
            </h1>
            <p class="text-xs sm:text-sm text-stone-500">
              Active postpartum & antenatal continuous surveillance network • Nigeria
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="showEnrolModal.set(true)"
              class="tm-btn tm-btn-primary text-xs sm:text-sm py-2 px-4 font-bold"
            >
              ➕ Enrol Discharged Mother
            </button>
            <button
              type="button"
              (click)="svc.resetToDefaults()"
              class="tm-btn tm-btn-outline text-xs py-2 px-3.5"
              title="Reset demo data"
            >
              🔄 Reset Demo
            </button>
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div
            (click)="riskFilter.set('all')"
            class="p-3.5 rounded-xl border-2 transition-all cursor-pointer"
            [class]="riskFilter() === 'all' ? 'border-forest bg-forest-50/70 font-bold' : 'border-stone-200 bg-stone-50 hover:border-stone-300'"
          >
            <span class="text-xs text-stone-600 uppercase tracking-wider block">Total Monitored</span>
            <div class="text-2xl font-extrabold text-charcoal mt-0.5">{{ stats().total }}</div>
            <span class="text-[11px] text-stone-500">Mothers in system</span>
          </div>

          <div
            (click)="riskFilter.set('red')"
            class="p-3.5 rounded-xl border-2 transition-all cursor-pointer"
            [class]="riskFilter() === 'red' ? 'border-urgent bg-urgent-50 font-bold' : 'border-stone-200 bg-stone-50 hover:border-stone-300'"
          >
            <span class="text-xs text-urgent-800 uppercase tracking-wider font-bold block flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-urgent animate-ping"></span>
              Red / Urgent
            </span>
            <div class="text-2xl font-extrabold text-urgent mt-0.5">{{ stats().red }}</div>
            <span class="text-[11px] text-urgent-700">Immediate action needed</span>
          </div>

          <div
            (click)="riskFilter.set('amber')"
            class="p-3.5 rounded-xl border-2 transition-all cursor-pointer"
            [class]="riskFilter() === 'amber' ? 'border-amber-400 bg-amber-50 font-bold' : 'border-stone-200 bg-stone-50 hover:border-stone-300'"
          >
            <span class="text-xs text-amber-800 uppercase tracking-wider font-bold block">Amber / Watch</span>
            <div class="text-2xl font-extrabold text-amber-700 mt-0.5">{{ stats().amber }}</div>
            <span class="text-[11px] text-amber-700">Missed check-in / mild</span>
          </div>

          <div
            (click)="riskFilter.set('green')"
            class="p-3.5 rounded-xl border-2 transition-all cursor-pointer"
            [class]="riskFilter() === 'green' ? 'border-forest bg-forest-50 font-bold' : 'border-stone-200 bg-stone-50 hover:border-stone-300'"
          >
            <span class="text-xs text-forest-800 uppercase tracking-wider font-bold block">Green / Stable</span>
            <div class="text-2xl font-extrabold text-forest mt-0.5">{{ stats().green }}</div>
            <span class="text-[11px] text-forest-700">Healthy recovery</span>
          </div>
        </div>
      </div>

      <!-- Main Two-Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- LEFT COLUMN: Search, Filters & Mothers List (5 cols) -->
        <div class="lg:col-span-5 space-y-4">
          <!-- Search & Filter Bar -->
          <div class="tm-card p-4 space-y-3 bg-white">
            <div>
              <label for="search-input" class="tm-label text-xs">Search Mother, Phone or LGA</label>
              <div class="relative">
                <input
                  id="search-input"
                  type="search"
                  [(ngModel)]="searchQuery"
                  placeholder="e.g. Folake, Ibadan, Surulere..."
                  class="tm-input text-xs pl-8 min-h-[40px]"
                />
                <span class="absolute left-2.5 top-2.5 text-stone-400 text-sm">🔍</span>
              </div>
            </div>

            <!-- Risk filter chips -->
            <div class="flex items-center gap-1.5 flex-wrap text-xs">
              <span class="text-stone-400 font-semibold mr-1">Risk:</span>
              <button
                type="button"
                (click)="riskFilter.set('all')"
                class="px-2.5 py-1 rounded-lg font-bold border transition-all"
                [class]="riskFilter() === 'all' ? 'bg-charcoal text-white border-charcoal' : 'bg-stone-100 text-stone-600 border-stone-200'"
              >
                All ({{ stats().total }})
              </button>
              <button
                type="button"
                (click)="riskFilter.set('red')"
                class="px-2.5 py-1 rounded-lg font-bold border transition-all"
                [class]="riskFilter() === 'red' ? 'bg-urgent text-white border-urgent' : 'bg-urgent-50 text-urgent-800 border-urgent-200'"
              >
                Red ({{ stats().red }})
              </button>
              <button
                type="button"
                (click)="riskFilter.set('amber')"
                class="px-2.5 py-1 rounded-lg font-bold border transition-all"
                [class]="riskFilter() === 'amber' ? 'bg-amber-600 text-white border-amber-600' : 'bg-amber-50 text-amber-800 border-amber-200'"
              >
                Amber ({{ stats().amber }})
              </button>
              <button
                type="button"
                (click)="riskFilter.set('green')"
                class="px-2.5 py-1 rounded-lg font-bold border transition-all"
                [class]="riskFilter() === 'green' ? 'bg-forest text-white border-forest' : 'bg-forest-50 text-forest-800 border-forest-200'"
              >
                Green ({{ stats().green }})
              </button>
            </div>
          </div>

          <!-- Mothers List -->
          <div class="space-y-2.5 max-h-[650px] overflow-y-auto phone-scroll pr-1">
            @for (m of filteredMothers(); track m.id) {
              <div
                (click)="selectedMotherId.set(m.id)"
                class="tm-card p-4 transition-all cursor-pointer border-2"
                [class]="selectedMotherId() === m.id ? 'border-forest-600 shadow-md ring-2 ring-forest/20' : 'border-stone-200/80 hover:border-stone-300'"
                [class.border-l-4]="true"
                [class.border-l-urgent]="m.riskLevel === 'red'"
                [class.border-l-amber-500]="m.riskLevel === 'amber'"
                [class.border-l-forest-600]="m.riskLevel === 'green'"
              >
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <h3 class="font-bold text-charcoal text-base flex items-center gap-1.5">
                      {{ m.name }}
                      @if (m.riskLevel === 'red') {
                        <span class="w-2 h-2 rounded-full bg-urgent animate-ping inline-block"></span>
                      }
                    </h3>
                    <p class="text-xs text-stone-500 mt-0.5">
                      {{ m.lga }}, {{ m.state }} • {{ m.phone }}
                    </p>
                  </div>
                  <app-status-badge [risk]="m.riskLevel" size="sm" />
                </div>

                <div class="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                  <span>
                    @if (m.stage === 'postnatal') {
                      👶 Postnatal Day {{ m.postnatalDay }}
                    } @else {
                      🤰 Week {{ m.gestationWeeks }} Pregnant
                    }
                  </span>
                  <span class="text-stone-400 text-[11px]">{{ m.lastCheckInDate }}</span>
                </div>
              </div>
            } @empty {
              <div class="tm-card p-6 text-center text-stone-500 text-xs">
                No mothers found matching your search.
              </div>
            }
          </div>
        </div>

        <!-- RIGHT COLUMN: Selected Patient Deep Clinical Deck & Triage (7 cols) -->
        <div class="lg:col-span-7 space-y-5">
          @if (selectedMother(); as mother) {
            <!-- Patient Profile & Clinical Triage Card -->
            <div class="tm-card p-6 bg-white border-2 border-stone-200 shadow-md space-y-6">
              <!-- Patient Header -->
              <div class="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <div class="flex items-center gap-2">
                    <h2 class="text-2xl font-black text-charcoal">{{ mother.name }}</h2>
                    <app-status-badge [risk]="mother.riskLevel" />
                  </div>
                  <p class="text-xs text-stone-600 mt-1">
                    {{ mother.community }}, {{ mother.lga }}, {{ mother.state }} •
                    <a [href]="'tel:' + mother.phone" class="font-bold text-terracotta underline">{{ mother.phone }}</a>
                  </p>
                  <p class="text-xs text-stone-500 mt-0.5">
                    Assigned: <strong>{{ mother.assignedFacility }}</strong>
                  </p>
                </div>

                <div class="text-right text-xs space-y-1">
                  <div class="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                    <span class="text-stone-400 block text-[10px] uppercase font-bold">Nominated Family Contact</span>
                    <strong class="text-charcoal block">{{ mother.nominatedFamilyName }} ({{ mother.nominatedFamilyRelation }})</strong>
                    <a [href]="'tel:' + mother.nominatedFamilyPhone" class="text-terracotta underline font-bold">{{ mother.nominatedFamilyPhone }}</a>
                  </div>
                </div>
              </div>

              <!-- ACTIVE CLINICAL ALERT & PREPARATION BOX -->
              @if (activeAlertForMother(); as alert) {
                <div class="p-5 rounded-2xl border-2 border-urgent bg-urgent-50/50 space-y-4 shadow-sm animate-fade-in">
                  <div class="flex flex-wrap items-center justify-between gap-2 border-b border-urgent-200 pb-2">
                    <div class="flex items-center gap-2 text-urgent-900 font-extrabold text-sm sm:text-base">
                      <span class="text-2xl animate-bounce">🚨</span>
                      <span>INCOMING CRITICAL EMERGENCY ALERT (via {{ alert.channel | uppercase }})</span>
                    </div>
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-urgent text-white uppercase">
                      Status: {{ alert.status.replace('_', ' ') }}
                    </span>
                  </div>

                  <!-- Danger signs badges -->
                  <div>
                    <span class="text-xs font-bold text-urgent-800 uppercase tracking-wider block mb-1.5">
                      Reported Symptoms:
                    </span>
                    <div class="flex flex-wrap gap-2">
                      @for (s of alert.signs; track s) {
                        <span class="px-3 py-1 rounded-xl bg-white border border-urgent-300 text-xs font-bold text-urgent shadow-xs flex items-center gap-1.5">
                          <span>{{ getSign(s).icon }}</span>
                          <span>{{ getSign(s).shortLabel }}</span>
                        </span>
                      }
                    </div>
                  </div>

                  @if (alert.customMessage) {
                    <p class="text-xs bg-white/90 p-3 rounded-xl border border-urgent-200 text-stone-700 italic">
                      "{{ alert.customMessage }}"
                    </p>
                  }

                  <!-- Specific Clinical Preparation Checklist for Midwives -->
                  <div class="p-3.5 bg-white rounded-xl border border-urgent-200 space-y-2">
                    <span class="text-xs font-black text-urgent-800 uppercase tracking-wider block">
                      Midwife & Resuscitation Protocol:
                    </span>
                    <ul class="text-xs text-charcoal space-y-1.5 list-disc list-inside">
                      @for (action of alert.recommendedActions; track action) {
                        <li class="font-medium">{{ action }}</li>
                      }
                    </ul>
                  </div>

                  <!-- Quick Clinical Action Triggers -->
                  <div class="pt-2 flex flex-wrap items-center gap-2">
                    <a
                      [href]="'tel:' + mother.phone"
                      class="tm-btn tm-btn-primary text-xs py-2 px-3 font-bold"
                    >
                      📞 Call Mother
                    </a>
                    <a
                      [href]="'tel:' + mother.nominatedFamilyPhone"
                      class="tm-btn tm-btn-outline text-xs py-2 px-3 font-bold"
                    >
                      👨‍👩‍👧 Call Family ({{ mother.nominatedFamilyName }})
                    </a>
                    <button
                      type="button"
                      (click)="openTransportModal(alert)"
                      class="tm-btn bg-purple-700 hover:bg-purple-800 text-white text-xs py-2 px-3 font-bold"
                    >
                      🚑 Dispatch Transport
                    </button>
                    <button
                      type="button"
                      (click)="updateStatus(alert.id, 'at_facility')"
                      class="tm-btn tm-btn-forest text-xs py-2 px-3 font-bold"
                    >
                      🏥 Admitted to Triage
                    </button>
                    @if (alert.status !== 'resolved') {
                      <button
                        type="button"
                        (click)="updateStatus(alert.id, 'resolved')"
                        class="tm-btn tm-btn-ghost text-xs py-2 px-3 text-stone-600 hover:text-stone-900 ml-auto"
                      >
                        ✓ Resolve
                      </button>
                    }
                  </div>
                </div>
              }

              <!-- Postpartum / Pregnancy Milestones Timeline -->
              <div>
                <h3 class="text-sm font-bold text-charcoal uppercase tracking-wider mb-3">
                  Check-Ins & Milestone History
                </h3>
                <div class="space-y-2 text-xs">
                  @for (ci of mother.checkIns; track ci.id) {
                    <div class="p-3 rounded-xl border border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-2">
                      <div class="space-y-0.5">
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-charcoal">{{ ci.date }}</span>
                          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-200 text-stone-700">
                            {{ ci.channel | uppercase }}
                          </span>
                          <span
                            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                            [class]="ci.riskTriggered === 'red' ? 'bg-urgent text-white' : ci.riskTriggered === 'amber' ? 'bg-amber-600 text-white' : 'bg-forest text-white'"
                          >
                            {{ ci.riskTriggered | uppercase }}
                          </span>
                        </div>
                        @if (ci.signs.length) {
                          <p class="text-urgent font-medium">Symptoms: {{ getSignLabels(ci.signs) }}</p>
                        } @else {
                          <p class="text-forest-700 font-medium">✓ Routine check-in stable</p>
                        }
                        @if (ci.notes) {
                          <p class="text-stone-500 italic">"{{ ci.notes }}"</p>
                        }
                      </div>
                      <span class="text-stone-400 text-[11px]">{{ ci.timestamp | date: 'shortTime' }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Quick Facility Response Log Form -->
              <div class="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h3 class="text-xs font-bold text-charcoal uppercase tracking-wider">
                  Log Triage Response & Clinical Notes
                </h3>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    [(ngModel)]="logAuthor"
                    placeholder="Staff Name (e.g. Midwife Bisi)"
                    class="tm-input text-xs"
                  />
                  <select [(ngModel)]="logRole" class="tm-input text-xs">
                    <option value="Midwife">Midwife</option>
                    <option value="Nurse">Nurse</option>
                    <option value="Doctor">Doctor</option>
                    <option value="CHEW">CHEW</option>
                  </select>
                  <input
                    type="text"
                    [(ngModel)]="logAction"
                    placeholder="Action (e.g. Phone Triage / IV Setup)"
                    class="tm-input text-xs"
                  />
                </div>

                <textarea
                  rows="2"
                  [(ngModel)]="logNotes"
                  placeholder="Record clinical observations, vitals, or transport updates..."
                  class="tm-input text-xs resize-none"
                ></textarea>

                <div class="flex justify-end">
                  <button
                    type="button"
                    (click)="submitResponseLog()"
                    [disabled]="!logNotes"
                    class="tm-btn tm-btn-primary text-xs py-2 px-4 font-bold"
                  >
                    Save Clinical Log Entry
                  </button>
                </div>

                <!-- Existing Response Logs for this mother's alert -->
                @if (activeAlertForMother()?.responseLogs?.length) {
                  <div class="pt-3 border-t border-stone-200 space-y-2">
                    <span class="text-[11px] font-bold text-stone-500 uppercase">Recent Facility Log:</span>
                    @for (log of activeAlertForMother()!.responseLogs; track log.id) {
                      <div class="p-2.5 rounded-xl bg-white border border-stone-200 text-xs space-y-0.5">
                        <div class="flex items-center justify-between font-bold text-charcoal">
                          <span>{{ log.author }} ({{ log.role }}) - {{ log.action }}</span>
                          <span class="text-[10px] text-stone-400 font-normal">{{ log.timestamp | date: 'shortTime' }}</span>
                        </div>
                        <p class="text-stone-600 text-[11px]">{{ log.notes }}</p>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Quick Enrolment Modal for Health Workers at Discharge -->
      @if (showEnrolModal()) {
        <div
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div class="tm-card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border-2 border-forest-600/30">
            <div class="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <h2 class="text-lg font-bold text-charcoal">Enrol Mother at Discharge</h2>
              <button
                type="button"
                (click)="showEnrolModal.set(false)"
                class="text-stone-400 hover:text-stone-700 text-2xl font-bold p-1 leading-none"
              >
                &times;
              </button>
            </div>

            <form (ngSubmit)="handleModalEnrol()" class="space-y-4 text-xs">
              <div>
                <label class="tm-label">Full Name *</label>
                <input
                  type="text"
                  [(ngModel)]="enrolModalData.name"
                  name="mName"
                  required
                  placeholder="e.g. Maryam Danjuma"
                  class="tm-input text-xs"
                />
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="tm-label">Phone Number *</label>
                  <input
                    type="tel"
                    [(ngModel)]="enrolModalData.phone"
                    name="mPhone"
                    required
                    placeholder="+234 803 000 0000"
                    class="tm-input text-xs"
                  />
                </div>
                <div>
                  <label class="tm-label">State *</label>
                  <select
                    [(ngModel)]="enrolModalData.state"
                    name="mState"
                    class="tm-input text-xs"
                  >
                    @for (s of statesOptions; track s.state) {
                      <option [value]="s.state">{{ s.state }}</option>
                    }
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="tm-label">LGA *</label>
                  <select
                    [(ngModel)]="enrolModalData.lga"
                    name="mLga"
                    class="tm-input text-xs"
                  >
                    @for (l of currentLgaOptions(); track l) {
                      <option [value]="l">{{ l }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="tm-label">Community / Landmark *</label>
                  <input
                    type="text"
                    [(ngModel)]="enrolModalData.community"
                    name="mComm"
                    required
                    placeholder="e.g. Oja Oba"
                    class="tm-input text-xs"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="tm-label">Stage *</label>
                  <select [(ngModel)]="enrolModalData.stage" name="mStage" class="tm-input text-xs">
                    <option value="postnatal">Postnatal (Delivered)</option>
                    <option value="pregnant">Antenatal (Pregnant)</option>
                  </select>
                </div>
                <div>
                  <label class="tm-label">Date (Delivery / EDD) *</label>
                  <input
                    type="date"
                    [(ngModel)]="enrolModalData.eddOrDeliveryDate"
                    name="mDate"
                    required
                    class="tm-input text-xs"
                  />
                </div>
              </div>

              <div class="p-3 bg-stone-50 rounded-xl space-y-2">
                <span class="font-bold text-stone-600 block">Nominated Family Member:</span>
                <div class="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    [(ngModel)]="enrolModalData.nominatedFamilyName"
                    name="fName"
                    placeholder="Name"
                    class="tm-input text-xs"
                  />
                  <select [(ngModel)]="enrolModalData.nominatedFamilyRelation" name="fRel" class="tm-input text-xs">
                    <option value="Husband">Husband</option>
                    <option value="Mother">Mother</option>
                    <option value="Sister">Sister</option>
                  </select>
                  <input
                    type="tel"
                    [(ngModel)]="enrolModalData.nominatedFamilyPhone"
                    name="fPhone"
                    placeholder="Phone"
                    class="tm-input text-xs"
                  />
                </div>
              </div>

              <div class="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  (click)="showEnrolModal.set(false)"
                  class="tm-btn tm-btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="tm-btn tm-btn-primary text-xs font-bold px-4"
                >
                  Enrol & Begin Surveillance
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Emergency Transport Simulation Modal -->
      @if (transportAlert()) {
        <app-transport-modal
          [alert]="transportAlert()"
          (onClose)="transportAlert.set(null)"
        />
      }
    </div>
  `,
})
export class ClinicComponent {
  svc = inject(TelemamaService);

  statesOptions = NIGERIAN_STATES_LGAS;
  stats = computed(() => this.svc.stats());

  searchQuery = '';
  riskFilter = signal<'all' | 'red' | 'amber' | 'green'>('all');
  selectedMotherId = signal<string>('m1');
  showEnrolModal = signal<boolean>(false);
  transportAlert = signal<Alert | null>(null);

  // Response log form fields
  logAuthor = 'Midwife Blessing (Adeoyo)';
  logRole: ResponseLogItem['role'] = 'Midwife';
  logAction = 'Clinical Triage Evaluation';
  logNotes = '';

  // Enrol modal data
  enrolModalData = {
    name: '',
    phone: '',
    state: 'Oyo',
    lga: 'Ibadan North',
    community: '',
    stage: 'postnatal' as PregnancyStage,
    eddOrDeliveryDate: '2026-10-24',
    nominatedFamilyName: '',
    nominatedFamilyPhone: '',
    nominatedFamilyRelation: 'Husband',
    assignedFacility: 'Adeoyo Maternity Teaching Hospital',
  };

  currentLgaOptions = computed(() => {
    const found = this.statesOptions.find((s) => s.state === this.enrolModalData.state);
    return found ? found.lgas : [];
  });

  filteredMothers = computed(() => {
    let list = this.svc.mothers();
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.lga.toLowerCase().includes(q) ||
          m.state.toLowerCase().includes(q) ||
          m.phone.includes(q)
      );
    }
    const rf = this.riskFilter();
    if (rf !== 'all') {
      list = list.filter((m) => m.riskLevel === rf);
    }
    // Sort red first, then amber, then green
    const order: Record<RiskLevel, number> = { red: 0, amber: 1, green: 2 };
    return [...list].sort((a, b) => order[a.riskLevel] - order[b.riskLevel] || a.name.localeCompare(b.name));
  });

  selectedMother = computed(() => {
    return this.svc.getMotherById(this.selectedMotherId()) || this.filteredMothers()[0] || null;
  });

  activeAlertForMother = computed(() => {
    const mother = this.selectedMother();
    if (!mother) return null;
    return this.svc.alerts().find((a) => a.motherId === mother.id && a.status !== 'resolved') || null;
  });

  getSign(code: DangerSignCode) {
    return DANGER_SIGNS[code];
  }

  getSignLabels(codes: DangerSignCode[]): string {
    return codes.map((c) => DANGER_SIGNS[c]?.shortLabel || c).join(', ');
  }

  openTransportModal(alert: Alert) {
    this.transportAlert.set(alert);
  }

  updateStatus(alertId: string, status: AlertStatus) {
    this.svc.updateAlertStatus(
      alertId,
      status,
      `Clinical status updated to ${status.replace('_', ' ').toUpperCase()} by ${this.logAuthor}`
    );
  }

  submitResponseLog() {
    const alert = this.activeAlertForMother();
    if (!alert || !this.logNotes) return;
    this.svc.addResponseLog(alert.id, this.logAuthor, this.logRole, this.logAction, this.logNotes);
    this.logNotes = '';
  }

  handleModalEnrol() {
    if (!this.enrolModalData.name || !this.enrolModalData.phone) return;
    const created = this.svc.enrollMother(this.enrolModalData);
    this.selectedMotherId.set(created.id);
    this.showEnrolModal.set(false);
  }
}
