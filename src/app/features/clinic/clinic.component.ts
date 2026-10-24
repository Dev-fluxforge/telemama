import {Component,computed,effect,inject,signal,untracked} from '@angular/core';
import {DatePipe} from '@angular/common';
import {SIGNS,StepStatus} from '../../core/models';
import {TelemamaService} from '../../core/telemama.service';
import {StatusBadgeComponent} from '../../shared/status-badge.component';
@Component({selector:'app-clinic',standalone:true,imports:[DatePipe,StatusBadgeComponent],template:`
<h1 class="text-2xl font-bold">Clinic dashboard</h1>
<div class="mt-4 grid gap-6 md:grid-cols-2 md:items-start">
 <section aria-labelledby="lh" class="space-y-3">
  <h2 id="lh" class="sr-only">Women by risk</h2>
  <label for="q" class="font-medium">Search women</label>
  <input id="q" type="search" class="mt-1 block min-h-12 w-full rounded-2xl border-2 border-forest bg-white px-4"
   placeholder="Name or area" (input)="q.set($any($event.target).value)">
  <ul class="space-y-3">
   @for (r of filtered(); track r.w.id) {
    <li><button type="button" class="card block w-full text-left" [class]="r.w.id===selected()?.w.id?'border-2 !border-forest':''"
      [class.!border-urgent]="r.risk==='urgent'" [attr.aria-pressed]="r.w.id===selected()?.w.id" (click)="sel.set(r.w.id)">
      <span class="flex items-start justify-between gap-2"><span class="font-bold">{{r.w.name}}</span><app-status-badge [risk]="r.risk"/></span>
      <span class="block text-sm">{{r.w.area}} · delivered {{r.w.deliveredAt | date:'d MMM'}}</span>
      @if (r.missed) {<span class="block text-sm font-medium">{{r.missed}} missed check-in{{r.missed>1?'s':''}}</span>}
    </button></li>
   } @empty {<li class="card">No women match your search.</li>}
  </ul>
 </section>
 @if (selected(); as r) {
 <section aria-labelledby="dh" class="card order-first space-y-4 md:order-last">
  <div class="flex items-start justify-between gap-2"><h2 id="dh" class="text-xl font-bold">{{r.w.name}}</h2><app-status-badge [risk]="r.risk"/></div>
  <a class="btn btn-primary w-full" [href]="'tel:'+r.w.phone" [attr.aria-label]="'Call '+r.w.name">Call {{r.w.name}}</a>
  @if (r.risk==='urgent' && r.lastDanger; as d) {
   <div class="rounded-2xl border-2 border-urgent bg-urgent/5 p-4" role="region" aria-label="Patient incoming">
    <h3 class="font-bold text-urgent"><span aria-hidden="true">▲</span> Patient incoming</h3>
    <p class="mt-1">{{r.w.name}}, {{r.w.area}}. Reported {{d.at | date:'d MMM, shortTime'}}.</p>
    <p class="mt-2 font-medium">{{svc.signText(d.signs)}}</p>
    <ul class="mt-2 list-disc pl-5 text-sm">@for (s of d.signs; track s) {<li>{{signs[s].prep}}</li>}</ul>
   </div>}
  <h3 class="font-bold">Check-ins since delivery</h3>
  <ol class="space-y-3">
   @for (i of r.timeline; track i.key) {
    <li class="flex gap-3"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold" [class]="dot[i.status]" aria-hidden="true">{{icon[i.status]}}</span>
     <span><span class="font-medium">{{i.label}}: {{text[i.status]}}</span>
      @if (i.at) {<span class="block text-sm">{{i.at | date:'d MMM, shortTime'}}</span>}
      @if (i.signs.length) {<span class="block text-sm font-medium text-urgent">{{svc.signText(i.signs)}}</span>}</span></li>}
  </ol>
 </section>}
</div>`})
export class ClinicComponent{
 svc=inject(TelemamaService); signs=SIGNS;
 q=signal(''); sel=signal<string|null>(null);
 filtered=computed(()=>{const q=this.q().trim().toLowerCase();return this.svc.rows().filter(r=>!q||(r.w.name+' '+r.w.area).toLowerCase().includes(q));});
 selected=computed(()=>this.svc.rows().find(r=>r.w.id===this.sel())??this.svc.rows()[0]);
 constructor(){effect(()=>{const a=this.svc.activeAlert();if(a)untracked(()=>this.sel.set(a.womanId));});}
 icon:Record<StepStatus,string>={done:'✓',danger:'▲',missed:'✕',due:'●',upcoming:'○'};
 text:Record<StepStatus,string>={done:'Checked in',danger:'Danger sign reported',missed:'Missed',due:'Due now',upcoming:'Upcoming'};
 dot:Record<StepStatus,string>={done:'bg-forest text-cream',danger:'bg-urgent text-white',missed:'bg-amber-soft text-amber-ink',due:'border-2 border-forest',upcoming:'border-2 border-forest/40'};
}
