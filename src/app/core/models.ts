export type SignCode='bleeding'|'headache'|'swelling'|'fever'|'baby';
export type Risk='urgent'|'watch'|'stable';
export type StepStatus='done'|'danger'|'missed'|'due'|'upcoming';
export interface Milestone{id:string;label:string;startH:number;endH:number}
export interface CheckIn{id:string;milestoneId:string;at:number;signs:SignCode[]}
export interface Woman{id:string;name:string;phone:string;area:string;deliveredAt:number;checkIns:CheckIn[]}
export interface Alert{id:string;womanId:string;signs:SignCode[];at:number;handled:boolean}
export interface TimelineItem{key:string;label:string;status:StepStatus;at?:number;signs:SignCode[]}
// Postnatal schedule: 24 hours, day 3, days 7 to 14, week 6 (hours since delivery; endH = last hour that still counts)
export const MILESTONES:Milestone[]=[
 {id:'h24',label:'24 hours',startH:24,endH:48},
 {id:'d3',label:'Day 3',startH:72,endH:96},
 {id:'d7',label:'Days 7 to 14',startH:168,endH:336},
 {id:'w6',label:'Week 6',startH:1008,endH:1050}];
// Placeholder wording: clinical and Yoruba copy need review by a midwife and a native speaker.
export const SIGNS:Record<SignCode,{n:number;en:string;yo:string;prep:string}>={
 bleeding:{n:1,en:'Heavy bleeding',yo:'Ẹ̀jẹ̀ ń ṣàn púpọ̀',prep:'Prepare IV access and blood group cross-match.'},
 headache:{n:2,en:'Severe headache or blurred vision',yo:'Orí fífọ́ gan-an tàbí ìríran ṣókùnkùn',prep:'Check blood pressure on arrival; ready pre-eclampsia protocol.'},
 swelling:{n:3,en:'Swollen face or feet',yo:'Ojú tàbí ẹsẹ̀ wíwú',prep:'Check blood pressure and urine protein.'},
 fever:{n:4,en:'Fever',yo:'Ibà',prep:'Take temperature and screen for infection.'},
 baby:{n:5,en:'Baby not feeding or too quiet',yo:'Ọmọ kò mu ọmú tàbí ó pa ẹnu mọ́ jù',prep:'Prepare newborn assessment; keep baby warm.'}};
export const SIGN_CODES=Object.keys(SIGNS) as SignCode[];
