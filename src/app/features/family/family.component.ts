import {Component,inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TelemamaService} from '../../core/telemama.service';
import {SIGNS} from '../../core/models';
@Component({selector:'app-family',standalone:true,imports:[DatePipe,RouterLink],template:`
<h1 class="text-2xl font-bold">Family alert</h1>
@if (svc.activeAlert(); as a) {
 @if (svc.womanById(a.womanId); as w) {
 <section class="card mt-4 max-w-xl border-2 border-urgent" aria-labelledby="ah">
  <p class="font-bold text-urgent"><span aria-hidden="true">▲</span> Urgent: danger sign reported</p>
  <h2 id="ah" class="mt-1 text-2xl font-bold">{{w.name}}</h2>
  <p>{{w.area}} · reported {{a.at | date:'shortTime'}}</p>
  <ul class="mt-3 list-disc pl-5 text-lg font-medium">
   @for (s of a.signs; track s) {<li>{{signs[s].en}}</li>}
  </ul>
  <p class="mt-3">Get her to the clinic now. Do not wait.</p>
  <div class="mt-4 grid gap-3 sm:grid-cols-3">
   <a class="btn btn-primary" [href]="'tel:'+w.phone" [attr.aria-label]="'Call '+w.name">Call her</a>
   <a class="btn btn-primary" [href]="'tel:'+svc.clinicPhone" aria-label="Call the clinic">Call clinic</a>
   <a class="btn btn-ghost" [href]="'tel:'+svc.transportPhone" aria-label="Find transport">Find transport</a>
  </div>
  <button type="button" class="btn btn-ghost mt-4 w-full" (click)="svc.handle(a.id)">Mark as handled</button>
 </section>}
} @else {
 <section class="card mt-4 max-w-xl"><h2 class="text-lg font-bold">No active alerts</h2>
  <p class="mt-1">When a mother reports a danger sign, her name and the sign appear here.</p>
  <a routerLink="/mother" class="btn btn-primary mt-4">Report a danger sign</a></section>}`})
export class FamilyComponent{svc=inject(TelemamaService);signs=SIGNS;}
