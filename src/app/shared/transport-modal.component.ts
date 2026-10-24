import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Alert, TransportBooking } from '../core/models';
import { TelemamaService } from '../core/telemama.service';

@Component({
  selector: 'app-transport-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div class="tm-card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border-2 border-forest-600/30">
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-stone-200">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">🚑</span>
            <div>
              <h2 id="modal-title" class="text-lg font-bold text-charcoal">Emergency Transport Dispatch</h2>
              <p class="text-xs text-stone-500">Nigeria Community Health Transport Network</p>
            </div>
          </div>
          <button
            type="button"
            (click)="onClose.emit()"
            class="text-stone-400 hover:text-stone-700 text-2xl font-bold p-1 leading-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        @if (!activeBooking) {
          <!-- Dispatch Form -->
          <form (ngSubmit)="handleDispatch()" class="mt-4 space-y-4">
            <div class="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
              <span class="font-bold">Dispatching for:</span> {{ alert?.motherName }} ({{ alert?.facilityName }})
            </div>

            <div>
              <label class="tm-label">Pickup Community / Landmark</label>
              <input
                type="text"
                [(ngModel)]="pickupLocation"
                name="pickupLocation"
                required
                class="tm-input text-sm"
                placeholder="e.g. Bodija Market near Central Mosque, Ibadan"
              />
            </div>

            <div>
              <label class="tm-label">Destination Facility</label>
              <input
                type="text"
                [(ngModel)]="destinationFacility"
                name="destinationFacility"
                required
                class="tm-input text-sm"
              />
            </div>

            <div>
              <label class="tm-label">Select Nearest Available Vehicle</label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  (click)="selectedVehicle = 'Community Tricycle (Keke)'"
                  class="p-3 rounded-xl border-2 text-left transition-all"
                  [class]="selectedVehicle === 'Community Tricycle (Keke)' ? 'border-terracotta bg-terracotta-50/70 font-bold' : 'border-stone-200 hover:border-stone-300'"
                >
                  <span class="text-xl block mb-1">🛺</span>
                  <p class="text-xs font-semibold">Keke Tricycle</p>
                  <p class="text-[10px] text-stone-500">Best for narrow alleys (ETA 8 min)</p>
                </button>

                <button
                  type="button"
                  (click)="selectedVehicle = 'Emergency Ambulance'"
                  class="p-3 rounded-xl border-2 text-left transition-all"
                  [class]="selectedVehicle === 'Emergency Ambulance' ? 'border-terracotta bg-terracotta-50/70 font-bold' : 'border-stone-200 hover:border-stone-300'"
                >
                  <span class="text-xl block mb-1">🚑</span>
                  <p class="text-xs font-semibold">PHC Ambulance</p>
                  <p class="text-[10px] text-stone-500">With oxygen supply (ETA 14 min)</p>
                </button>

                <button
                  type="button"
                  (click)="selectedVehicle = 'Volunteer Taxi'"
                  class="p-3 rounded-xl border-2 text-left transition-all"
                  [class]="selectedVehicle === 'Volunteer Taxi' ? 'border-terracotta bg-terracotta-50/70 font-bold' : 'border-stone-200 hover:border-stone-300'"
                >
                  <span class="text-xl block mb-1">🚕</span>
                  <p class="text-xs font-semibold">Volunteer Driver</p>
                  <p class="text-[10px] text-stone-500">NURTW partner (ETA 10 min)</p>
                </button>
              </div>
            </div>

            <div class="pt-3 border-t border-stone-200 flex justify-end gap-2">
              <button type="button" (click)="onClose.emit()" class="tm-btn tm-btn-ghost text-sm">
                Cancel
              </button>
              <button type="submit" class="tm-btn tm-btn-primary text-sm">
                Confirm & Dispatch Driver
              </button>
            </div>
          </form>
        } @else {
          <!-- Booking Status Tracker -->
          <div class="mt-4 space-y-4">
            <div class="p-4 bg-forest-50 border-2 border-forest-300 rounded-2xl text-center">
              <span class="inline-flex items-center justify-center w-12 h-12 bg-forest-600 text-white rounded-full text-2xl mb-2 animate-bounce">
                🛺
              </span>
              <h3 class="text-lg font-bold text-forest-900">Driver Dispatched & En Route!</h3>
              <p class="text-xs text-forest-700 mt-1">
                Estimated arrival at mother's location in <span class="font-bold text-sm">{{ activeBooking.etaMinutes }} minutes</span>
              </p>
            </div>

            <div class="bg-stone-50 p-4 rounded-xl space-y-2 text-sm border border-stone-200">
              <div class="flex justify-between">
                <span class="text-stone-500">Driver Name:</span>
                <span class="font-bold text-charcoal">{{ activeBooking.driverName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-stone-500">Vehicle:</span>
                <span class="font-semibold text-charcoal">{{ activeBooking.vehicleType }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-stone-500">License Plate:</span>
                <span class="font-mono font-bold bg-white px-2 py-0.5 rounded border border-stone-300">{{ activeBooking.plateNumber }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-stone-500">Driver Contact:</span>
                <a [href]="'tel:' + activeBooking.driverPhone" class="font-bold text-terracotta underline">
                  {{ activeBooking.driverPhone }}
                </a>
              </div>
              <div class="flex justify-between">
                <span class="text-stone-500">Pickup Destination:</span>
                <span class="font-semibold text-charcoal text-right">{{ activeBooking.destinationFacility }}</span>
              </div>
            </div>

            <div class="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
              <span class="text-base">ℹ️</span>
              <p>
                An automated SMS confirmation with driver details has been sent to the mother's phone and her family support person.
              </p>
            </div>

            <div class="pt-3 border-t border-stone-200 flex justify-between">
              <a
                [href]="'tel:' + activeBooking.driverPhone"
                class="tm-btn tm-btn-forest text-xs py-2 px-4"
              >
                📞 Call Driver Direct
              </a>
              <button
                type="button"
                (click)="onClose.emit()"
                class="tm-btn tm-btn-primary text-xs py-2 px-4"
              >
                Done
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class TransportModalComponent {
  @Input() alert: Alert | null = null;
  @Output() onClose = new EventEmitter<void>();

  svc = inject(TelemamaService);

  pickupLocation = '';
  destinationFacility = '';
  selectedVehicle: TransportBooking['vehicleType'] = 'Community Tricycle (Keke)';
  activeBooking: TransportBooking | null = null;

  ngOnInit() {
    if (this.alert) {
      const mother = this.svc.getMotherById(this.alert.motherId);
      this.pickupLocation = mother ? `${mother.community}, ${mother.lga}` : 'Main Street Landmark';
      this.destinationFacility = this.alert.facilityName;

      // Check if already booked
      const existing = this.svc.getBookingForAlert(this.alert.id);
      if (existing) {
        this.activeBooking = existing;
      }
    }
  }

  handleDispatch() {
    if (!this.alert) return;
    this.activeBooking = this.svc.requestTransport({
      alertId: this.alert.id,
      motherName: this.alert.motherName,
      pickupLocation: this.pickupLocation,
      destinationFacility: this.destinationFacility,
      vehicleType: this.selectedVehicle,
    });
  }
}
