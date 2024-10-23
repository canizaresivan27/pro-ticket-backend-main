import { Validators } from "../../../config";

export class CreateProjectDto {
  private constructor(
    public readonly name: string,
    public readonly date: { start: Date; end: Date },
    public readonly raffleConfig: {
      img?: any;
      priceTicket: number;
      totalTickets: number;
      perTicket: number;
      qrPosition: string;
      numberPosition: string;
      orientation: string;
    },
    public readonly owner: string, // ID
    public readonly state: string = "ACTIVE" //public readonly owner: string
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateProjectDto?] {
    const { name, date, raffleConfig, owner, state } = object;

    if (!name) return ["Missing name"];
    if (!date || !date.start || !date.end) return ["Missing or invalid date"];
    if (!raffleConfig) return ["Missing raffleConfig"];
    if (!raffleConfig.totalTickets) return ["Missing totalTickets"];
    if (!raffleConfig.perTicket) return ["Missing perTicket"];
    if (!owner) return ["Missing owner"];
    if (!Validators.isMongoID(owner)) return ["Invalid owner Id"];

    return [
      undefined,
      new CreateProjectDto(name, date, raffleConfig, owner, state),
    ];
  }
}
