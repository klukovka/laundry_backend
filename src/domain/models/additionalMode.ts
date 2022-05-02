import { Laundry } from './laundry';

export class AdditionalMode {
  additionalModeId?: string | null;
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
    additionalModeId: string | null = null,
    laundry: Laundry | null = null
  ) {
    this.costs = costs;
    this.additionalModeId = additionalModeId;
    this.name = name;
    this.time = time;
    this.laundryId = laundryId;
    this.laundry = laundry;
  }
}
