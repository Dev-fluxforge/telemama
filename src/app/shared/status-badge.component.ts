import {Component,input} from '@angular/core';
import {Risk} from '../core/models';
@Component({selector:'app-status-badge',standalone:true,template:`
 <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold" [class]="cls[risk()]">
  <span aria-hidden="true">{{icon[risk()]}}</span>{{label[risk()]}}</span>`})
export class StatusBadgeComponent{
 risk=input.required<Risk>();
 label:Record<Risk,string>={urgent:'Urgent',watch:'Watch',stable:'Stable'};
 icon:Record<Risk,string>={urgent:'▲',watch:'●',stable:'✓'};
 cls:Record<Risk,string>={urgent:'bg-urgent text-white',watch:'bg-amber-soft text-amber-ink',stable:'bg-forest text-cream'};
}
