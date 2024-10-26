import { regularExps, Validators } from "../../../config";

export class CreateUserDto {
  private constructor(
    public name: string,
    public email: string,
    public phone: string,
    public password: string,
    public img: string,
    public creatorId: string
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateUserDto?] {
    const { name, email, phone, password, img, creatorId } = object;

    if (!name) return ["Missing name"];
    if (!email) return ["Missing email"];
    if (!phone) return ["Missing email"];
    if (!regularExps.email.test(email)) return ["Email is not valid"];
    if (!password) return ["Missing password"];
    if (password.length < 7) return ["Password too short"];
    if (!creatorId) return ["Missing creatorId"];
    if (!Validators.isMongoID(creatorId)) return ["Invalid User Id"];

    return [
      undefined,
      new CreateUserDto(name, email, phone, password, img, creatorId),
    ];
  }
}
