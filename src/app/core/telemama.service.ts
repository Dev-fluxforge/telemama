import { Injectable, computed, effect, signal } from '@angular/core';
import {
  Alert,
  AlertStatus,
  CheckInRecord,
  DANGER_SIGNS,
  DangerSignCode,
  Mother,
  PregnancyStage,
  ResponseLogItem,
  RiskLevel,
  TransportBooking,
} from './models';

const STORAGE_KEY = 'telemama_v2_state';

export interface NigerianLgaOption {
  state: string;
  lgas: string[];
}

export const NIGERIAN_STATES_LGAS: NigerianLgaOption[] = [
  {
    state: 'Lagos',
    lgas: ['Surulere', 'Alimosho', 'Yaba / Mainland', 'Ikeja', 'Ikorodu', 'Lagos Island', 'Ajeromi-Ifelodun', 'Epe'],
  },
  {
    state: 'Oyo',
    lgas: ['Ibadan North', 'Ibadan South-West', 'Ibarapa Central', 'Oyo East', 'Ogbomoso North', 'Iseyin'],
  },
  {
    state: 'Kano',
    lgas: ['Kano Municipal', 'Nassarawa', 'Gwale', 'Dala', 'Fagge', 'Ungogo', 'Kumbotso'],
  },
  {
    state: 'Kaduna',
    lgas: ['Kaduna North', 'Kaduna South', 'Zaria', 'Chikun', 'Sabon Gari', 'Igabi'],
  },
  {
    state: 'Rivers',
    lgas: ['Port Harcourt', 'Obio-Akpor', 'Eleme', 'Ikwerre', 'Oyigbo', 'Degema'],
  },
  {
    state: 'Enugu',
    lgas: ['Enugu North', 'Enugu South', 'Nsukka', 'Udi', 'Awgu', 'Oji River'],
  },
  {
    state: 'Abuja FCT',
    lgas: ['Abuja Municipal (AMAC)', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali'],
  },
];

function seedMothers(): Mother[] {
  const now = Date.now();
  const DAY_MS = 86400000;

  return [
    {
      id: 'm1',
      name: 'Folake Adeyemi',
      phone: '+234 803 451 8920',
      state: 'Oyo',
      lga: 'Ibadan North',
      community: 'Bodija / Agodi Gate',
      stage: 'postnatal',
      eddOrDeliveryDate: '2026-10-20',
      deliveredAt: now - 4 * DAY_MS,
      postnatalDay: 4,
      nominatedFamilyName: 'Babatunde Adeyemi',
      nominatedFamilyPhone: '+234 802 334 1189',
      nominatedFamilyRelation: 'Husband',
      assignedFacility: 'Adeoyo Maternity Teaching Hospital',
      facilityPhone: '+234 800 233 6960',
      riskLevel: 'red',
      lastCheckInDate: 'Today, 25 mins ago',
      notes: 'Baby girl delivered via uncomplicated SVD at 3.2kg. Reported heavy bleeding postpartum.',
      checkIns: [
        {
          id: 'ci-1a',
          timestamp: now - 3 * DAY_MS,
          date: 'Day 1 Postnatal',
          channel: 'sms',
          signs: [],
          wellbeing: 'good',
          babyWellbeing: 'feeding_well',
          riskTriggered: 'green',
        },
        {
          id: 'ci-1b',
          timestamp: now - 25 * 60 * 1000,
          date: 'Day 4 Postnatal (Today)',
          channel: 'ussd',
          signs: ['heavy_bleeding', 'severe_headache'],
          wellbeing: 'poor',
          babyWellbeing: 'feeding_well',
          notes: 'Soaked 2 cloths in 45 mins. Severe throbbing forehead headache.',
          riskTriggered: 'red',
        },
      ],
    },
    {
      id: 'm2',
      name: 'Amina Abubakar',
      phone: '+234 816 772 3401',
      state: 'Kano',
      lga: 'Kano Municipal',
      community: 'Kofar Nassarawa',
      stage: 'pregnant',
      eddOrDeliveryDate: '2026-11-28',
      gestationWeeks: 35,
      nominatedFamilyName: 'Fatima Bello',
      nominatedFamilyPhone: '+234 813 550 9922',
      nominatedFamilyRelation: 'Mother',
      assignedFacility: 'Aminu Kano Teaching Hospital (AKTH)',
      facilityPhone: '+234 800 555 1212',
      riskLevel: 'red',
      lastCheckInDate: 'Today, 1 hour ago',
      notes: 'Primigravida at 35 weeks. High risk for pre-eclampsia. Reported visual disturbances.',
      checkIns: [
        {
          id: 'ci-2a',
          timestamp: now - 60 * 60 * 1000,
          date: 'Week 35 Check-in',
          channel: 'web',
          signs: ['severe_headache', 'blurred_vision'],
          wellbeing: 'poor',
          fetalMovement: 'active',
          notes: 'Seeing bright lightning flashes and double vision since early morning.',
          riskTriggered: 'red',
        },
      ],
    },
    {
      id: 'm3',
      name: 'Chioma Okafor',
      phone: '+234 703 119 4588',
      state: 'Lagos',
      lga: 'Surulere',
      community: 'Ojuelegba / Itire',
      stage: 'postnatal',
      eddOrDeliveryDate: '2026-10-15',
      deliveredAt: now - 9 * DAY_MS,
      postnatalDay: 9,
      nominatedFamilyName: 'Nkechi Okafor',
      nominatedFamilyPhone: '+234 809 443 2100',
      nominatedFamilyRelation: 'Sister',
      assignedFacility: 'Randle General Hospital, Surulere',
      facilityPhone: '+234 800 901 2234',
      riskLevel: 'amber',
      lastCheckInDate: 'Yesterday 4:00 PM',
      notes: 'Baby boy 3.4kg. Missed Day 7 formal check-in; mild puffy ankles reported.',
      checkIns: [
        {
          id: 'ci-3a',
          timestamp: now - 8 * DAY_MS,
          date: 'Day 1 Postnatal',
          channel: 'ussd',
          signs: [],
          wellbeing: 'good',
          babyWellbeing: 'feeding_well',
          riskTriggered: 'green',
        },
        {
          id: 'ci-3b',
          timestamp: now - 20 * 60 * 60 * 1000,
          date: 'Day 8 Postnatal',
          channel: 'sms',
          signs: ['swollen_extremities'],
          wellbeing: 'fair',
          babyWellbeing: 'feeding_well',
          notes: 'Feet cannot fit into slippers. Feeling very tired.',
          riskTriggered: 'amber',
        },
      ],
    },
    {
      id: 'm4',
      name: 'Blessing Eze',
      phone: '+234 805 667 8900',
      state: 'Lagos',
      lga: 'Yaba / Mainland',
      community: 'Akoka / University Road',
      stage: 'pregnant',
      eddOrDeliveryDate: '2026-11-12',
      gestationWeeks: 37,
      nominatedFamilyName: 'Emeka Eze',
      nominatedFamilyPhone: '+234 802 889 0012',
      nominatedFamilyRelation: 'Husband',
      assignedFacility: 'Lagos Island Maternity Hospital',
      facilityPhone: '+234 800 334 7789',
      riskLevel: 'amber',
      lastCheckInDate: 'Today, 2 hours ago',
      notes: 'Term pregnancy. Kick count dropped below 6 kicks in 2 hours.',
      checkIns: [
        {
          id: 'ci-4a',
          timestamp: now - 2 * 60 * 60 * 1000,
          date: 'Week 37 Check-in',
          channel: 'web',
          signs: [],
          wellbeing: 'fair',
          fetalMovement: 'reduced',
          notes: 'Baby has not kicked much this morning after drinking cold water.',
          riskTriggered: 'amber',
        },
      ],
    },
    {
      id: 'm5',
      name: 'Hauwa Ibrahim',
      phone: '+234 818 221 6650',
      state: 'Kaduna',
      lga: 'Kaduna North',
      community: 'Unguwan Rimi',
      stage: 'postnatal',
      eddOrDeliveryDate: '2026-10-10',
      deliveredAt: now - 14 * DAY_MS,
      postnatalDay: 14,
      nominatedFamilyName: 'Zainab Ibrahim',
      nominatedFamilyPhone: '+234 803 776 5543',
      nominatedFamilyRelation: 'Aunt',
      assignedFacility: 'Yusuf Dantsoho Memorial Hospital',
      facilityPhone: '+234 800 445 6677',
      riskLevel: 'green',
      lastCheckInDate: 'Today, 7:15 AM',
      notes: 'Baby girl exclusive breastfeeding. Cord separated cleanly on Day 5.',
      checkIns: [
        {
          id: 'ci-5a',
          timestamp: now - 4 * 60 * 60 * 1000,
          date: 'Day 14 Postnatal Milestone',
          channel: 'ussd',
          signs: [],
          wellbeing: 'good',
          babyWellbeing: 'feeding_well',
          riskTriggered: 'green',
        },
      ],
    },
    {
      id: 'm6',
      name: 'Temitope Ogunleye',
      phone: '+234 807 992 4110',
      state: 'Oyo',
      lga: 'Ibadan South-West',
      community: 'Ring Road / Challenge',
      stage: 'pregnant',
      eddOrDeliveryDate: '2027-01-14',
      gestationWeeks: 28,
      nominatedFamilyName: 'Olumide Ogunleye',
      nominatedFamilyPhone: '+234 812 334 9901',
      nominatedFamilyRelation: 'Husband',
      assignedFacility: 'State Hospital Ring Road, Ibadan',
      facilityPhone: '+234 800 119 4433',
      riskLevel: 'green',
      lastCheckInDate: 'Yesterday 11:30 AM',
      notes: 'Second pregnancy. Booking scan normal. Iron and folic acid compliant.',
      checkIns: [
        {
          id: 'ci-6a',
          timestamp: now - 24 * 60 * 60 * 1000,
          date: 'Week 28 Antenatal Check-in',
          channel: 'web',
          signs: [],
          wellbeing: 'good',
          fetalMovement: 'active',
          riskTriggered: 'green',
        },
      ],
    },
    {
      id: 'm7',
      name: 'Ngozi Nwosu',
      phone: '+234 810 554 3218',
      state: 'Enugu',
      lga: 'Enugu North',
      community: 'New Haven / Ogui',
      stage: 'postnatal',
      eddOrDeliveryDate: '2026-10-03',
      deliveredAt: now - 21 * DAY_MS,
      postnatalDay: 21,
      nominatedFamilyName: 'Chidiebere Nwosu',
      nominatedFamilyPhone: '+234 803 998 7711',
      nominatedFamilyRelation: 'Husband',
      assignedFacility: 'Mother of Christ Maternity Hospital',
      facilityPhone: '+234 800 338 9900',
      riskLevel: 'green',
      lastCheckInDate: '2 days ago',
      notes: 'Baby boy 4.1kg at 3 weeks. Immunizations up to date (BCG, OPV0, HepB0).',
      checkIns: [
        {
          id: 'ci-7a',
          timestamp: now - 48 * 60 * 60 * 1000,
          date: 'Day 21 Check-in',
          channel: 'sms',
          signs: [],
          wellbeing: 'good',
          babyWellbeing: 'feeding_well',
          riskTriggered: 'green',
        },
      ],
    },
  ];
}

function seedAlerts(): Alert[] {
  const now = Date.now();
  return [
    {
      id: 'alt-1',
      motherId: 'm1',
      motherName: 'Folake Adeyemi',
      motherPhone: '+234 803 451 8920',
      familyPhone: '+234 802 334 1189',
      familyName: 'Babatunde Adeyemi',
      familyRelation: 'Husband',
      facilityName: 'Adeoyo Maternity Teaching Hospital',
      facilityPhone: '+234 800 233 6960',
      urgency: 'red',
      signs: ['heavy_bleeding', 'severe_headache'],
      customMessage: 'Reported soaking 2 cloths in 45 mins with throbbing forehead pain. Postnatal Day 4.',
      timestamp: now - 25 * 60 * 1000,
      channel: 'ussd',
      status: 'open',
      recommendedActions: [
        'Prepare IV 16G cannulas and 20 IU Oxytocin infusion in 500mL Hartmann / Normal Saline',
        'Ready BP cuff for immediate pre-eclampsia / shock assessment',
        'Call Babatunde (Husband) to confirm emergency transport is rolling',
      ],
      responseLogs: [
        {
          id: 'rl-1',
          timestamp: now - 22 * 60 * 1000,
          author: 'Telemama Automated Dispatch',
          role: 'CHEW',
          action: 'SMS & IVR Triggered',
          notes: 'Emergency SMS dispatched to Husband (+234 802 334 1189) and Adeoyo Triage Desk.',
        },
      ],
    },
    {
      id: 'alt-2',
      motherId: 'm2',
      motherName: 'Amina Abubakar',
      motherPhone: '+234 816 772 3401',
      familyPhone: '+234 813 550 9922',
      familyName: 'Fatima Bello',
      familyRelation: 'Mother',
      facilityName: 'Aminu Kano Teaching Hospital (AKTH)',
      facilityPhone: '+234 800 555 1212',
      urgency: 'red',
      signs: ['severe_headache', 'blurred_vision'],
      customMessage: 'Week 35 pregnant. High risk for impending eclampsia convulsions.',
      timestamp: now - 60 * 60 * 1000,
      channel: 'web',
      status: 'contacted',
      recommendedActions: [
        'Prepare Magnesium Sulphate loading dose protocol (Pritchard regimen)',
        'Check proteinuria via urine dipstick upon triage arrival',
        'Prepare darkened, low-stimulus triage bed',
      ],
      responseLogs: [
        {
          id: 'rl-2a',
          timestamp: now - 55 * 60 * 1000,
          author: 'Nurse Halima (AKTH)',
          role: 'Nurse',
          action: 'Direct Call to Family',
          notes: 'Spoke with mother Fatima. Advised not to give local concoctions. Family preparing taxi.',
        },
      ],
    },
  ];
}

function seedBookings(): TransportBooking[] {
  const now = Date.now();
  return [
    {
      id: 'tr-1',
      alertId: 'alt-1',
      motherName: 'Folake Adeyemi',
      pickupLocation: 'Bodija Market Road, Ibadan North',
      destinationFacility: 'Adeoyo Maternity Hospital',
      driverName: 'Alhaji Tunde (Keke Emergency Responder)',
      driverPhone: '+234 803 912 4400',
      vehicleType: 'Community Tricycle (Keke)',
      plateNumber: 'OYO-592-BDJ',
      status: 'en_route',
      etaMinutes: 8,
      requestedAt: now - 15 * 60 * 1000,
    },
  ];
}

@Injectable({ providedIn: 'root' })
export class TelemamaService {
  readonly mothers = signal<Mother[]>([]);
  readonly alerts = signal<Alert[]>([]);
  readonly transportBookings = signal<TransportBooking[]>([]);

  // Active user / mother selected for the mother flow
  readonly currentMotherId = signal<string>('m1');

  // Currently viewing mother in mother flow
  readonly currentMother = computed(() => {
    const list = this.mothers();
    return list.find((m) => m.id === this.currentMotherId()) || list[0] || null;
  });

  // Active high-priority alert for top banner
  readonly activeUrgentAlert = computed(() => {
    return this.alerts().find((a) => a.urgency === 'red' && a.status !== 'resolved') || null;
  });

  // Computed counts for dashboard
  readonly stats = computed(() => {
    const list = this.mothers();
    const alertList = this.alerts();
    return {
      total: list.length,
      red: list.filter((m) => m.riskLevel === 'red').length,
      amber: list.filter((m) => m.riskLevel === 'amber').length,
      green: list.filter((m) => m.riskLevel === 'green').length,
      openAlerts: alertList.filter((a) => a.status !== 'resolved').length,
      postnatal: list.filter((m) => m.stage === 'postnatal').length,
      pregnant: list.filter((m) => m.stage === 'pregnant').length,
    };
  });

  constructor() {
    this.hydrateFromStorage();

    // Auto-persist state changes
    effect(() => {
      const data = {
        mothers: this.mothers(),
        alerts: this.alerts(),
        transportBookings: this.transportBookings(),
        currentMotherId: this.currentMotherId(),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
    });
  }

  private hydrateFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.mothers && parsed.mothers.length > 0) {
          this.mothers.set(parsed.mothers);
          this.alerts.set(parsed.alerts || []);
          this.transportBookings.set(parsed.transportBookings || []);
          if (parsed.currentMotherId) {
            this.currentMotherId.set(parsed.currentMotherId);
          }
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to hydrate from localStorage, fallback to seed', e);
    }
    this.resetToDefaults();
  }

  resetToDefaults(): void {
    this.mothers.set(seedMothers());
    this.alerts.set(seedAlerts());
    this.transportBookings.set(seedBookings());
    this.currentMotherId.set('m1');
  }

  switchMother(id: string): void {
    this.currentMotherId.set(id);
  }

  getMotherById(id: string): Mother | undefined {
    return this.mothers().find((m) => m.id === id);
  }

  getAlertsForMother(motherId: string): Alert[] {
    return this.alerts().filter((a) => a.motherId === motherId);
  }

  getBookingForAlert(alertId: string): TransportBooking | undefined {
    return this.transportBookings().find((b) => b.alertId === alertId);
  }

  // 1. Submit a Daily / Periodic Check-In
  submitCheckIn(params: {
    motherId: string;
    signs: DangerSignCode[];
    wellbeing: 'good' | 'fair' | 'poor';
    babyWellbeing?: 'feeding_well' | 'feeding_poorly' | 'not_applicable';
    fetalMovement?: 'active' | 'reduced' | 'none';
    notes?: string;
    channel?: 'web' | 'ussd' | 'sms';
  }): { risk: RiskLevel; alertCreated: boolean } {
    const mother = this.getMotherById(params.motherId);
    if (!mother) return { risk: 'green', alertCreated: false };

    const channel = params.channel || 'web';
    const hasCriticalSigns = params.signs.some((s) => DANGER_SIGNS[s]?.severity === 'critical');
    const hasWarningSigns = params.signs.some((s) => DANGER_SIGNS[s]?.severity === 'warning');

    let calculatedRisk: RiskLevel = 'green';
    if (hasCriticalSigns || params.wellbeing === 'poor') {
      calculatedRisk = 'red';
    } else if (hasWarningSigns || params.fetalMovement === 'reduced' || params.babyWellbeing === 'feeding_poorly' || params.wellbeing === 'fair') {
      calculatedRisk = 'amber';
    }

    const newRecord: CheckInRecord = {
      id: 'ci-' + Date.now(),
      timestamp: Date.now(),
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
      channel,
      signs: params.signs,
      wellbeing: params.wellbeing,
      babyWellbeing: params.babyWellbeing,
      fetalMovement: params.fetalMovement,
      notes: params.notes,
      riskTriggered: calculatedRisk,
    };

    // Update mother
    this.mothers.update((prev) =>
      prev.map((m) =>
        m.id === params.motherId
          ? {
              ...m,
              riskLevel: calculatedRisk === 'green' && m.riskLevel === 'red' ? 'amber' : calculatedRisk,
              lastCheckInDate: 'Just now',
              checkIns: [newRecord, ...m.checkIns],
            }
          : m
      )
    );

    let alertCreated = false;
    if (calculatedRisk === 'red' || calculatedRisk === 'amber') {
      alertCreated = true;
      const recommendedActions: string[] = [];
      params.signs.forEach((s) => {
        if (DANGER_SIGNS[s]) {
          recommendedActions.push(DANGER_SIGNS[s].clinicalPrep);
        }
      });
      if (recommendedActions.length === 0) {
        recommendedActions.push('Contact mother immediately for clinical symptom triage.');
      }

      const newAlert: Alert = {
        id: 'alt-' + Date.now(),
        motherId: mother.id,
        motherName: mother.name,
        motherPhone: mother.phone,
        familyPhone: mother.nominatedFamilyPhone,
        familyName: mother.nominatedFamilyName,
        familyRelation: mother.nominatedFamilyRelation,
        facilityName: mother.assignedFacility,
        facilityPhone: mother.facilityPhone,
        urgency: calculatedRisk,
        signs: params.signs,
        customMessage: params.notes || `Reported ${params.signs.length} symptom(s) via ${channel.toUpperCase()}`,
        timestamp: Date.now(),
        channel,
        status: 'open',
        recommendedActions,
        responseLogs: [
          {
            id: 'rl-' + Date.now(),
            timestamp: Date.now(),
            author: 'Telemama Central Dispatch',
            role: 'Midwife',
            action: 'Alert Dispatched',
            notes: `Automated alert triggered via ${channel}. Notified ${mother.nominatedFamilyName} (${mother.nominatedFamilyRelation}) and ${mother.assignedFacility}.`,
          },
        ],
      };

      this.alerts.update((prev) => [newAlert, ...prev]);
    }

    return { risk: calculatedRisk, alertCreated };
  }

  // 2. Big Red Emergency SOS Trigger
  triggerEmergencySOS(motherId: string, customReason?: string): Alert {
    const mother = this.getMotherById(motherId) || this.currentMother() || this.mothers()[0];
    const signs: DangerSignCode[] = ['heavy_bleeding', 'severe_abdominal_pain'];

    // Update mother risk to red
    this.mothers.update((prev) =>
      prev.map((m) =>
        m.id === mother.id
          ? {
              ...m,
              riskLevel: 'red',
              lastCheckInDate: 'Emergency SOS Just Now',
              checkIns: [
                {
                  id: 'ci-sos-' + Date.now(),
                  timestamp: Date.now(),
                  date: 'EMERGENCY SOS',
                  channel: 'web',
                  signs,
                  wellbeing: 'poor',
                  notes: customReason || 'MOTHER PRESSED EMERGENCY "I NEED HELP NOW" BUTTON',
                  riskTriggered: 'red',
                },
                ...m.checkIns,
              ],
            }
          : m
      )
    );

    const newAlert: Alert = {
      id: 'alt-sos-' + Date.now(),
      motherId: mother.id,
      motherName: mother.name,
      motherPhone: mother.phone,
      familyPhone: mother.nominatedFamilyPhone,
      familyName: mother.nominatedFamilyName,
      familyRelation: mother.nominatedFamilyRelation,
      facilityName: mother.assignedFacility,
      facilityPhone: mother.facilityPhone,
      urgency: 'red',
      signs,
      customMessage: customReason || '🚨 MOTHER PRESSED ONE-TAP EMERGENCY "I NEED HELP NOW" SOS BUTTON!',
      timestamp: Date.now(),
      channel: 'web',
      status: 'open',
      recommendedActions: [
        'PRIORITY 1: Call mother immediately to assess airway, breathing, consciousness',
        'Call nominated family support (' + mother.nominatedFamilyName + ') to verify physical presence',
        'Dispatch community emergency transport to ' + mother.community + ', ' + mother.lga,
        'Alert Duty Obstetrician at ' + mother.assignedFacility,
      ],
      responseLogs: [
        {
          id: 'rl-' + Date.now(),
          timestamp: Date.now(),
          author: 'Emergency SOS Gateway',
          role: 'Doctor',
          action: 'HIGH PRIORITY SOS BROADCAST',
          notes: 'Immediate sirens activated. SMS + automated voice call blasted to family & clinic.',
        },
      ],
    };

    this.alerts.update((prev) => [newAlert, ...prev]);
    return newAlert;
  }

  // 3. Health Worker Response Log & Status Update
  addResponseLog(alertId: string, author: string, role: ResponseLogItem['role'], action: string, notes: string): void {
    const newItem: ResponseLogItem = {
      id: 'rl-' + Date.now(),
      timestamp: Date.now(),
      author,
      role,
      action,
      notes,
    };

    this.alerts.update((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, responseLogs: [newItem, ...a.responseLogs] } : a))
    );
  }

  updateAlertStatus(alertId: string, status: AlertStatus, logNote?: string, author: string = 'Facility Midwife'): void {
    this.alerts.update((prev) =>
      prev.map((a) => {
        if (a.id === alertId) {
          const logs = [...a.responseLogs];
          if (logNote) {
            logs.unshift({
              id: 'rl-' + Date.now(),
              timestamp: Date.now(),
              author,
              role: 'Midwife',
              action: `Status: ${status.replace('_', ' ').toUpperCase()}`,
              notes: logNote,
            });
          }
          return { ...a, status, responseLogs: logs };
        }
        return a;
      })
    );

    // If resolved, recalculate mother risk if no other open red alerts exist
    if (status === 'resolved') {
      const alert = this.alerts().find((a) => a.id === alertId);
      if (alert) {
        const remainingRed = this.alerts().some((a) => a.motherId === alert.motherId && a.id !== alertId && a.urgency === 'red' && a.status !== 'resolved');
        if (!remainingRed) {
          this.mothers.update((prev) =>
            prev.map((m) => (m.id === alert.motherId ? { ...m, riskLevel: 'green' } : m))
          );
        }
      }
    }
  }

  // 4. Request Emergency Transport Simulation
  requestTransport(params: {
    alertId: string;
    motherName: string;
    pickupLocation: string;
    destinationFacility: string;
    vehicleType?: TransportBooking['vehicleType'];
  }): TransportBooking {
    const drivers = [
      { name: 'Mallam Ibrahim', phone: '+234 803 711 0293', vehicle: 'Community Tricycle (Keke)', plate: 'NG-482-AMB' },
      { name: 'Alhaji Tunde', phone: '+234 802 884 1902', vehicle: 'Volunteer Taxi', plate: 'LAG-301-XY' },
      { name: 'Driver Chuka', phone: '+234 814 660 7721', vehicle: 'Emergency Ambulance', plate: 'FCT-990-HOS' },
    ];
    const picked = drivers[Math.floor(Math.random() * drivers.length)];

    const booking: TransportBooking = {
      id: 'tr-' + Date.now(),
      alertId: params.alertId,
      motherName: params.motherName,
      pickupLocation: params.pickupLocation,
      destinationFacility: params.destinationFacility,
      driverName: picked.name,
      driverPhone: picked.phone,
      vehicleType: params.vehicleType || (picked.vehicle as any),
      plateNumber: picked.plate,
      status: 'dispatched',
      etaMinutes: 10,
      requestedAt: Date.now(),
    };

    this.transportBookings.update((prev) => [booking, ...prev]);

    // Update alert status & add log
    this.updateAlertStatus(
      params.alertId,
      'transport_dispatched',
      `Emergency ${booking.vehicleType} dispatched. Driver: ${booking.driverName} (${booking.plateNumber}). ETA: ${booking.etaMinutes} mins.`
    );

    return booking;
  }

  // 5. Enrol a New Mother
  enrollMother(data: {
    name: string;
    phone: string;
    state: string;
    lga: string;
    community: string;
    stage: PregnancyStage;
    eddOrDeliveryDate: string;
    nominatedFamilyName: string;
    nominatedFamilyPhone: string;
    nominatedFamilyRelation: string;
    assignedFacility: string;
    notes?: string;
  }): Mother {
    const newMother: Mother = {
      id: 'm-' + Date.now(),
      name: data.name,
      phone: data.phone,
      state: data.state,
      lga: data.lga,
      community: data.community,
      stage: data.stage,
      eddOrDeliveryDate: data.eddOrDeliveryDate,
      deliveredAt: data.stage === 'postnatal' ? Date.now() - 24 * 3600000 : undefined,
      postnatalDay: data.stage === 'postnatal' ? 1 : undefined,
      gestationWeeks: data.stage === 'pregnant' ? 32 : undefined,
      nominatedFamilyName: data.nominatedFamilyName,
      nominatedFamilyPhone: data.nominatedFamilyPhone,
      nominatedFamilyRelation: data.nominatedFamilyRelation,
      assignedFacility: data.assignedFacility,
      facilityPhone: '+234 800 555 9000',
      riskLevel: 'green',
      lastCheckInDate: 'Enrolled Today',
      notes: data.notes || 'Newly registered onto Telemama monitoring.',
      checkIns: [
        {
          id: 'ci-enrol-' + Date.now(),
          timestamp: Date.now(),
          date: 'Enrolment Baseline',
          channel: 'web',
          signs: [],
          wellbeing: 'good',
          riskTriggered: 'green',
          notes: 'Baseline intake complete. Automated daily check-in schedule initialized.',
        },
      ],
    };

    this.mothers.update((prev) => [newMother, ...prev]);
    this.currentMotherId.set(newMother.id);
    return newMother;
  }

  // 6. Demo Scenario Switcher for Hackathon Judges
  loadScenario(scenario: 'emergency_bleeding' | 'all_stable' | 'default'): void {
    this.resetToDefaults();
    if (scenario === 'emergency_bleeding') {
      this.currentMotherId.set('m1');
    } else if (scenario === 'all_stable') {
      this.alerts.set([]);
      this.mothers.update((prev) =>
        prev.map((m) => ({
          ...m,
          riskLevel: 'green',
        }))
      );
      this.currentMotherId.set('m5'); // Hauwa Ibrahim (healthy)
    }
  }
}
