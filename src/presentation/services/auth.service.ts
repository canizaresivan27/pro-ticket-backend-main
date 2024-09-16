import { encryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from "../../domain";
import { EmailService } from "./email.service";

export class AuthServices {
  constructor(private readonly emailServices: EmailService) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest("Email already exist");

    try {
      const user = new UserModel(registerUserDto);

      // encrypt password
      user.password = encryptAdapter.hash(registerUserDto.password);
      await user.save();

      // JWT <--- maintain user authentication
      const token = await JwtAdapter.generateToken({ id: user.id });
      if (!token) throw CustomError.internalServer("Error while creating JWT");

      // confirmation email
      await this.sendEmailValidationLink(user.email);

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return { user: userEntity, token: token };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) {
      throw CustomError.badRequest("El correo electrónico o la contraseña no son correctos");
    }

    if (user.state.includes("SUSPENDED")) {
      throw CustomError.badRequest("La cuenta de usuario está suspendida");
    }
    if (user.state.includes("DISABLED")) {
      throw CustomError.badRequest("La cuenta de usuario está deshabilitada");
    }

    const isMatching = await encryptAdapter.compare(
      loginUserDto.password,
      user.password
    );
    if (!isMatching) {
      throw CustomError.badRequest("La contraseña no es válida");
    }

    try {
      const { password, ...userEntity } = UserEntity.fromObject(user);
      const token = await JwtAdapter.generateToken({ id: user.id });
      if (!token) {
        throw CustomError.internalServer("Error while creating JWT");
      }
      return { user: userEntity, token: token };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  private sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });
    if (!token) throw CustomError.internalServer("Error getting token");
    
    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}">Validate your email: ${email}</a>
    `;

    const options = {
      to: email,
      subject: "Validate your Email - ProTicket",
      htmlBody: html,
    };
    const isSent = await this.emailServices.sendEmail(options);
    if (!isSent) throw CustomError.internalServer("Error sending email");
    return true;
  };

  public validateEmail = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.unauthorized("Invalid Token");

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer("Email not in token");

    const user = await UserModel.findOne({ email });
    if (!user) throw CustomError.internalServer("Email not exists");

    user.emailValidated = true;
    await user.save();

    return true;
  };
}
