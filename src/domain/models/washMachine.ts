import { Laundry } from './laundry';

export class WashMachine {
  idWashMachine?: string | null;
  manufacturer: string;
  capacity: Number;
  powerUsage: Number;
  spinningSpeed: Number;
  laundry?: Laundry | null;
  idLaundry: string;

  constructor(
    manufacturer: string,
    capacity: Number,
    powerUsage: Number,
    spinningSpeed: Number,
    idLaundry: string,
    idWashMachine: string | null = null,
    laundry: Laundry | null = null
  ) {
    this.manufacturer = manufacturer;
    this.capacity = capacity;
    this.powerUsage = powerUsage;
    this.spinningSpeed = spinningSpeed;
    this.laundry = laundry;
    this.idWashMachine = idWashMachine;
    this.idLaundry = idLaundry;
  }
}
