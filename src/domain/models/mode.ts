import { Laundry } from './laundry';

export class Mode {
  modeId?: string | null;
  name: string;
  time: number;
  costs: number;
  laundry?: Laundry | null;
  laundryId: string;

  constructor(
    name: string,
    time: number,
    costs: number,
    laundryId: string,
    modeId: string | null = null,
    laundry: Laundry | null = null
  ) {
    this.costs = costs;
    this.modeId = modeId;
    this.name = name;
    this.time = time;
    this.laundryId = laundryId;
    this.laundry = laundry;
  }
}
