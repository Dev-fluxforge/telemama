import {Injectable,computed,signal} from '@angular/core';
import {Alert,CheckIn,MILESTONES,Risk,SignCode,SIGNS,TimelineItem,Woman} from './models';
const H=3600000, ORDER:Record<Risk,number>={urgent:0,watch:1,stable:2};
function seed():Woman[]{
 const t=Date.now();
 const w=(i:number,n:string,area:string,hAgo:number,cis:[string,number,SignCode[]?][]):Woman=>({id:'w'+i,name:n,phone:'+234803000000'+i,area,deliveredAt:t-hAgo*H,
  checkIns:cis.map(([m,h,s],k)=>({id:`c${i}-${k}`,milestoneId:m,at:t-hAgo*H+h*H,signs:s??[]}))});
 return [
  w(1,'Folake Adeyemi','Ibadan North',80,[['h24',30]]),
  w(2,'Chioma Okafor','Surulere, Lagos',120,[['h24',28]]),
  w(3,'Aisha Bello','Kano Municipal',30,[]),
  w(4,'Blessing Eze','Yaba, Lagos',240,[['h24',26],['d3',75]]),
  w(5,'Temitope Ogunleye','Abeokuta South',1200,[['h24',25],['d3',80],['d7',200]]),
  w(6,'Ngozi Nwosu','Enugu North',192,[['h24',27],['d3',74],['d7',187,['fever']]])];
}
@Injectable({providedIn:'root'})
export class TelemamaService{
 /** The demo mother on /mother is the first seeded woman (stable until she reports a danger sign). */
 readonly motherId='w1';
 readonly clinicPhone='+2348000000001'; readonly transportPhone='+2348000000002';
 readonly now=signal(Date.now());
 readonly women=signal<Woman[]>(seed());
 readonly alerts=signal<Alert[]>([]);
 readonly rows=computed(()=>this.women().map(w=>{const timeline=this.timelineOf(w);
   // Rule: Urgent if any danger sign reported, Watch if a scheduled check-in was missed, else Stable.
   const risk:Risk=w.checkIns.some(c=>c.signs.length)?'urgent':timeline.some(i=>i.status==='missed')?'watch':'stable';
   return {w,risk,timeline,missed:timeline.filter(i=>i.status==='missed').length,lastDanger:[...w.checkIns].reverse().find(c=>c.signs.length)};})
  .sort((a,b)=>ORDER[a.risk]-ORDER[b.risk]||a.w.name.localeCompare(b.w.name)));
 readonly activeAlert=computed(()=>this.alerts().find(a=>!a.handled)??null);
 constructor(){setInterval(()=>this.now.set(Date.now()),60000);}
 womanById(id:string){return this.women().find(w=>w.id===id);}
 signText(signs:SignCode[]){return signs.map(s=>SIGNS[s].en).join(', ');}
 timelineOf(w:Woman):TimelineItem[]{
  const hrs=(this.now()-w.deliveredAt)/H;
  const sched=MILESTONES.map(m=>{const cis=w.checkIns.filter(c=>c.milestoneId===m.id);
   const signs=[...new Set(cis.flatMap(c=>c.signs))];
   const status=cis.length?(signs.length?'danger':'done'):hrs>m.endH?'missed':hrs>=m.startH?'due':'upcoming';
   return {key:m.id,label:m.label,status,at:cis.at(-1)?.at,signs} as TimelineItem;});
  const extra=w.checkIns.filter(c=>c.milestoneId==='extra').map(c=>({key:c.id,label:'Reported by mother',status:c.signs.length?'danger':'done',at:c.at,signs:c.signs} as TimelineItem));
  return [...sched,...extra];
 }
 report(womanId:string,signs:SignCode[]){
  const w=this.womanById(womanId); if(!w) return;
  const due=this.timelineOf(w).find(i=>i.status==='due');
  const ci:CheckIn={id:crypto.randomUUID(),milestoneId:due?.key??'extra',at:Date.now(),signs};
  this.women.update(ws=>ws.map(x=>x.id===womanId?{...x,checkIns:[...x.checkIns,ci]}:x));
  if(signs.length) this.alerts.update(a=>[{id:crypto.randomUUID(),womanId,signs,at:ci.at,handled:false},...a]);
 }
 handle(id:string){this.alerts.update(a=>a.map(x=>x.id===id?{...x,handled:true}:x));}
 reset(){this.women.set(seed());this.alerts.set([]);}
}
