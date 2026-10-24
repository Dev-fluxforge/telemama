import {Routes} from '@angular/router';
export const routes: Routes=[
 {path:'',pathMatch:'full',redirectTo:'mother'},
 {path:'mother',title:'Mother check-in · Telemama',loadComponent:()=>import('./features/mother/mother.component').then(m=>m.MotherComponent)},
 {path:'family',title:'Family alert · Telemama',loadComponent:()=>import('./features/family/family.component').then(m=>m.FamilyComponent)},
 {path:'clinic',title:'Clinic dashboard · Telemama',loadComponent:()=>import('./features/clinic/clinic.component').then(m=>m.ClinicComponent)},
 {path:'**',redirectTo:'mother'}];
