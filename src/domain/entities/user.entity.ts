import { CustomError } from "../errors/custom.error";

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public emailValidated: boolean,
    public password: string,
    public role: string[],
    public state: string[],
    public img?: string
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, _id, name, email, emailValidated, password, role, state, img } =
      object;

    if (!_id && !id) {
      throw CustomError.badRequest("Missing id");
    }

    if (!name) throw CustomError.badRequest("Missing name");
    if (!email) throw CustomError.badRequest("Missing name");
    if (!emailValidated === undefined)
      throw CustomError.badRequest("Missing emailValidated");
    if (!password) throw CustomError.badRequest("Missing password");
    if (!role) throw CustomError.badRequest("Missing role");
    if (!state) throw CustomError.badRequest("Missing  state");

    return new UserEntity(
      _id || id,
      name,
      email,
      emailValidated,
      password,
      role,
      state,
      img
    );
  }
}
