import { encryptAdapter, JwtAdapter } from "../../config";
import { HistoryModel, ProjectModel, TicketModel, UserModel } from "../../data";
import {
  CreateUserDto,
  CustomError,
  GetUserDto,
  PaginationDto,
  UserEntity,
} from "../../domain";

export class UserServices {
  //DI
  constructor() {}

  async createUser(createUserDto: CreateUserDto) {
    const existUser = await UserModel.findOne({ email: createUserDto.email });
    if (existUser) throw CustomError.badRequest("Email already exist");

    try {
      const user = new UserModel(createUserDto);

      // encrypt password
      user.password = encryptAdapter.hash(createUserDto.password);
      await user.save();

      // JWT <--- maintain user authentication
      const token = await JwtAdapter.generateToken({ id: user.id });
      if (!token) throw CustomError.internalServer("Error while creating JWT");

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return { user: userEntity, token: token };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async getUser(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [total, users] = await Promise.all([
        UserModel.countDocuments(),
        UserModel.find()
          .skip((page - 1) * limit)
          .limit(limit),
        //.populate(""),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/projects?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0 ? `/api/projects?page=${page - 1}&limit=${limit}` : null,

        users: users,
      };
    } catch (error) {
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async userById(getUserDto: GetUserDto) {
    const userExist = await UserModel.findById(getUserDto.id);
    if (!userExist) throw CustomError.notFound("User not found");

    try {
      const user = await UserModel.findById(getUserDto.id);
      return user;
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async updateUser() {
    try {
      return { message: "update user" };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async deleteUser(getUserDto: GetUserDto) {
    const userExist = await UserModel.findById(getUserDto.id);
    if (!userExist) throw CustomError.notFound("User not found");

    try {
      // Obtener todos los proyectos del usuario
      const projects = await ProjectModel.find({ owner: getUserDto.id });

      for (const project of projects) {
        const tickets = await TicketModel.find({ project: project._id });

        // Delete all history associated with tickets
        for (const ticket of tickets) {
          const deleteHistoryResult = await HistoryModel.deleteMany({
            ticket: ticket._id,
          });
          console.log(
            `Historias eliminadas para ticket ${ticket._id}: ${deleteHistoryResult.deletedCount}`
          );
        }

        // Delete all tickets associated with the project
        const deleteTicketsResult = await TicketModel.deleteMany({
          project: project._id,
        });
        console.log(
          `Tickets eliminados para proyecto ${project._id}: ${deleteTicketsResult.deletedCount}`
        );

        // Delete the project
        await ProjectModel.findByIdAndDelete(project._id);
        console.log(`Proyecto ${project._id} eliminado`);
      }

      // Delete the user
      await UserModel.findByIdAndDelete(getUserDto.id);
      return {
        message:
          "User and all associated projects, tickets, and history deleted successfully",
      };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }
}
