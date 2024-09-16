import { regularExps } from "../../../config";

export class LoginUserDto {
  private constructor(public email: string, public password: string) {}
  
  static create(object: { [key: string]: any }): [string?, LoginUserDto?] {
    const { email, password } = object;

    if (!email) return ["Correo es requerido!"];
    if (!regularExps.email.test(email)) return ["Correo no valido!"];
    if (!password) return ["Contraseña es requerida!"];
    if (password.length < 7) return ["Contraseña demasiado corta!"];
    if (password.length > 50) return ["Contraseña demasiado larga!"];
  
    return [undefined, new LoginUserDto(email, password)];
  }
}
