import { Validators } from "../../../config";

export class UpdateProjectDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly date: { start: Date; end: Date },
    public readonly raffleConfig: {
      img?: string;
      qrPosition: string;
      numberPosition: string;
    },
    public readonly owner: string, // ID
    public readonly state: string = "ACTIVE" //public readonly owner: string
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdateProjectDto?] {
    const { id, name, date, raffleConfig, owner, state } = object;

    if (!name) return ["Missing name"];
    if (!date || !date.start || !date.end) return ["Missing or invalid date"];
    if (!raffleConfig) return ["Missing raffleConfig"];
    if (!id) return ["Missing project Id"];
    if (!Validators.isMongoID(id)) return ["Invalid project Id"];
    if (!owner) return ["Missing owner Id"];
    if (!Validators.isMongoID(owner)) return ["Invalid owner Id"];

    return [
      undefined,
      new UpdateProjectDto(id, name, date, raffleConfig, owner, state),
    ];
  }
}
