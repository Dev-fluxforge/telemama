import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DangerSignCode } from '../../core/models';
import { TelemamaService } from '../../core/telemama.service';

interface UssdNode {
  id: string;
  title: string;
  lines: string[];
  options?: { key: string; label: string; targetId: string; action?: () => void }[];
  isTerminal?: boolean;
}

@Component({
  selector: 'app-ussd',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-full text-xs font-bold mb-2">
            <span>📶</span> 2G / Zero-Data USSD Engine
          </div>
          <h1 class="text-3xl font-extrabold text-charcoal">Interactive USSD Basic Phone Simulation</h1>
          <p class="text-stone-600 max-w-2xl mt-1 text-sm sm:text-base">
            In Nigeria, over 60% of rural mothers rely on 2G feature phones without data. Telemama operates on standard USSD short code (<code class="bg-stone-200 px-1.5 py-0.5 rounded text-charcoal font-mono font-bold">*384*24#</code>) without internet or smartphone requirements.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="resetSession()"
            class="tm-btn tm-btn-outline text-xs py-2 px-3.5"
          >
            🔄 Restart USSD Session
          </button>
          <a
            routerLink="/clinic"
            class="tm-btn tm-btn-primary text-xs py-2 px-3.5"
          >
            🏥 View Clinic Dashboard
          </a>
        </div>
      </div>

      <!-- Main Layout: Phone on left/center, Pitch Explainer & Protocol Inspector on right -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Feature Phone Simulator Column (5 cols) -->
        <div class="lg:col-span-5 flex justify-center">
          <!-- Physical Feature Phone Body -->
          <div class="w-[320px] sm:w-[340px] bg-stone-900 rounded-[45px] p-5 shadow-2xl border-4 border-stone-700 select-none relative">
            <!-- Earpiece speaker slit -->
            <div class="w-16 h-1.5 bg-stone-700 rounded-full mx-auto mb-4"></div>

            <!-- Phone Screen Bezel -->
            <div class="bg-stone-950 p-3.5 rounded-2xl border-2 border-stone-800 shadow-inner">
              <!-- Monochromatic LCD Screen -->
              <div class="bg-[#9EBA89] text-[#1E3018] font-mono rounded-lg p-3 min-h-[220px] shadow-inner border border-[#8AA775] flex flex-col justify-between">
                <!-- Status bar -->
                <div class="flex justify-between items-center text-[10px] font-bold border-b border-[#7C9768] pb-1 mb-2">
                  <span>📶 MTN-NG 2G</span>
                  <span>TEL: *384*24#</span>
                  <span>🔋 85%</span>
                </div>

                <!-- USSD Content Area -->
                <div class="text-xs leading-relaxed flex-1 overflow-y-auto phone-scroll">
                  @if (!isSessionActive()) {
                    <div class="text-center py-6">
                      <p class="font-bold text-sm mb-1">Telemama Nigeria</p>
                      <p class="text-[11px] mb-4">Maternal & Newborn Care</p>
                      <button
                        type="button"
                        (click)="startSession()"
                        class="bg-[#1E3018] text-[#9EBA89] px-4 py-2 rounded font-bold text-xs hover:opacity-90 active:scale-95 transition-all"
                      >
                        Dial *384*24#
                      </button>
                    </div>
                  } @else {
                    <div>
                      <p class="font-bold border-b border-[#7C9768]/60 pb-1 mb-1.5 text-[11px]">
                        {{ currentNode().title }}
                      </p>

                      @for (line of currentNode().lines; track line) {
                        <p class="text-[11px] mb-1">{{ line }}</p>
                      }

                      @if (currentNode().options && currentNode().options!.length > 0) {
                        <div class="mt-2 space-y-1">
                          @for (opt of currentNode().options; track opt.key) {
                            <div class="text-[11px] font-semibold">
                              {{ opt.key }}. {{ opt.label }}
                            </div>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>

                <!-- USSD Input box on phone screen -->
                @if (isSessionActive() && !currentNode().isTerminal) {
                  <div class="mt-2 pt-1 border-t border-[#7C9768] flex items-center justify-between text-xs">
                    <span class="text-[10px] font-bold">Reply:</span>
                    <span class="font-bold bg-[#8CA777] px-2 py-0.5 rounded text-right min-w-[30px]">
                      {{ enteredInput() || '_' }}
                    </span>
                  </div>
                }
              </div>
            </div>

            <!-- Soft Navigation Keys (Left, Nav, Right) -->
            <div class="grid grid-cols-3 gap-2 mt-4 px-2">
              <button
                type="button"
                (click)="submitReply()"
                [disabled]="!isSessionActive() || currentNode().isTerminal"
                class="bg-stone-800 text-stone-200 py-2 rounded-xl text-xs font-bold border border-stone-600 hover:bg-stone-700 active:scale-95 disabled:opacity-30"
              >
                Send / OK
              </button>

              <button
                type="button"
                (click)="startSession()"
                class="bg-forest-800 text-forest-100 py-2 rounded-xl text-xs font-bold border border-forest-600 hover:bg-forest-700 active:scale-95"
              >
                📞 Dial
              </button>

              <button
                type="button"
                (click)="resetSession()"
                class="bg-urgent-900 text-urgent-100 py-2 rounded-xl text-xs font-bold border border-urgent-700 hover:bg-urgent-800 active:scale-95"
              >
                End / Back
              </button>
            </div>

            <!-- Numeric Keypad Grid (3x4) -->
            <div class="grid grid-cols-3 gap-2 mt-4 px-2">
              @for (key of keyPadKeys; track key.num) {
                <button
                  type="button"
                  (click)="pressKey(key.num)"
                  class="bg-stone-800 hover:bg-stone-700 active:bg-stone-600 active:scale-95 text-stone-100 py-2.5 rounded-xl border border-stone-700 flex flex-col items-center justify-center transition-all shadow-sm"
                >
                  <span class="text-base font-bold leading-tight">{{ key.num }}</span>
                  <span class="text-[9px] text-stone-400 uppercase tracking-widest leading-none">{{ key.sub }}</span>
                </button>
              }
            </div>

            <!-- Feature phone brand label -->
            <div class="text-center mt-3 text-[10px] tracking-widest text-stone-500 font-bold uppercase">
              TELEMAMA 2G COMM
            </div>
          </div>
        </div>

        <!-- Right Side: Explainer for Judges, Live Log & Quick Shortcuts (7 cols) -->
        <div class="lg:col-span-7 space-y-5">
          <!-- Quick Judge Trigger Bar -->
          <div class="tm-card p-5 border-l-4 border-l-terracotta bg-white">
            <h2 class="text-lg font-bold text-charcoal flex items-center gap-2">
              <span>⚡</span> Quick Simulation Shortcuts for Judges
            </h2>
            <p class="text-xs text-stone-600 mt-1 mb-3">
              Click any scenario to instantly navigate the USSD tree and witness real-time clinic/family alert triggers:
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                (click)="simulateScenario('bleeding')"
                class="p-3 text-left rounded-xl border-2 border-urgent-300 bg-urgent-50/60 hover:bg-urgent-100 text-urgent-900 font-semibold text-xs transition-all"
              >
                <div class="flex items-center gap-1.5 font-bold text-sm mb-0.5">
                  <span>🩸</span> Report Heavy Bleeding (SOS)
                </div>
                <div class="text-[11px] text-urgent-800">Triggers immediate Red Alert & triage dispatch</div>
              </button>

              <button
                type="button"
                (click)="simulateScenario('headache')"
                class="p-3 text-left rounded-xl border-2 border-amber-300 bg-amber-50/60 hover:bg-amber-100 text-amber-900 font-semibold text-xs transition-all"
              >
                <div class="flex items-center gap-1.5 font-bold text-sm mb-0.5">
                  <span>🤕</span> Report Severe Headache / BP
                </div>
                <div class="text-[11px] text-amber-800">Pre-eclampsia risk trigger</div>
              </button>

              <button
                type="button"
                (click)="simulateScenario('well')"
                class="p-3 text-left rounded-xl border-2 border-forest-300 bg-forest-50/60 hover:bg-forest-100 text-forest-900 font-semibold text-xs transition-all"
              >
                <div class="flex items-center gap-1.5 font-bold text-sm mb-0.5">
                  <span>✓</span> Daily Routine Check-in (All Well)
                </div>
                <div class="text-[11px] text-forest-800">Logs stable milestone check-in</div>
              </button>

              <button
                type="button"
                (click)="simulateScenario('baby')"
                class="p-3 text-left rounded-xl border-2 border-purple-300 bg-purple-50/60 hover:bg-purple-100 text-purple-900 font-semibold text-xs transition-all"
              >
                <div class="flex items-center gap-1.5 font-bold text-sm mb-0.5">
                  <span>🍼</span> Newborn Feeding Warning
                </div>
                <div class="text-[11px] text-purple-800">Baby unable to latch check</div>
              </button>
            </div>
          </div>

          <!-- USSD Live Protocol & Event Stream -->
          <div class="tm-card p-5 bg-stone-900 text-stone-200 font-mono text-xs shadow-lg">
            <div class="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
              <span class="text-forest-400 font-bold flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-forest-500 animate-ping"></span>
                GSM Network Gateway Log (Live)
              </span>
              <span class="text-[10px] text-stone-500">Short Code 384*24</span>
            </div>

            <div class="space-y-2 max-h-48 overflow-y-auto phone-scroll text-[11px]">
              @for (log of networkLogs(); track log.id) {
                <div class="flex items-start gap-2">
                  <span class="text-stone-500 shrink-0">[{{ log.time }}]</span>
                  <span [class]="logClass(log.type)">{{ log.message }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Low-Bandwidth Africa-First Architectural Pillars -->
          <div class="tm-card p-5">
            <h3 class="font-bold text-sm text-charcoal mb-3">Why Telemama's 2G Architecture Saves Lives:</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div class="p-3 rounded-xl bg-cream-100 border border-cream-300">
                <div class="font-bold text-terracotta mb-1">0% Data Needed</div>
                <p class="text-stone-600">
                  Runs over GSM signalling channels (SS7). Functions even when mother has zero airtime balance.
                </p>
              </div>

              <div class="p-3 rounded-xl bg-forest-50 border border-forest-200">
                <div class="font-bold text-forest-800 mb-1">Instant Delivery</div>
                <p class="text-stone-600">
                  Latency under 2 seconds. Directly bypasses congested mobile web networks.
                </p>
              </div>

              <div class="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div class="font-bold text-amber-900 mb-1">Closed-Loop Triage</div>
                <p class="text-stone-600">
                  Every USSD danger sign simultaneously alerts family SMS and facility dashboard in real time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class UssdComponent {
  svc = inject(TelemamaService);

  keyPadKeys = [
    { num: '1', sub: '.,-' },
    { num: '2', sub: 'ABC' },
    { num: '3', sub: 'DEF' },
    { num: '4', sub: 'GHI' },
    { num: '5', sub: 'JKL' },
    { num: '6', sub: 'MNO' },
    { num: '7', sub: 'PQRS' },
    { num: '8', sub: 'TUV' },
    { num: '9', sub: 'WXYZ' },
    { num: '*', sub: 'SYM' },
    { num: '0', sub: 'SPACE' },
    { num: '#', sub: 'HASH' },
  ];

  isSessionActive = signal<boolean>(true);
  enteredInput = signal<string>('');
  currentMenuId = signal<string>('root');

  networkLogs = signal<{ id: string; time: string; message: string; type: 'info' | 'alert' | 'success' }[]>([
    {
      id: 'l1',
      time: '11:20:02',
      message: 'USSD Session initiated: *384*24# from MSISDN +2348034518920 (Folake Adeyemi)',
      type: 'info',
    },
    {
      id: 'l2',
      time: '11:20:03',
      message: 'Menu dispatched: Telemama Main Menu (English)',
      type: 'info',
    },
  ]);

  // Full Nigerian USSD menu tree definition
  menuTree: Record<string, UssdNode> = {
    root: {
      id: 'root',
      title: 'TELEMAMA NIGERIA (*384*24#)',
      lines: ['Welcome Folake Adeyemi! (Day 4 Postnatal)', 'Select an option:'],
      options: [
        { key: '1', label: 'Daily Health Check', targetId: 'daily_check' },
        { key: '2', label: 'Report Danger Signs (SOS)', targetId: 'danger_menu' },
        { key: '3', label: "Check Baby's Health", targetId: 'baby_menu' },
        { key: '4', label: 'Request Midwife Callback', targetId: 'callback_menu' },
        { key: '5', label: 'My Enrolled Facility', targetId: 'facility_info' },
      ],
    },
    daily_check: {
      id: 'daily_check',
      title: 'DAILY CHECK-IN (DAY 4)',
      lines: ['How are you and baby feeling this morning?'],
      options: [
        {
          key: '1',
          label: 'I feel strong & well (No danger signs)',
          targetId: 'done_well',
          action: () => {
            this.svc.submitCheckIn({
              motherId: this.svc.currentMotherId(),
              signs: [],
              wellbeing: 'good',
              channel: 'ussd',
              notes: 'USSD Daily check: Mother reports feeling well, no danger signs.',
            });
            this.addLog('SUCCESS: Mother check-in recorded. Risk status: GREEN. Adeoyo Clinic updated.', 'success');
          },
        },
        {
          key: '2',
          label: 'Mild tiredness or mild stomach cramps',
          targetId: 'done_mild',
          action: () => {
            this.svc.submitCheckIn({
              motherId: this.svc.currentMotherId(),
              signs: [],
              wellbeing: 'fair',
              channel: 'ussd',
              notes: 'USSD Check: Mild cramps/tiredness. Advised hydration and rest.',
            });
            this.addLog('INFO: Mild symptoms logged. Risk status: AMBER. Monitoring scheduled.', 'info');
          },
        },
        { key: '3', label: 'I have severe pain or bleeding', targetId: 'danger_menu' },
        { key: '0', label: 'Back to main menu', targetId: 'root' },
      ],
    },
    done_well: {
      id: 'done_well',
      title: 'CHECK-IN CONFIRMED',
      lines: [
        'A dupe! Thank you Folake.',
        'Your daily check-in is recorded.',
        'Adeoyo Maternity Hospital and Babatunde are notified that you are doing well.',
        'Next routine check: Tomorrow 8:00 AM.',
      ],
      isTerminal: true,
    },
    done_mild: {
      id: 'done_mild',
      title: 'CARE ADVICE',
      lines: [
        'Rest with feet elevated and drink clean water.',
        'Mild postpartum cramping is common during breastfeeding.',
        'If pain worsens or bleeding increases, dial *384*24# immediately.',
      ],
      isTerminal: true,
    },
    danger_menu: {
      id: 'danger_menu',
      title: '⚠️ REPORT DANGER SIGN',
      lines: ['Select urgent symptom:'],
      options: [
        {
          key: '1',
          label: 'Heavy bleeding (soaked pad in 1h)',
          targetId: 'sos_sent',
          action: () => {
            this.svc.submitCheckIn({
              motherId: this.svc.currentMotherId(),
              signs: ['heavy_bleeding'],
              wellbeing: 'poor',
              channel: 'ussd',
              notes: 'USSD Emergency: Heavy bleeding reported.',
            });
            this.addLog('🚨 CRITICAL ALERT: Heavy bleeding reported via USSD! SMS blasted to Babatunde and Adeoyo Hospital.', 'alert');
          },
        },
        {
          key: '2',
          label: 'Severe headache or blurred sight',
          targetId: 'sos_sent',
          action: () => {
            this.svc.submitCheckIn({
              motherId: this.svc.currentMotherId(),
              signs: ['severe_headache', 'blurred_vision'],
              wellbeing: 'poor',
              channel: 'ussd',
              notes: 'USSD Emergency: Severe headache & blurred vision (Pre-eclampsia danger).',
            });
            this.addLog('🚨 CRITICAL ALERT: Impending eclampsia danger signs reported via USSD!', 'alert');
          },
        },
        {
          key: '3',
          label: 'High fever and uncontrollable shivering',
          targetId: 'sos_sent',
          action: () => {
            this.svc.submitCheckIn({
              motherId: this.svc.currentMotherId(),
              signs: ['high_fever'],
              wellbeing: 'poor',
              channel: 'ussd',
              notes: 'USSD Alert: High fever/chills.',
            });
            this.addLog('⚠️ ALERT: Postnatal infection/fever reported.', 'alert');
          },
        },
        {
          key: '4',
          label: 'Baby refusing breast or too weak',
          targetId: 'sos_sent',
          action: () => {
            this.svc.submitCheckIn({
              motherId: this.svc.currentMotherId(),
              signs: ['baby_not_feeding'],
              wellbeing: 'poor',
              channel: 'ussd',
              notes: 'USSD Alert: Baby refusing breast/feeding.',
            });
            this.addLog('🚨 NEONATAL ALERT: Baby refusing breast reported.', 'alert');
          },
        },
        { key: '0', label: 'Back', targetId: 'root' },
      ],
    },
    sos_sent: {
      id: 'sos_sent',
      title: '🚨 EMERGENCY DISPATCHED',
      lines: [
        'URGENT ALERT SENT!',
        '1. Lie flat with legs raised.',
        '2. Babatunde (+2348023341189) has been notified.',
        '3. Adeoyo Maternity is preparing emergency bay.',
        'Transport assistance is coordinating.',
      ],
      isTerminal: true,
    },
    baby_menu: {
      id: 'baby_menu',
      title: "BABY'S HEALTH CHECK",
      lines: ['How is your newborn today?'],
      options: [
        {
          key: '1',
          label: 'Baby latching and suckling well',
          targetId: 'done_well',
          action: () => {
            this.addLog('SUCCESS: Baby latching confirmed.', 'success');
          },
        },
        {
          key: '2',
          label: 'Baby breathing fast or grunting',
          targetId: 'sos_sent',
          action: () => {
            this.svc.submitCheckIn({
              motherId: this.svc.currentMotherId(),
              signs: ['baby_breathing_fast'],
              wellbeing: 'poor',
              channel: 'ussd',
            });
            this.addLog('🚨 NEONATAL EMERGENCY: Rapid breathing/grunting reported.', 'alert');
          },
        },
        {
          key: '3',
          label: 'Baby cold to touch or floppy',
          targetId: 'sos_sent',
          action: () => {
            this.svc.submitCheckIn({
              motherId: this.svc.currentMotherId(),
              signs: ['baby_cold_floppy'],
              wellbeing: 'poor',
              channel: 'ussd',
            });
            this.addLog('🚨 NEONATAL EMERGENCY: Hypothermia/floppiness reported.', 'alert');
          },
        },
        { key: '0', label: 'Back', targetId: 'root' },
      ],
    },
    callback_menu: {
      id: 'callback_menu',
      title: 'REQUEST CALLBACK',
      lines: ['A midwife from Adeoyo Maternity Hospital will phone your line in 5 minutes.', 'Confirm callback request?'],
      options: [
        {
          key: '1',
          label: 'Yes, call my phone now',
          targetId: 'callback_confirmed',
          action: () => {
            this.svc.triggerEmergencySOS(this.svc.currentMotherId(), 'Mother requested urgent phone triage callback via USSD.');
            this.addLog('INFO: Callback request queued for Nurse on duty at Adeoyo.', 'info');
          },
        },
        { key: '0', label: 'Cancel', targetId: 'root' },
      ],
    },
    callback_confirmed: {
      id: 'callback_confirmed',
      title: 'CALLBACK BOOKED',
      lines: [
        'Request confirmed.',
        'Keep your phone line free.',
        'Duty Midwife is dialing you from Adeoyo Maternity.',
      ],
      isTerminal: true,
    },
    facility_info: {
      id: 'facility_info',
      title: 'ENROLLED FACILITY',
      lines: [
        'Facility: Adeoyo Maternity Teaching Hospital',
        'LGA: Ibadan North, Oyo State',
        'Emergency Desk: 0800 233 6960',
        'Your Family Contact: Babatunde (+234 802 334 1189)',
      ],
      options: [{ key: '0', label: 'Back', targetId: 'root' }],
    },
  };

  currentNode = computed<UssdNode>(() => {
    return this.menuTree[this.currentMenuId()] || this.menuTree['root'];
  });

  startSession() {
    this.isSessionActive.set(true);
    this.currentMenuId.set('root');
    this.enteredInput.set('');
    this.addLog('USSD Session started (*384*24#)', 'info');
  }

  resetSession() {
    this.currentMenuId.set('root');
    this.enteredInput.set('');
    this.isSessionActive.set(true);
    this.addLog('USSD Session reset to root', 'info');
  }

  pressKey(key: string) {
    if (!this.isSessionActive()) {
      if (key === '1') this.startSession();
      return;
    }
    if (this.currentNode().isTerminal) {
      this.resetSession();
      return;
    }

    if (key === '*' || key === '#') return;

    // Append key or set input
    this.enteredInput.update((prev) => (prev.length < 2 ? prev + key : key));
  }

  submitReply() {
    const input = this.enteredInput().trim();
    if (!input) return;

    const node = this.currentNode();
    const match = node.options?.find((o) => o.key === input);

    if (match) {
      if (match.action) match.action();
      this.currentMenuId.set(match.targetId);
      this.enteredInput.set('');
      this.addLog(`User selected option [${match.key}] -> ${match.label}`, 'info');
    } else {
      this.addLog(`Invalid input: [${input}]`, 'alert');
      this.enteredInput.set('');
    }
  }

  addLog(message: string, type: 'info' | 'alert' | 'success') {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.networkLogs.update((prev) => [{ id: 'l-' + Date.now(), time, message, type }, ...prev]);
  }

  logClass(type: 'info' | 'alert' | 'success') {
    switch (type) {
      case 'alert':
        return 'text-red-400 font-bold';
      case 'success':
        return 'text-green-400 font-bold';
      default:
        return 'text-stone-300';
    }
  }

  simulateScenario(scenario: 'bleeding' | 'headache' | 'well' | 'baby') {
    this.startSession();
    if (scenario === 'bleeding') {
      this.currentMenuId.set('danger_menu');
      this.enteredInput.set('1');
      setTimeout(() => this.submitReply(), 300);
    } else if (scenario === 'headache') {
      this.currentMenuId.set('danger_menu');
      this.enteredInput.set('2');
      setTimeout(() => this.submitReply(), 300);
    } else if (scenario === 'well') {
      this.currentMenuId.set('daily_check');
      this.enteredInput.set('1');
      setTimeout(() => this.submitReply(), 300);
    } else if (scenario === 'baby') {
      this.currentMenuId.set('baby_menu');
      this.enteredInput.set('2');
      setTimeout(() => this.submitReply(), 300);
    }
  }
}
