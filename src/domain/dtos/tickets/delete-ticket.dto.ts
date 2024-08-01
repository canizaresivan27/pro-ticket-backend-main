import { Validators } from "../../../config";

export class DeleteTicketDto {
  private constructor(public readonly id: string) {}

  static create(object: { [key: string]: any }): [string?, DeleteTicketDto?] {
    const { id } = object;

    if (!id) return ["Missing Ticket Id"];
    if (!Validators.isMongoID(id)) return ["Invalid ticket Id"];

    return [undefined, new DeleteTicketDto(id)];
  }
}
