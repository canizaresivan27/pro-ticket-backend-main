export class CreateProjectDto {
  constructor(
    public readonly name: string,
    public readonly date: { start: Date; end: Date },
    public readonly raffleConfig: {
      img?: string;
      totalTickets: number;
      perTicket: number;
      qrPosition: string;
      numberPosition: string;
    },
    public readonly state: string = "ACTIVE" //public readonly user: string
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateProjectDto?] {
    const { name, date, raffleConfig, state } = object;

    if (!name) return ["Missing name"];
    if (!date || !date.start || !date.end) return ["Missing or invalid date"];
    if (!raffleConfig) return ["Missing raffleConfig"];
    if (!raffleConfig.totalTickets) return ["Missing totalTickets"];
    if (!raffleConfig.perTicket) return ["Missing perTicket"];

    return [undefined, new CreateProjectDto(name, date, raffleConfig, state)];
  }
}
