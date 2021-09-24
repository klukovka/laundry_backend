export class AdditionalMode {
  additionalModeId?: string | null;
  name: string;
  time: Number;
  costs: Number;

  constructor(
    name: string,
    time: Number,
    costs: Number,
    additionalModeId: string | null = null
  ) {
    this.costs = costs;
    this.additionalModeId = additionalModeId;
    this.name = name;
    this.time = time;
  }
}
