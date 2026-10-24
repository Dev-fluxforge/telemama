import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TelemamaService } from '../../core/telemama.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-12">
      <!-- Hero Section with Animated Ambient Gradients and Floating Badges -->
      <section class="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800 text-white p-6 sm:p-12 lg:p-16 shadow-2xl border border-forest-700/50">
        <!-- Floating Animated Ambient Orbs -->
        <div class="absolute -right-16 -bottom-16 w-96 h-96 rounded-full bg-forest-600/30 pointer-events-none blur-3xl animate-pulse"></div>
        <div class="absolute right-1/3 -top-20 w-80 h-80 rounded-full bg-terracotta/25 pointer-events-none blur-3xl animate-float"></div>

        <div class="relative z-10 max-w-3xl space-y-6">
          <!-- Animated Maternal Protection Tag -->
          <div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-forest-800/80 border border-forest-600/80 text-cream-100 text-xs sm:text-sm font-semibold shadow-inner backdrop-blur-xs">
            <span class="text-base animate-heartbeat">❤️</span>
            <span>Continuous Maternal & Newborn Protection for Nigeria</span>
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-cream-50">
            No Nigerian mother should walk the postpartum journey <span class="text-transparent bg-clip-text bg-gradient-to-r from-terracotta-400 to-terracotta-200">alone</span>.
          </h1>

          <p class="text-cream-100/90 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl">
            Telemama safeguards mothers and newborns during the critical 48-hour and 42-day postpartum window through automated zero-data USSD check-ins, proactive danger-sign triage, and rapid family-facility response coordination.
          </p>

          <div class="flex flex-wrap items-center gap-3.5 pt-2">
            <a
              routerLink="/mother"
              class="tm-btn tm-btn-primary text-base font-extrabold px-8 py-4 shadow-xl shadow-terracotta/30 hover:scale-105 active:scale-95 transition-all"
            >
              Start Mother Check-in →
            </a>
            <a
              routerLink="/ussd"
              class="tm-btn bg-white/10 hover:bg-white/20 text-cream border border-white/20 text-base font-semibold px-6 py-4 backdrop-blur-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span class="text-xl animate-pulse">📱</span> Try 2G USSD (*384*24#)
            </a>
          </div>
        </div>

        <!-- Metric highlights with hover glow -->
        <div class="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 mt-10 border-t border-forest-700/80 text-cream">
          <div class="p-3.5 rounded-2xl bg-forest-900/40 border border-forest-700/50 hover:border-terracotta-400/50 transition-all hover:-translate-y-1 group">
            <div class="text-3xl sm:text-4xl font-black text-terracotta-400 group-hover:scale-105 transition-transform">0 MB</div>
            <div class="text-xs sm:text-sm text-forest-200 mt-1 font-medium">Mobile Data Required (2G USSD/SMS)</div>
          </div>
          <div class="p-3.5 rounded-2xl bg-forest-900/40 border border-forest-700/50 hover:border-terracotta-400/50 transition-all hover:-translate-y-1 group">
            <div class="text-3xl sm:text-4xl font-black text-terracotta-400 group-hover:scale-105 transition-transform">&lt; 2 min</div>
            <div class="text-xs sm:text-sm text-forest-200 mt-1 font-medium">Danger-Sign Triage Alert Speed</div>
          </div>
          <div class="p-3.5 rounded-2xl bg-forest-900/40 border border-forest-700/50 hover:border-terracotta-400/50 transition-all hover:-translate-y-1 group">
            <div class="text-3xl sm:text-4xl font-black text-terracotta-400 group-hover:scale-105 transition-transform">774</div>
            <div class="text-xs sm:text-sm text-forest-200 mt-1 font-medium">LGAs Reachable on Any Basic Phone</div>
          </div>
          <div class="p-3.5 rounded-2xl bg-forest-900/40 border border-forest-700/50 hover:border-terracotta-400/50 transition-all hover:-translate-y-1 group">
            <div class="text-3xl sm:text-4xl font-black text-terracotta-400 group-hover:scale-105 transition-transform">100%</div>
            <div class="text-xs sm:text-sm text-forest-200 mt-1 font-medium">Closed-Loop Care & Transport Loop</div>
          </div>
        </div>
      </section>

      <!-- Role-Based Entry Points (3 Core Personas + USSD) with Card Hover Lift -->
      <section class="space-y-6">
        <div class="text-center max-w-xl mx-auto space-y-2">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-charcoal">Choose Your Entry Point</h2>
          <p class="text-stone-600 text-sm sm:text-base">
            Select a persona to experience how Telemama connects mother, family, and primary health centre into a unified safety net:
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 1. I'm a Mother -->
          <div class="tm-card p-7 flex flex-col justify-between hover:border-terracotta hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group bg-white/95 relative overflow-hidden border-2 border-stone-200">
            <div class="absolute top-0 right-0 w-24 h-24 bg-terracotta-50 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>

            <div class="space-y-4 relative z-10">
              <div class="w-16 h-16 rounded-2xl bg-terracotta-100 text-terracotta flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition-all shadow-sm">
                🤰
              </div>
              <h3 class="text-2xl font-extrabold text-charcoal group-hover:text-terracotta transition-colors">
                I'm a Mother
              </h3>
              <p class="text-stone-600 text-sm leading-relaxed">
                Report how you and your baby are feeling today using easy icons, receive continuous surveillance reassurance, or trigger emergency SOS help with one tap.
              </p>
              <ul class="text-xs text-stone-600 space-y-2 pt-2 font-medium">
                <li class="flex items-center gap-2 text-forest-800">
                  <span class="w-4 h-4 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-[10px]">✓</span>
                  Low-literacy danger sign checklist
                </li>
                <li class="flex items-center gap-2 text-forest-800">
                  <span class="w-4 h-4 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-[10px]">✓</span>
                  Emergency "I Need Help Now" big button
                </li>
                <li class="flex items-center gap-2 text-forest-800">
                  <span class="w-4 h-4 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-[10px]">✓</span>
                  42-Day postpartum recovery tracker
                </li>
              </ul>
            </div>
            <div class="pt-6 mt-6 border-t border-stone-100 relative z-10">
              <a routerLink="/mother" class="tm-btn tm-btn-primary w-full text-sm font-bold shadow-md flex items-center justify-center gap-2 group-hover:bg-terracotta-700">
                <span>Enter Mother Portal</span>
                <span class="group-hover:translate-x-1.5 transition-transform duration-200">→</span>
              </a>
            </div>
          </div>

          <!-- 2. I'm Family / Support Person -->
          <div class="tm-card p-7 flex flex-col justify-between hover:border-forest hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group bg-white/95 relative overflow-hidden border-2 border-stone-200">
            <div class="absolute top-0 right-0 w-24 h-24 bg-forest-50 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>

            <div class="space-y-4 relative z-10">
              <div class="w-16 h-16 rounded-2xl bg-forest-100 text-forest flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition-all shadow-sm">
                👨‍👩‍👦
              </div>
              <h3 class="text-2xl font-extrabold text-charcoal group-hover:text-forest transition-colors">
                I'm Family / Support
              </h3>
              <p class="text-stone-600 text-sm leading-relaxed">
                Nominated husbands, mothers, and caregivers receive immediate alerts, clear non-medical instructions, and one-tap community emergency transport dispatch.
              </p>
              <ul class="text-xs text-stone-600 space-y-2 pt-2 font-medium">
                <li class="flex items-center gap-2 text-forest-800">
                  <span class="w-4 h-4 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-[10px]">✓</span>
                  Real-time SMS & web alert inbox
                </li>
                <li class="flex items-center gap-2 text-forest-800">
                  <span class="w-4 h-4 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-[10px]">✓</span>
                  Actionable "What To Do Now" guidance
                </li>
                <li class="flex items-center gap-2 text-forest-800">
                  <span class="w-4 h-4 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-[10px]">✓</span>
                  1-Tap call facility or dispatch keke
                </li>
              </ul>
            </div>
            <div class="pt-6 mt-6 border-t border-stone-100 relative z-10">
              <a routerLink="/family" class="tm-btn tm-btn-forest w-full text-sm font-bold shadow-md flex items-center justify-center gap-2 group-hover:bg-forest-800">
                <span>Enter Family Alert Inbox</span>
                <span class="group-hover:translate-x-1.5 transition-transform duration-200">→</span>
              </a>
            </div>
          </div>

          <!-- 3. I'm a Health Worker / Facility -->
          <div class="tm-card p-7 flex flex-col justify-between hover:border-urgent hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group bg-white/95 relative overflow-hidden border-2 border-stone-200">
            <div class="absolute top-0 right-0 w-24 h-24 bg-urgent-50 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>

            <div class="space-y-4 relative z-10">
              <div class="w-16 h-16 rounded-2xl bg-urgent-100 text-urgent flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition-all shadow-sm">
                🏥
              </div>
              <h3 class="text-2xl font-extrabold text-charcoal group-hover:text-urgent transition-colors">
                I'm a Health Worker
              </h3>
              <p class="text-stone-600 text-sm leading-relaxed">
                Primary Health Centre midwives and triage nurses monitor all registered mothers by risk status (Red / Amber / Green), prepare clinical protocols, and log care actions.
              </p>
              <ul class="text-xs text-stone-600 space-y-2 pt-2 font-medium">
                <li class="flex items-center gap-2 text-forest-800">
                  <span class="w-4 h-4 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-[10px]">✓</span>
                  Red / Amber / Green risk triage flags
                </li>
                <li class="flex items-center gap-2 text-forest-800">
                  <span class="w-4 h-4 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-[10px]">✓</span>
                  Clinical protocol checklist (IV, Oxytocin)
                </li>
                <li class="flex items-center gap-2 text-forest-800">
                  <span class="w-4 h-4 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-[10px]">✓</span>
                  Discharge onboarding form
                </li>
              </ul>
            </div>
            <div class="pt-6 mt-6 border-t border-stone-100 relative z-10">
              <a routerLink="/clinic" class="tm-btn tm-btn-outline w-full text-sm font-bold hover:bg-stone-50 flex items-center justify-center gap-2 group-hover:border-stone-400">
                <span>Open Clinic Dashboard</span>
                <span class="group-hover:translate-x-1.5 transition-transform duration-200">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Hackathon Pitch Quick Demo Scenarios with Glowing Borders -->
      <section class="tm-card p-6 sm:p-10 border-2 border-terracotta-300 bg-gradient-to-br from-terracotta-50/60 via-cream-50 to-white shadow-xl">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta text-white text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
              <span class="animate-spin">⚙️</span> 3-Minute Hackathon Pitch Demo
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-charcoal">Instant Live Scenario Switcher</h2>
          </div>
          <button
            type="button"
            (click)="svc.resetToDefaults()"
            class="tm-btn tm-btn-outline text-xs py-2 px-4 bg-white shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>🔄</span> Reset Seed Data
          </button>
        </div>

        <p class="text-xs sm:text-sm text-stone-600 mb-6">
          Select a pre-configured scenario to demonstrate the full end-to-end alert trigger, USSD flow, and clinic triage in seconds:
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <!-- Scenario 1 -->
          <div class="bg-white p-5 rounded-2xl border-2 border-urgent-300 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-urgent uppercase tracking-wider flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-urgent animate-ping"></span>
                  Scenario 1
                </span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-urgent-100 text-urgent-800">CRITICAL</span>
              </div>
              <h3 class="font-extrabold text-charcoal text-base mb-1.5">Postpartum Bleeding Emergency</h3>
              <p class="text-xs text-stone-600 leading-relaxed mb-4">
                Folake Adeyemi (Day 4) reports heavy bleeding on USSD. Triggers red alert, urgent clinic preparation, and keke transport dispatch.
              </p>
            </div>
            <button
              type="button"
              (click)="triggerScenario1()"
              class="tm-btn tm-btn-urgent text-xs py-2.5 w-full font-bold shadow-md group-hover:scale-[1.02] active:scale-95"
            >
              Demo Bleeding Emergency →
            </button>
          </div>

          <!-- Scenario 2 -->
          <div class="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                  Scenario 2
                </span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">WARNING</span>
              </div>
              <h3 class="font-extrabold text-charcoal text-base mb-1.5">Impending Eclampsia (Pre-eclampsia)</h3>
              <p class="text-xs text-stone-600 leading-relaxed mb-4">
                Amina Abubakar (35 weeks pregnant) reports severe headache & blurred vision. AKTH clinic prepares Magnesium Sulphate protocol.
              </p>
            </div>
            <button
              type="button"
              (click)="triggerScenario2()"
              class="tm-btn tm-btn-primary text-xs py-2.5 w-full font-bold shadow-md group-hover:scale-[1.02] active:scale-95"
            >
              Demo Pre-Eclampsia Triage →
            </button>
          </div>

          <!-- Scenario 3 -->
          <div class="bg-white p-5 rounded-2xl border-2 border-forest-300 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-forest-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-forest-500"></span>
                  Scenario 3
                </span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-forest-100 text-forest-900">STABLE</span>
              </div>
              <h3 class="font-extrabold text-charcoal text-base mb-1.5">Normal Recovery (All Clear)</h3>
              <p class="text-xs text-stone-600 leading-relaxed mb-4">
                Hauwa Ibrahim (Day 14) completes milestone check-in with baby feeding actively. System records peace of mind.
              </p>
            </div>
            <button
              type="button"
              (click)="triggerScenario3()"
              class="tm-btn tm-btn-forest text-xs py-2.5 w-full font-bold shadow-md group-hover:scale-[1.02] active:scale-95"
            >
              Demo Stable Check-in →
            </button>
          </div>
        </div>
      </section>

      <!-- How Telemama Works Section with Step Numbers -->
      <section class="space-y-6">
        <div class="text-center max-w-xl mx-auto space-y-2">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-charcoal">How Telemama Protects Lives</h2>
          <p class="text-stone-600 text-sm">
            Bridging the gap between the rural home and the primary healthcare facility:
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="tm-card p-7 border-t-4 border-t-terracotta hover:-translate-y-1 transition-all">
            <div class="w-12 h-12 rounded-2xl bg-terracotta-100 text-terracotta font-black flex items-center justify-center text-xl mb-4 shadow-xs">
              1
            </div>
            <h3 class="font-extrabold text-charcoal text-lg mb-2">Automated Check-Ins</h3>
            <p class="text-stone-600 text-sm leading-relaxed">
              Every morning at 8:00 AM, our automated engine triggers a free USSD session on the mother's 2G phone. Simple numbers 0 to 5 enable low-literacy reporting.
            </p>
          </div>

          <div class="tm-card p-7 border-t-4 border-t-forest hover:-translate-y-1 transition-all">
            <div class="w-12 h-12 rounded-2xl bg-forest-100 text-forest font-black flex items-center justify-center text-xl mb-4 shadow-xs">
              2
            </div>
            <h3 class="font-extrabold text-charcoal text-lg mb-2">Instant Family Loop</h3>
            <p class="text-stone-600 text-sm leading-relaxed">
              When a danger sign is reported, the nominated husband or caregiver is instantly texted in plain English with exact instructions so delays in seeking care are prevented.
            </p>
          </div>

          <div class="tm-card p-7 border-t-4 border-t-urgent hover:-translate-y-1 transition-all">
            <div class="w-12 h-12 rounded-2xl bg-urgent-100 text-urgent font-black flex items-center justify-center text-xl mb-4 shadow-xs">
              3
            </div>
            <h3 class="font-extrabold text-charcoal text-lg mb-2">Proactive Clinic Triage</h3>
            <p class="text-stone-600 text-sm leading-relaxed">
              The Primary Health Centre receives the alert with patient details and specific medical preparation advice (IV access, blood group, oxytocin) before the patient arrives.
            </p>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class HomeComponent {
  svc = inject(TelemamaService);
  router = inject(Router);

  triggerScenario1() {
    this.svc.loadScenario('emergency_bleeding');
    this.router.navigate(['/clinic']);
  }

  triggerScenario2() {
    this.svc.switchMother('m2');
    this.router.navigate(['/clinic']);
  }

  triggerScenario3() {
    this.svc.loadScenario('all_stable');
    this.router.navigate(['/clinic']);
  }
}
