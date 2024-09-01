import { Validators } from "../../../config";

export class GetUserDto {
  private constructor(public readonly id: string) {}

  static create(object: { [key: string]: any }): [string?, GetUserDto?] {
    const { id } = object;

    if (!id) return ["Missing Id"];
    if (!Validators.isMongoID(id)) return ["Invalid Id"];

    return [undefined, new GetUserDto(id)];
  }
}
