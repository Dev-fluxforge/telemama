import { Component, EventEmitter, Output, inject, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Alert, DANGER_SIGNS, DangerSignCode } from '../core/models';
import { TelemamaService } from '../core/telemama.service';

@Component({
  selector: 'app-alert-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <article
      class="rounded-2xl border-2 transition-all p-5 shadow-sm"
      [class]="alert().urgency === 'red' ? 'border-urgent bg-urgent-50/40' : 'border-amber-300 bg-amber-50/50'"
    >
      <!-- Header -->
      <div class="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider"
              [class]="alert().urgency === 'red' ? 'bg-urgent text-white' : 'bg-amber-600 text-white'"
            >
              {{ alert().urgency === 'red' ? '🚨 URGENT RED ALERT' : '⚠️ AMBER WARNING' }}
            </span>
            <span class="text-xs text-stone-500 font-medium">via {{ alert().channel | uppercase }}</span>
          </div>
          <h3 class="text-xl font-bold text-charcoal mt-1">{{ alert().motherName }}</h3>
          <p class="text-xs text-stone-600">
            {{ alert().facilityName }} • Reported {{ alert().timestamp | date: 'shortTime' }}
          </p>
        </div>

        <div class="text-right">
          <span
            class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
            [class]="statusBadgeClass(alert().status)"
          >
            {{ formatStatus(alert().status) }}
          </span>
        </div>
      </div>

      <!-- Danger signs reported -->
      <div class="my-4">
        <p class="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Reported Danger Signs:</p>
        <div class="flex flex-wrap gap-2">
          @for (sign of alert().signs; track sign) {
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold border shadow-xs"
              [class]="signSeverityClass(sign)"
            >
              <span class="text-base">{{ getSign(sign).icon }}</span>
              <span>{{ getSign(sign).shortLabel }}</span>
            </span>
          }
        </div>
      </div>

      @if (alert().customMessage) {
        <p class="text-sm bg-white/80 p-3 rounded-xl border border-stone-200 text-stone-700 italic mb-4">
          "{{ alert().customMessage }}"
        </p>
      }

      <!-- Recommended Action -->
      @if (alert().recommendedActions.length) {
        <div class="bg-white p-3.5 rounded-xl border border-stone-200 mb-4 text-xs">
          <p class="font-bold text-charcoal-800 uppercase tracking-wider mb-1.5">Recommended Clinical Protocol:</p>
          <ul class="space-y-1 text-stone-700 list-disc list-inside">
            @for (action of alert().recommendedActions; track action) {
              <li>{{ action }}</li>
            }
          </ul>
        </div>
      }

      <!-- Emergency Contacts & Action Buttons -->
      <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-200">
        <a
          [href]="'tel:' + alert().motherPhone"
          class="tm-btn tm-btn-primary text-xs py-2 px-3.5 min-h-[40px]"
          aria-label="Call Mother"
        >
          📞 Call Mother
        </a>

        <a
          [href]="'tel:' + alert().familyPhone"
          class="tm-btn tm-btn-outline text-xs py-2 px-3.5 min-h-[40px]"
          aria-label="Call Family Support"
        >
          👨‍👩‍👧 Call Family ({{ alert().familyName }})
        </a>

        <button
          type="button"
          (click)="onDispatchTransport.emit(alert())"
          class="tm-btn tm-btn-forest text-xs py-2 px-3.5 min-h-[40px]"
        >
          🚑 Dispatch Transport
        </button>

        @if (alert().status !== 'resolved') {
          <button
            type="button"
            (click)="onResolveAlert.emit(alert().id)"
            class="tm-btn tm-btn-ghost text-xs py-2 px-3.5 min-h-[40px] text-stone-600 hover:text-stone-900 ml-auto"
          >
            ✓ Mark Handled
          </button>
        }
      </div>
    </article>
  `,
})
export class AlertCardComponent {
  alert = input.required<Alert>();
  @Output() onDispatchTransport = new EventEmitter<Alert>();
  @Output() onResolveAlert = new EventEmitter<string>();

  svc = inject(TelemamaService);

  getSign(code: DangerSignCode) {
    return DANGER_SIGNS[code];
  }

  signSeverityClass(code: DangerSignCode) {
    const isCrit = DANGER_SIGNS[code]?.severity === 'critical';
    return isCrit
      ? 'bg-urgent-100 text-urgent-800 border-urgent-300'
      : 'bg-amber-100 text-amber-900 border-amber-300';
  }

  formatStatus(status: string) {
    return status.replace('_', ' ').toUpperCase();
  }

  statusBadgeClass(status: string) {
    switch (status) {
      case 'open':
        return 'bg-urgent text-white';
      case 'contacted':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'transport_dispatched':
        return 'bg-purple-100 text-purple-800 border border-purple-300';
      case 'resolved':
        return 'bg-forest-100 text-forest-800 border border-forest-300';
      default:
        return 'bg-stone-100 text-stone-800';
    }
  }
}
