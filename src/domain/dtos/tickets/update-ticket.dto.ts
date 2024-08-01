import { Validators } from "../../../config";

export class UpdateTicketDto {
  private constructor(
    public readonly id: string,
    public readonly ownerData: Record<string, any>,
    public readonly state: "PAID" | "UNPAID" | "CANCELLED"
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdateTicketDto?] {
    const { id, ownerData, state } = object;

    if (!id) return ["Missing Ticket Id"];
    if (!Validators.isMongoID(id)) return ["Invalid ticket Id"];
    if (!ownerData) return ["Missing ownerData"];

    return [undefined, new UpdateTicketDto(id, ownerData, state)];
  }
}
