import {Component,inject} from '@angular/core';
import {RouterLink,RouterLinkActive,RouterOutlet} from '@angular/router';
import {TelemamaService} from './core/telemama.service';
@Component({selector:'app-root',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive],template:`
<header class="bg-forest text-cream">
 <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
  <a routerLink="/mother" class="text-xl font-bold">Telemama</a>
  <nav aria-label="Main" class="flex gap-2">
   @for (l of links; track l.path) {
    <a [routerLink]="l.path" routerLinkActive="bg-cream text-forest" ariaCurrentWhenActive="page"
       class="rounded-2xl px-4 py-2 font-medium">{{l.label}}</a>}
  </nav>
 </div>
</header>
<div role="status" aria-live="polite">
 @if (svc.activeAlert(); as a) {
  <div class="bg-urgent text-white">
   <div class="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 font-medium">
    <span><span aria-hidden="true">▲</span> Urgent: {{svc.womanById(a.womanId)?.name}} reported {{svc.signText(a.signs).toLowerCase()}}.</span>
    <a routerLink="/clinic" class="underline">Open clinic</a><a routerLink="/family" class="underline">Open family alert</a>
   </div></div>}
</div>
<main class="mx-auto max-w-5xl px-4 py-6"><router-outlet/></main>
<footer class="mx-auto max-w-5xl px-4 pb-8">
 <button type="button" class="btn btn-ghost" (click)="svc.reset()">Reset demo data</button>
</footer>`})
export class AppComponent{
 svc=inject(TelemamaService);
 links=[{path:'/mother',label:'Mother'},{path:'/family',label:'Family'},{path:'/clinic',label:'Clinic'}];
}
