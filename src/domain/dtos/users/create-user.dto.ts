import { regularExps } from "../../../config";

export class CreateUserDto {
  private constructor(
    public name: string,
    public email: string,
    public phone: string,
    public password: string,
    public img: string,
    public role: string
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateUserDto?] {
    const { name, email, phone, password, img, role } = object;

    if (!name) return ["Missing name"];
    if (!email) return ["Missing email"];
    if (!phone) return ["Missing email"];
    if (!regularExps.email.test(email)) return ["Email is not valid"];
    if (!password) return ["Missing password"];
    if (password.length < 7) return ["Password too short"];
    if (!role) return ["Missing role"];

    return [
      undefined,
      new CreateUserDto(name, email, phone, password, img, role),
    ];
  }
}
