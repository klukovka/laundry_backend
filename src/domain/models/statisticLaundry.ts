import { Laundry } from './laundry';
import { WashMachine } from './washMachine';

export class StatisticLaundry<T> {
  laundry: Laundry;
  laundryValue: T;
  washMachineValue: Map<WashMachine, T>;

  constructor(
    laundry: Laundry,
    laundryValue: T,
    washMachineValue: Map<WashMachine, T>
  ) {
    this.laundry = laundry;
    this.washMachineValue = washMachineValue;
    this.laundryValue = laundryValue;
  }
}
