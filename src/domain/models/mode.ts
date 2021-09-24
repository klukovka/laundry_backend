export class Mode {
  modeId?: string | null;
  name: string;
  time: Number;
  costs: Number;

  constructor(
    name: string,
    time: Number,
    costs: Number,
    modeId: string | null = null
  ) {
    this.costs = costs;
    this.modeId = modeId;
    this.name = name;
    this.time = time;
  }
}
