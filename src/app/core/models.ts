export type RiskLevel = 'green' | 'amber' | 'red';
export type PregnancyStage = 'pregnant' | 'postnatal';
export type CheckInChannel = 'web' | 'ussd' | 'sms';
export type AlertStatus = 'open' | 'contacted' | 'transport_dispatched' | 'at_facility' | 'resolved';

export type DangerSignCode =
  | 'heavy_bleeding'
  | 'severe_headache'
  | 'blurred_vision'
  | 'high_fever'
  | 'swollen_extremities'
  | 'severe_abdominal_pain'
  | 'foul_discharge'
  | 'baby_not_feeding'
  | 'baby_breathing_fast'
  | 'baby_cold_floppy';

export interface DangerSignDefinition {
  code: DangerSignCode;
  number: number;
  icon: string;
  shortLabel: string;
  description: string;
  severity: 'critical' | 'warning';
  target: 'mother' | 'baby' | 'both';
  clinicalPrep: string;
  familyGuidance: string;
}

export const DANGER_SIGNS: Record<DangerSignCode, DangerSignDefinition> = {
  heavy_bleeding: {
    code: 'heavy_bleeding',
    number: 1,
    icon: '🩸',
    shortLabel: 'Heavy Bleeding',
    description: 'Soaking more than 1 pad per hour or passing large blood clots',
    severity: 'critical',
    target: 'mother',
    clinicalPrep: 'Prepare IV 16G cannulas, 10-20 IU Oxytocin in 500mL Ringer Lactate, Misoprostol 800mcg rectal, crossmatch 2 units blood.',
    familyGuidance: 'Keep mother lying down with legs elevated. Do not let her walk. Call emergency transport immediately.',
  },
  severe_headache: {
    code: 'severe_headache',
    number: 2,
    icon: '🤕',
    shortLabel: 'Severe Headache',
    description: 'Throbbing headache that does not ease with rest or paracetamol',
    severity: 'critical',
    target: 'mother',
    clinicalPrep: 'Screen for pre-eclampsia/eclampsia. Ready BP cuff, Magnesium Sulphate loading dose (4g IV + 10g IM), Labetalol.',
    familyGuidance: 'Keep room dim and quiet. Do not give excessive salt or water. Prepare to move to clinic right away.',
  },
  blurred_vision: {
    code: 'blurred_vision',
    number: 3,
    icon: '👁️',
    shortLabel: 'Blurred Vision',
    description: 'Seeing dark spots, flashing lights, or losing clear sight',
    severity: 'critical',
    target: 'mother',
    clinicalPrep: 'Check reflexes for hyperreflexia, check for visual scotoma, emergency obstetrics consult for impending seizure.',
    familyGuidance: 'High danger of fits/convulsions. Ensure mother does not stand or hold baby alone.',
  },
  high_fever: {
    code: 'high_fever',
    number: 4,
    icon: '🌡️',
    shortLabel: 'High Fever / Chills',
    description: 'Body hot to touch, uncontrollable shivering or rigors',
    severity: 'warning',
    target: 'both',
    clinicalPrep: 'Take blood film for malaria parasites, urine dipstick, blood culture. Prepare IV/IM Ceftriaxone & Artesunate.',
    familyGuidance: 'Cool with damp cloth (sponge), do not pile heavy blankets, give clean water sips while heading to clinic.',
  },
  swollen_extremities: {
    code: 'swollen_extremities',
    number: 5,
    icon: '🦵',
    shortLabel: 'Severe Swelling',
    description: 'Sudden puffed face, eyelids, or swelling in hands and ankles',
    severity: 'warning',
    target: 'mother',
    clinicalPrep: 'Urgent urine test for proteinuria (dipstick), manual BP check, monitor fluid intake & output.',
    familyGuidance: 'Have mother sit or recline on her left side. Avoid tight clothing or strings.',
  },
  severe_abdominal_pain: {
    code: 'severe_abdominal_pain',
    number: 6,
    icon: '⚡',
    shortLabel: 'Sharp Belly Pain',
    description: 'Constant intense pain in lower belly not like mild cramps',
    severity: 'critical',
    target: 'mother',
    clinicalPrep: 'Palpate uterus for tenderness and rigidity (abruptio placentae / uterine rupture / puerperal sepsis).',
    familyGuidance: 'Do not massage the stomach. Assist to clinic urgently.',
  },
  foul_discharge: {
    code: 'foul_discharge',
    number: 7,
    icon: '⚠️',
    shortLabel: 'Foul-smelling Discharge',
    description: 'Offensive odor from vaginal lochia or infected wound',
    severity: 'warning',
    target: 'mother',
    clinicalPrep: 'Speculum examination, endocervical swab, initiate broad-spectrum antibiotic therapy for endometritis.',
    familyGuidance: 'Do not douche or insert herbs. Nurse will prescribe safe antibiotics at the clinic.',
  },
  baby_not_feeding: {
    code: 'baby_not_feeding',
    number: 8,
    icon: '🍼',
    shortLabel: 'Baby Not Feeding',
    description: 'Baby too weak to latch, refusing breast or vomiting everything',
    severity: 'critical',
    target: 'baby',
    clinicalPrep: 'Neonatal resuscitation kit, check blood glucose for hypoglycemia, screen for neonatal sepsis, syringe cup-feeding.',
    familyGuidance: 'Keep baby in skin-to-skin contact under mother cloth to keep warm while on the way to hospital.',
  },
  baby_breathing_fast: {
    code: 'baby_breathing_fast',
    number: 9,
    icon: '🫁',
    shortLabel: 'Baby Breathing Fast',
    description: 'Chest sucking inward, breathing faster than 60 breaths/min, or grunting',
    severity: 'critical',
    target: 'baby',
    clinicalPrep: 'Assess for neonatal respiratory distress syndrome, pulse oximetry, nasal cannula oxygen, emergency pediatrician consult.',
    familyGuidance: 'Clear baby nose gently. Keep baby head slightly extended, wrap snugly and transport immediately.',
  },
  baby_cold_floppy: {
    code: 'baby_cold_floppy',
    number: 10,
    icon: '👶',
    shortLabel: 'Baby Cold or Limp',
    description: 'Baby feels ice cold to touch, abnormally floppy, or hard to wake up',
    severity: 'critical',
    target: 'baby',
    clinicalPrep: 'Warm radiant warmer / Kangaroo Mother Care, check rectal temp, warm IV glucose if indicated.',
    familyGuidance: 'Place baby naked directly on mother bare chest between breasts and cover both with warm dry blanket.',
  },
};

