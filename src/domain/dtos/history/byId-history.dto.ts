import { Validators } from "../../../config";

export class ByIdHistoryDto {
  private constructor(public readonly id: string) {}

  static create(object: { [key: string]: any }): [string?, ByIdHistoryDto?] {
    const { id } = object;

    if (!id) return ["Missing  id"];
    if (!Validators.isMongoID(id)) return ["Invalid  Id"];

    return [undefined, new ByIdHistoryDto(id)];
  }
}
