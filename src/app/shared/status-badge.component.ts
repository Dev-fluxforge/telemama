import { Component, input } from '@angular/core';
import { RiskLevel } from '../core/models';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span
      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase shadow-xs transition-colors"
      [class]="badgeClass()"
    >
      <span class="w-2 h-2 rounded-full" [class]="dotClass()" [class.animate-ping]="risk() === 'red'"></span>
      <span>{{ icon() }}</span>
      <span>{{ label() }}</span>
    </span>
  `,
})
export class StatusBadgeComponent {
  risk = input.required<RiskLevel>();
  size = input<'sm' | 'md' | 'lg'>('md');

  label() {
    switch (this.risk()) {
      case 'red':
        return 'Urgent / Red';
      case 'amber':
        return 'Watch / Amber';
      case 'green':
        return 'Stable / Green';
    }
  }

  icon() {
    switch (this.risk()) {
      case 'red':
        return '⚠️';
      case 'amber':
        return '⏱️';
      case 'green':
        return '✓';
    }
  }

  badgeClass() {
    switch (this.risk()) {
      case 'red':
        return 'bg-urgent text-white ring-2 ring-urgent/30';
      case 'amber':
        return 'bg-amber-100 text-amber-900 border border-amber-300';
      case 'green':
        return 'bg-forest-100 text-forest-900 border border-forest-300';
    }
  }

  dotClass() {
    switch (this.risk()) {
      case 'red':
        return 'bg-white';
      case 'amber':
        return 'bg-amber-600';
      case 'green':
        return 'bg-forest-600';
    }
  }
}
