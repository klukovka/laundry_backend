import { Laundry } from './laundry';
import { WashMachine } from './washMachine';

export class StatisticLaundry {
  laundry: Laundry;
  laundryValue: number;
  washMachineValue: Map<WashMachine, number>;

  constructor(
    laundry: Laundry,
    laundryValue: number,
    washMachineValue: Map<WashMachine, number>
  ) {
    this.laundry = laundry;
    this.washMachineValue = washMachineValue;
    this.laundryValue = laundryValue;
  }
}
