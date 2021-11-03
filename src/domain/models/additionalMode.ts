export class AdditionalMode {
  additionalModeId?: string | null;
  name: string;
  time: number;
  costs: number;

  constructor(
    name: string,
    time: number,
    costs: number,
    additionalModeId: string | null = null
  ) {
    this.costs = costs;
    this.additionalModeId = additionalModeId;
    this.name = name;
    this.time = time;
  }
}
