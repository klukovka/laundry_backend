export class Mode {
  modeId?: string | null;
  name: string;
  time: number;
  costs: number;

  constructor(
    name: string,
    time: number,
    costs: number,
    modeId: string | null = null
  ) {
    this.costs = costs;
    this.modeId = modeId;
    this.name = name;
    this.time = time;
  }
}
