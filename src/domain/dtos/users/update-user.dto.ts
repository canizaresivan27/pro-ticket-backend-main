import { regularExps, Validators } from "../../../config";

export class UpdateUserDto {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly phone: string,
    public readonly img: string,
    public readonly state: string[]
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdateUserDto?] {
    const { id, name, phone, img, state } = object;

    if (!id) return ["Missing user id"];
    if (!Validators.isMongoID(id)) return ["Invalid User Id"];
    if (!name) return ["Missing name"];
    if (!phone) return ["Missing email"];

    return [undefined, new UpdateUserDto(id, name, phone, img, state)];
  }
}
