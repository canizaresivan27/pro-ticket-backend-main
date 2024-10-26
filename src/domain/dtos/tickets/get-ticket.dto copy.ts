import { Validators } from "../../../config";

export class GetTicketDto {
  private constructor(public readonly id: string) {}

  static create(object: { [key: string]: any }): [string?, GetTicketDto?] {
    const { id } = object;

    if (!id) return ["Missing Id"];
    if (!Validators.isMongoID(id)) return ["Invalid Id"];

    return [undefined, new GetTicketDto(id)];
  }
}
