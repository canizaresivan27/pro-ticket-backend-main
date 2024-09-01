import { regularExps, Validators } from "../../../config";

export class CreateResellerDto {
  private constructor(
    public name: string,
    public email: string,
    public password: string,
    public creatorId: string
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateResellerDto?] {
    const { name, email, password, creatorId } = object;

    if (!name) return ["Missing name"];
    if (!email) return ["Missing email"];
    if (!regularExps.email.test(email)) return ["Email is not valid"];
    if (!password) return ["Missing password"];
    if (password.length < 7) return ["Password too short"];
    if (!creatorId) return ["Missing creatorId"];
    if (!Validators.isMongoID(creatorId)) return ["Invalid User Id"];

    return [undefined, new CreateResellerDto(name, email, password, creatorId)];
  }
}
