import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Alert, DANGER_SIGNS, DangerSignCode } from '../../core/models';
import { TelemamaService } from '../../core/telemama.service';
import { TransportModalComponent } from '../../shared/transport-modal.component';

@Component({
  selector: 'app-family',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, RouterLink, TransportModalComponent],
  template: `
    <div class="space-y-6">
      <!-- Header with Role & Mother Context -->
      <div class="tm-card p-5 bg-white flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-forest">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-forest-100 text-forest flex items-center justify-center text-2xl font-bold">
            👨‍👩‍👧
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl sm:text-2xl font-bold text-charcoal">Family & Support Person Portal</h1>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-100 text-forest-800">
                Caregiver Mode
              </span>
            </div>
            @if (currentMother(); as cm) {
              <p class="text-xs text-stone-500">
                Monitoring: <strong class="text-charcoal">{{ cm.name }}</strong> •
                Nominated Contact: <strong class="text-charcoal">{{ cm.nominatedFamilyName }}</strong> ({{ cm.nominatedFamilyRelation }})
              </p>
            }
          </div>
        </div>

        <!-- Quick Switch Mother for demo -->
        <div class="flex items-center gap-2 text-xs">
          <label for="family-mother-select" class="text-stone-500 font-medium hidden sm:inline">Select Mother:</label>
          <select
            id="family-mother-select"
            [ngModel]="svc.currentMotherId()"
            (ngModelChange)="svc.switchMother($event)"
            class="tm-input text-xs min-h-[38px] py-1 px-2.5 bg-stone-50"
          >
            @for (m of svc.mothers(); track m.id) {
              <option [value]="m.id">{{ m.name }} ({{ m.nominatedFamilyName }} - {{ m.nominatedFamilyRelation }})</option>
            }
          </select>
        </div>
      </div>

      <!-- Active Alerts Section -->
      @if (motherAlerts().length > 0) {
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-charcoal flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-urgent animate-ping"></span>
              Alert Inbox: {{ motherAlerts().length }} Active Notification{{ motherAlerts().length > 1 ? 's' : '' }}
            </h2>
            <span class="text-xs font-semibold text-urgent">Action Required</span>
          </div>

          @for (alert of motherAlerts(); track alert.id) {
            <div
              class="tm-card p-6 border-2 transition-all shadow-md"
              [class]="alert.urgency === 'red' ? 'border-urgent bg-urgent-50/30' : 'border-amber-400 bg-amber-50/40'"
            >
              <!-- Alert Header -->
              <div class="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-stone-200">
                <div>
                  <div class="flex items-center gap-2">
                    <span
                      class="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-white"
                      [class]="alert.urgency === 'red' ? 'bg-urgent animate-pulse' : 'bg-amber-600'"
                    >
                      {{ alert.urgency === 'red' ? '🚨 URGENT RED ALERT' : '⚠️ WATCH ALERT' }}
                    </span>
                    <span class="text-xs text-stone-500 font-medium">via {{ alert.channel | uppercase }}</span>
                  </div>
                  <h3 class="text-2xl font-bold text-charcoal mt-1.5">{{ alert.motherName }}</h3>
                  <p class="text-xs text-stone-600">
                    Facility: {{ alert.facilityName }} • Reported {{ alert.timestamp | date: 'shortTime' }}
                  </p>
                </div>

                <div class="text-right">
                  <span
                    class="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                    [class]="alert.status === 'open' ? 'bg-urgent' : 'bg-forest'"
                  >
                    {{ alert.status.replace('_', ' ') }}
                  </span>
                </div>
              </div>

              <!-- Reported Signs -->
              <div class="my-4">
                <span class="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">
                  Symptoms Reported by Mother:
                </span>
                <div class="flex flex-wrap gap-2">
                  @for (s of alert.signs; track s) {
                    <span
                      class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold border shadow-xs"
                      [class]="getSign(s).severity === 'critical' ? 'bg-urgent-100 border-urgent-300 text-urgent-900' : 'bg-amber-100 border-amber-300 text-amber-900'"
                    >
                      <span class="text-lg">{{ getSign(s).icon }}</span>
                      <span>{{ getSign(s).shortLabel }}</span>
                    </span>
                  }
                </div>
              </div>

              <!-- CLEAR "WHAT TO DO NOW" GUIDANCE FOR FAMILY -->
              <div class="my-5 p-5 bg-white rounded-2xl border-2 border-forest-600/30 shadow-xs space-y-3">
                <div class="flex items-center gap-2 text-forest-900 font-extrabold text-sm sm:text-base border-b border-stone-100 pb-2">
                  <span>🛡️</span>
                  <span>WHAT YOU MUST DO RIGHT NOW:</span>
                </div>

                <div class="space-y-2.5 text-xs sm:text-sm text-charcoal">
                  <div class="flex items-start gap-2.5">
                    <span class="w-6 h-6 rounded-full bg-forest text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      <strong>Go to {{ alert.motherName }} immediately.</strong> Do not leave her alone. Keep her lying down and calm.
                    </p>
                  </div>

                  @for (sign of alert.signs; track sign) {
                    @if (getSign(sign).familyGuidance) {
                      <div class="flex items-start gap-2.5">
                        <span class="w-6 h-6 rounded-full bg-terracotta text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          2
                        </span>
                        <p>
                          <strong>{{ getSign(sign).shortLabel }}:</strong> {{ getSign(sign).familyGuidance }}
                        </p>
                      </div>
                    }
                  }

                  <div class="flex items-start gap-2.5">
                    <span class="w-6 h-6 rounded-full bg-forest text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <p>
                      <strong>Call {{ alert.facilityName }}</strong> to let the triage midwife know you are on your way so they ready the emergency room.
                    </p>
                  </div>

                  <div class="flex items-start gap-2.5">
                    <span class="w-6 h-6 rounded-full bg-forest text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </span>
                    <p>
                      <strong>Dispatch community transport</strong> using the one-tap button below if you do not have immediate vehicle access.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Quick One-Tap Actions -->
              <div class="pt-2 flex flex-wrap items-center gap-3">
                <a
                  [href]="'tel:' + alert.motherPhone"
                  class="tm-btn tm-btn-primary text-xs sm:text-sm py-2.5 px-4 font-bold"
                  aria-label="Call Mother"
                >
                  📞 Call {{ alert.motherName }} Now
                </a>

                <a
                  [href]="'tel:' + alert.facilityPhone"
                  class="tm-btn tm-btn-forest text-xs sm:text-sm py-2.5 px-4 font-bold"
                  aria-label="Call Enrolled Clinic"
                >
                  🏥 Call {{ alert.facilityName }}
                </a>

                <button
                  type="button"
                  (click)="openTransportModal(alert)"
                  class="tm-btn bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm py-2.5 px-4 font-bold"
                >
                  🚑 Request Emergency Transport
                </button>

                @if (alert.status !== 'resolved') {
                  <button
                    type="button"
                    (click)="markAlertHandled(alert.id)"
                    class="tm-btn tm-btn-ghost text-xs py-2.5 px-4 text-stone-600 hover:text-stone-900 ml-auto"
                  >
                    ✓ Mark I'm With Her Now
                  </button>
                }
              </div>
            </div>
          }
        </div>
      } @else {
        <!-- Empty / Peaceful State -->
        <div class="tm-card p-8 sm:p-12 text-center space-y-4 bg-white border border-stone-200">
          <div class="w-16 h-16 rounded-full bg-forest-100 text-forest text-3xl flex items-center justify-center mx-auto">
            ✓
          </div>
          <div class="max-w-md mx-auto space-y-2">
            <h2 class="text-xl sm:text-2xl font-bold text-charcoal">No Active Alerts</h2>
            @if (currentMother(); as cm) {
              <p class="text-sm text-stone-600">
                {{ cm.name }} has no open danger sign warnings. Her health records and scheduled check-ins are normal.
              </p>
              <p class="text-xs text-stone-500">
                Last check-in: <strong class="text-charcoal">{{ cm.lastCheckInDate }}</strong>
              </p>
            }
          </div>

          <div class="pt-4 flex flex-wrap justify-center gap-3">
            <a
              routerLink="/mother"
              class="tm-btn tm-btn-primary text-xs font-bold py-2 px-4"
            >
              Simulate Mother Check-In →
            </a>
            <a
              routerLink="/ussd"
              class="tm-btn tm-btn-outline text-xs font-bold py-2 px-4"
            >
              Trigger USSD Danger Alert →
            </a>
          </div>
        </div>
      }

      <!-- Quick Tips Card for Support Persons -->
      <div class="tm-card p-5 bg-cream-50 border border-stone-200">
        <h3 class="text-sm font-bold text-charcoal mb-2 flex items-center gap-2">
          <span>💡</span> Caregiver Quick Reference Guide for Nigeria
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-700">
          <div class="p-3 bg-white rounded-xl border border-stone-200">
            <div class="font-bold text-terracotta mb-1">Heavy Bleeding</div>
            <p>Bleeding soaking a cloth in under an hour is an emergency. Never give cold herbal drinks; keep mother warm and transport immediately.</p>
          </div>
          <div class="p-3 bg-white rounded-xl border border-stone-200">
            <div class="font-bold text-amber-800 mb-1">Severe Headaches</div>
            <p>Can indicate high blood pressure convulsions (eclampsia). Do not put spoons or fingers into mouth; turn her on her side.</p>
          </div>
          <div class="p-3 bg-white rounded-xl border border-stone-200">
            <div class="font-bold text-forest-800 mb-1">Baby Not Sucking</div>
            <p>Newborns need milk every 2-3 hours. Inability to latch or feeling cold requires immediate clinical examination.</p>
          </div>
        </div>
      </div>

      <!-- Transport Simulation Modal -->
      @if (transportAlert()) {
        <app-transport-modal
          [alert]="transportAlert()"
          (onClose)="transportAlert.set(null)"
        />
      }
    </div>
  `,
})
export class FamilyComponent {
  svc = inject(TelemamaService);

  transportAlert = signal<Alert | null>(null);

  currentMother = computed(() => this.svc.currentMother());

  motherAlerts = computed(() => {
    const mother = this.currentMother();
    if (!mother) return [];
    return this.svc.getAlertsForMother(mother.id);
  });

  getSign(code: DangerSignCode) {
    return DANGER_SIGNS[code];
  }

  openTransportModal(alert: Alert) {
    this.transportAlert.set(alert);
  }

  markAlertHandled(alertId: string) {
    this.svc.updateAlertStatus(
      alertId,
      'contacted',
      'Family support person confirmed presence and contact with mother.',
      'Family Support Person'
    );
  }
}
