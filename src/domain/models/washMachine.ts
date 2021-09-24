import { Laundry } from './laundry';

export class WashMachine {
  washMachineId?: string | null;
  model: string;
  manufacturer: string;
  capacity: Number;
  powerUsage: Number;
  spinningSpeed: Number;
  laundry?: Laundry | null;
  laundryId: string;

  constructor(
    model: string,
    manufacturer: string,
    capacity: Number,
    powerUsage: Number,
    spinningSpeed: Number,
    laundryId: string,
    washMachineId: string | null = null,
    laundry: Laundry | null = null
  ) {
    this.model = model;
    this.manufacturer = manufacturer;
    this.capacity = capacity;
    this.powerUsage = powerUsage;
    this.spinningSpeed = spinningSpeed;
    this.laundry = laundry;
    this.washMachineId = washMachineId;
    this.laundryId = laundryId;
  }
}
