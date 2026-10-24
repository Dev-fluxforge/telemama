import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Telemama | Continuous Maternal & Newborn Care Nigeria',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'mother',
    title: 'Mother Care & Daily Check-In · Telemama',
    loadComponent: () => import('./features/mother/mother.component').then((m) => m.MotherComponent),
  },
  {
    path: 'family',
    title: 'Family & Caregiver Alert Inbox · Telemama',
    loadComponent: () => import('./features/family/family.component').then((m) => m.FamilyComponent),
  },
  {
    path: 'clinic',
    title: 'Facility Triage Console · Telemama',
    loadComponent: () => import('./features/clinic/clinic.component').then((m) => m.ClinicComponent),
  },
  {
    path: 'ussd',
    title: '2G USSD Phone Simulator (*384*24#) · Telemama',
    loadComponent: () => import('./features/ussd/ussd.component').then((m) => m.UssdComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
