import { Validators } from "../../../config";

export class ByIdUserDto {
  private constructor(public readonly id: string) {}

  static create(object: { [key: string]: any }): [string?, ByIdUserDto?] {
    const { id } = object;

    if (!id) return ["Missing  id"];
    if (!Validators.isMongoID(id)) return ["Invalid  Id"];

    return [undefined, new ByIdUserDto(id)];
  }
}
