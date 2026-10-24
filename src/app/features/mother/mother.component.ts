import {Component,computed,inject,signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {SIGNS,SIGN_CODES,SignCode} from '../../core/models';
import {TelemamaService} from '../../core/telemama.service';
type Lang='en'|'yo';
type Kind='prompt'|'urgent'|'ok'|'invalid'|'user';
interface Msg{from:'me'|'sys';kind:Kind;text?:string}
// Yoruba strings are placeholders pending native-speaker review.
const COPY={
 en:{prompt:'Telemama: How are you and your baby today? Reply with a number (e.g. 1 or 2,4):',fine:'I am well',
  urgent:'URGENT: Go to the clinic now. Your family and the clinic have been alerted.',ok:'Thank you. Your check-in is saved. Stay well.',
  invalid:'Please reply with a number from 0 to 5.',placeholder:'Type reply',send:'Send',title:'SMS check-in'},
 yo:{prompt:'Telemama: Báwo ni ara rẹ àti ọmọ rẹ ṣe rí lónìí? Fèsì pẹ̀lú nọ́ńbà (bíi 1 tàbí 2,4):',fine:'Mo ń ṣe dáadáa',
  urgent:'ÌPÈSÈ: Lọ sí ilé ìwòsàn nísinsìnyí. A ti fi ẹbí rẹ àti ilé ìwòsàn létí.',ok:'A ṣé. A ti gba ìdáhùn rẹ. Ó dàbọ̀.',
  invalid:'Jọ̀wọ́ fèsì pẹ̀lú nọ́ńbà láti 0 sí 5.',placeholder:'Kọ ìdáhùn',send:'Fi ránṣẹ́',title:'Ìbẹ̀wò SMS'}};
@Component({selector:'app-mother',standalone:true,imports:[FormsModule,RouterLink],template:`
<div class="grid gap-8 md:grid-cols-2 md:items-start">
 <section aria-labelledby="mh">
  <h1 id="mh" class="text-2xl font-bold">Mother check-in simulator</h1>
  <p class="mt-2 max-w-prose">Simulates the SMS/USSD flow for Folake Adeyemi. Reply 1 to 5 to report a danger sign, then open the clinic dashboard.</p>
  <div class="mt-4 flex gap-2" role="group" aria-label="Language">
   @for (l of langs; track l.code) {
    <button type="button" class="btn" [class]="lang()===l.code?'btn-primary':'btn-ghost'" [attr.aria-pressed]="lang()===l.code" (click)="lang.set(l.code)">{{l.label}}</button>}
  </div>
  <a routerLink="/clinic" class="btn btn-ghost mt-4">Open clinic dashboard</a>
 </section>
 <div class="mx-auto w-[320px] rounded-[2.5rem] border-8 border-forest bg-white shadow-lg" role="group" aria-label="Phone simulator">
  <div class="rounded-t-3xl bg-forest px-4 py-3 text-cream"><p class="font-bold">{{t().title}}</p><p class="text-sm">Short code 30123</p></div>
  <div class="h-[380px] space-y-2 overflow-y-auto bg-cream p-3" role="log" aria-live="polite" aria-label="Messages">
   @for (m of msgs(); track $index) {
    <div class="max-w-[90%] rounded-2xl px-3 py-2 text-sm" [class]="m.from==='me'?'ml-auto bg-terracotta-dark text-white':m.kind==='urgent'?'bg-urgent text-white font-bold':'bg-white border border-forest/10'">
     @if (m.kind==='prompt') { {{t().prompt}}
      <ul class="mt-2 space-y-1"><li>0. {{t().fine}}</li>
       @for (c of codes; track c) {<li>{{signs[c].n}}. {{signs[c][lang()]}}</li>}</ul>
     } @else if (m.kind==='user') { {{m.text}} } @else { {{t()[m.kind]}} }
    </div>}
  </div>
  <div class="grid grid-cols-6 gap-1 border-t border-forest/10 p-2" role="group" aria-label="Quick reply keypad">
   @for (n of keypad; track n) {
    <button type="button" class="min-h-11 rounded-xl border-2 border-forest font-bold" (click)="send(''+n)"
     [attr.aria-label]="'Reply '+n+': '+label(n)">{{n}}</button>}
  </div>
  <div class="flex gap-2 p-2 pb-3">
   <label for="reply" class="sr-only">{{t().placeholder}}</label>
   <input id="reply" class="min-h-11 min-w-0 flex-1 rounded-xl border-2 border-forest px-3" inputmode="numeric" autocomplete="off"
    [placeholder]="t().placeholder" [(ngModel)]="draft" (keydown.enter)="send(draft)">
   <button type="button" class="btn btn-primary min-h-11 px-4" (click)="send(draft)">{{t().send}}</button>
  </div>
 </div>
</div>`})
export class MotherComponent{
 private svc=inject(TelemamaService);
 signs=SIGNS; codes=SIGN_CODES; keypad=[0,1,2,3,4,5];
 langs:{code:Lang;label:string}[]=[{code:'en',label:'English'},{code:'yo',label:'Yorùbá'}];
 lang=signal<Lang>('en'); t=computed(()=>COPY[this.lang()]);
 msgs=signal<Msg[]>([{from:'sys',kind:'prompt'}]); draft='';
 label(n:number){return n===0?this.t().fine:SIGNS[this.codes[n-1]][this.lang()];}
 send(raw:string){
  const nums=[...new Set(raw.match(/\d/g)??[])].map(Number);
  const text=raw.trim(); this.draft=''; if(!text) return;
  const out:Msg[]=[{from:'me',kind:'user',text}];
  if(!nums.length||nums.some(n=>n>5)) out.push({from:'sys',kind:'invalid'});
  else {
   const signs=nums.filter(n=>n>0).map(n=>this.codes[n-1] as SignCode);
   this.svc.report(this.svc.motherId,signs);   // any danger sign => Urgent + alert
   out.push({from:'sys',kind:signs.length?'urgent':'ok'});
  }
  this.msgs.update(m=>[...m,...out]);
 }
}