export const DANGER_SIGN_LIST = Object.values(DANGER_SIGNS);

export interface CheckInRecord {
  id: string;
  timestamp: number;
  date: string;
  channel: CheckInChannel;
  signs: DangerSignCode[];
  wellbeing: 'good' | 'fair' | 'poor';
  fetalMovement?: 'active' | 'reduced' | 'none';
  babyWellbeing?: 'feeding_well' | 'feeding_poorly' | 'not_applicable';
  notes?: string;
  riskTriggered: RiskLevel;
}

export interface ResponseLogItem {
  id: string;
  timestamp: number;
  author: string;
  role: 'Nurse' | 'Midwife' | 'Doctor' | 'CHEW' | 'Community Responder';
  action: string;
  notes: string;
}

export interface Alert {
  id: string;
  motherId: string;
  motherName: string;
  motherPhone: string;
  familyPhone: string;
  familyName: string;
  familyRelation: string;
  facilityName: string;
  facilityPhone: string;
  urgency: 'red' | 'amber';
  signs: DangerSignCode[];
  customMessage?: string;
  timestamp: number;
  channel: CheckInChannel;
  status: AlertStatus;
  recommendedActions: string[];
  responseLogs: ResponseLogItem[];
}

export interface Mother {
  id: string;
  name: string;
  phone: string;
  state: string;
  lga: string;
  community: string;
  stage: PregnancyStage;
  eddOrDeliveryDate: string;
  deliveredAt?: number;
  gestationWeeks?: number;
  postnatalDay?: number;
  nominatedFamilyName: string;
  nominatedFamilyPhone: string;
  nominatedFamilyRelation: string;
  assignedFacility: string;
  facilityPhone: string;
  riskLevel: RiskLevel;
  lastCheckInDate?: string;
  checkIns: CheckInRecord[];
  notes?: string;
}

export interface TransportBooking {
  id: string;
  alertId: string;
  motherName: string;
  pickupLocation: string;
  destinationFacility: string;
  driverName: string;
  driverPhone: string;
  vehicleType: 'Community Tricycle (Keke)' | 'Emergency Ambulance' | 'Volunteer Taxi';
  plateNumber: string;
  status: 'dispatched' | 'en_route' | 'arrived_pickup' | 'delivered';
  etaMinutes: number;
  requestedAt: number;
}

export interface UssdMenuItem {
  id: string;
  text: string;
  options?: { key: string; label: string; nextMenuId: string; action?: string }[];
  isInput?: boolean;
  inputPrompt?: string;
  isTerminal?: boolean;
  smsNotification?: string;
}
