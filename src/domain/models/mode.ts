export class Mode {
  idMode?: string | null;
  name: string;
  time: Number;
  costs: Number;

  constructor(
    name: string,
    time: Number,
    costs: Number,
    idMode: string | null = null
  ) {
    this.costs = costs;
    this.idMode = idMode;
    this.name = name;
    this.time = time;
  }
}
