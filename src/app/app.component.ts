import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TelemamaService } from './core/telemama.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen flex flex-col bg-cream text-charcoal font-sans selection:bg-terracotta-200 selection:text-terracotta-900">
      <!-- Top Persistent Critical Alert Banner (Visible when any Red Alert is active) -->
      @if (svc.activeUrgentAlert(); as alert) {
        <aside
          role="alert"
          aria-live="assertive"
          class="bg-gradient-to-r from-urgent-700 via-urgent to-terracotta-700 text-white py-3 px-4 sticky top-0 z-50 shadow-xl border-b-2 border-white/30 animate-slide-down backdrop-blur-md"
        >
          <div class="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
            <div class="flex items-center gap-3">
              <span class="relative flex h-3.5 w-3.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-white shadow-sm"></span>
              </span>
              <span class="flex items-center gap-1.5">
                <span class="text-base animate-bounce">🚨</span>
                <strong class="uppercase tracking-wider font-extrabold text-white">Critical Triage:</strong>
                <span>{{ alert.motherName }} ({{ alert.facilityName }}) reported {{ alert.signs.join(', ').replace('_', ' ') }}.</span>
              </span>
            </div>
            <div class="flex items-center gap-2">
              <a
                routerLink="/clinic"
                class="bg-white text-urgent-700 hover:bg-stone-50 px-3.5 py-1.5 rounded-xl font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-xs"
              >
                Open Clinic Triage →
              </a>
              <a
                routerLink="/family"
                class="bg-urgent-950/70 hover:bg-urgent-950 text-white px-3.5 py-1.5 rounded-xl font-bold border border-white/30 hover:scale-105 active:scale-95 transition-all text-xs"
              >
                Open Family View
              </a>
            </div>
          </div>
        </aside>
      }

      <!-- Main Navigation Header with Glassmorphism -->
      <header class="bg-forest-900/95 backdrop-blur-md text-white border-b border-forest-800 shadow-lg sticky top-0 z-40 transition-all">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <!-- Brand Logo with micro-hover -->
          <a routerLink="/" class="flex items-center gap-3 group cursor-pointer select-none">
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-terracotta-500 to-terracotta-700 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-terracotta/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200">
              🤱
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <span class="text-xl sm:text-2xl font-black tracking-tight text-cream-50 group-hover:text-terracotta-300 transition-colors">
                  Telemama
                </span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-terracotta text-white uppercase tracking-wider shadow-xs">
                  Nigeria
                </span>
              </div>
              <p class="text-[10px] text-forest-200 tracking-wide hidden sm:block font-medium">
                Continuous Maternal & Newborn Surveillance
              </p>
            </div>
          </a>

          <!-- Main Nav Links with Animated Active States -->
          <nav aria-label="Main Navigation" class="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold">
            <a
              routerLink="/"
              routerLinkActive="bg-forest-800/90 text-terracotta-300 font-bold shadow-inner"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-3.5 py-2 rounded-xl text-forest-100 hover:text-white hover:bg-forest-800/60 transition-all active:scale-95"
            >
              Home
            </a>

            <a
              routerLink="/mother"
              routerLinkActive="bg-forest-800/90 text-terracotta-300 font-bold shadow-inner"
              class="px-3.5 py-2 rounded-xl text-forest-100 hover:text-white hover:bg-forest-800/60 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>🤰</span> Mother
            </a>

            <a
              routerLink="/family"
              routerLinkActive="bg-forest-800/90 text-terracotta-300 font-bold shadow-inner"
              class="px-3.5 py-2 rounded-xl text-forest-100 hover:text-white hover:bg-forest-800/60 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>👨‍👩‍👧</span> Family
            </a>

            <a
              routerLink="/clinic"
              routerLinkActive="bg-forest-800/90 text-terracotta-300 font-bold shadow-inner"
              class="px-3.5 py-2 rounded-xl text-forest-100 hover:text-white hover:bg-forest-800/60 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>🏥</span> Clinic Console
            </a>

            <a
              routerLink="/ussd"
              routerLinkActive="bg-gradient-to-r from-terracotta-600 to-terracotta-700 text-white font-bold ring-2 ring-terracotta/40 shadow-md"
              class="px-3.5 py-2 rounded-xl bg-forest-800/80 text-terracotta-300 hover:bg-terracotta hover:text-white transition-all active:scale-95 flex items-center gap-1.5 border border-forest-700 shadow-sm"
            >
              <span class="animate-pulse">📶</span> 2G USSD (*384*24#)
            </a>
          </nav>
        </div>
      </header>

      <!-- Main Content Outlet with Smooth Fade-in -->
      <main class="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in">
        <router-outlet />
      </main>

      <!-- Global Hackathon Pitch Demo Toolbar & Footer -->
      <footer class="bg-forest-950 text-stone-300 border-t border-forest-900 mt-12 py-8 text-xs relative overflow-hidden">
        <!-- Background subtle glow circle -->
        <div class="absolute -right-20 -bottom-20 w-60 h-60 rounded-full bg-forest-800/30 blur-3xl pointer-events-none"></div>

        <div class="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 relative z-10">
          <!-- Quick Demo Bar -->
          <div class="p-4 rounded-2xl bg-forest-900/90 border border-forest-800/80 shadow-lg flex flex-wrap items-center justify-between gap-4 backdrop-blur-sm">
            <div class="flex items-center gap-2.5">
              <span class="text-xl animate-bounce">⚡</span>
              <div>
                <span class="font-bold text-cream-100 text-sm">Interactive Hackathon Controller:</span>
                <span class="text-forest-200 ml-1 text-xs">Switch scenarios or reset demo state in 1 click</span>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                (click)="loadBleedingDemo()"
                class="px-3.5 py-2 rounded-xl bg-urgent hover:bg-urgent-700 active:scale-95 text-white font-bold transition-all text-xs shadow-md shadow-urgent/30 flex items-center gap-1.5"
              >
                <span>🚨</span> Scenario: Bleeding Emergency
              </button>
              <button
                type="button"
                (click)="loadStableDemo()"
                class="px-3.5 py-2 rounded-xl bg-forest-700 hover:bg-forest-600 active:scale-95 text-white font-bold transition-all text-xs shadow-md shadow-forest/30 flex items-center gap-1.5"
              >
                <span>✓</span> Scenario: All Stable
              </button>
              <button
                type="button"
                (click)="svc.resetToDefaults()"
                class="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-200 border border-stone-600 transition-all text-xs flex items-center gap-1.5"
              >
                <span>🔄</span> Reset Seed Data
              </button>
            </div>
          </div>

          <!-- Bottom Footer Details -->
          <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-forest-900/80 text-stone-400">
            <div class="flex items-center gap-2 flex-wrap">
              <span>🇳🇬 Africa-First Health Engineering</span>
              <span>•</span>
              <span>Zero-Data 2G USSD (*384*24#)</span>
              <span>•</span>
              <span>Offline-Friendly Local Storage</span>
            </div>
            <div>
              Telemama Health Systems Nigeria © 2026. Zero Maternal Deaths from Preventable Delays.
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class AppComponent {
  svc = inject(TelemamaService);
  router = inject(Router);

  loadBleedingDemo() {
    this.svc.loadScenario('emergency_bleeding');
    this.router.navigate(['/clinic']);
  }

  loadStableDemo() {
    this.svc.loadScenario('all_stable');
    this.router.navigate(['/clinic']);
  }
}
