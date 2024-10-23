import { encryptAdapter, JwtAdapter, CloudinaryAdapter } from "../../config";
import { HistoryModel, ProjectModel, TicketModel, UserModel } from "../../data";
import {
  CreateResellerDto,
  CreateUserDto,
  CustomError,
  GetUserDto,
  PaginationDto,
  UpdateUserDto,
  UserEntity,
} from "../../domain";
import { Document, Types } from "mongoose";

export class UserServices {
  //DI
  constructor() {}

  async createUser(createUserDto: CreateUserDto, file: any) {
    let imgUrl = "";
    const existUser = await UserModel.findOne({ email: createUserDto.email });
    if (existUser) throw CustomError.badRequest("Email already exist");

    try {
      if (file) {
        const result = await CloudinaryAdapter.uploader.upload(file.path, {
          folder: "users",
        });
        imgUrl = result.secure_url;
      }

      let newUser = {
        ...createUserDto,
        img: imgUrl,
        role: ["USER_ROLE"],
      };

      const user = new UserModel(newUser);

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

  async createReseller(createResellerDto: CreateResellerDto, file: any) {
    let imgUrl = "";
    const existUser = await UserModel.findOne({
      email: createResellerDto.email,
    });
    if (existUser) throw CustomError.badRequest("Email already exist");

    try {
      if (file) {
        const result = await CloudinaryAdapter.uploader.upload(file.path, {
          folder: "users",
          use_filename: true,
          unique_filename: false,
          overwrite: true,
        });
        imgUrl = result.secure_url;
      }

      let newUser = {
        ...createResellerDto,
        img: imgUrl,
        role: ["RESELLER_ROLE"],
      };

      const user = new UserModel(newUser);
      // encrypt password
      user.password = encryptAdapter.hash(createResellerDto.password);
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

  async getRelatedUsers(getUserDto: GetUserDto, paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const userExist = await UserModel.findById(getUserDto.id);
    if (!userExist) throw CustomError.notFound("User not found");

    try {
      const [total, users] = await Promise.all([
        UserModel.countDocuments({ creatorId: getUserDto.id }),
        UserModel.find({ creatorId: getUserDto.id })
          .skip((page - 1) * limit)
          .limit(limit),
        //.populate("seller")
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/users/related/${getUserDto.id}?page=${
          page + 1
        }&limit=${limit}`,
        prev:
          page - 1 > 0
            ? `/api/users/related/${getUserDto.id}?page=${
                page - 1
              }&limit=${limit}`
            : null,

        users,
      };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, newImageFile?: any) {
    const userExist = await UserModel.findById(updateUserDto.id);
    if (!userExist) throw CustomError.notFound("User not found");

    try {
      // delete previous image from cloudinary
      const existingImageUrl = userExist.img;
      if (existingImageUrl && newImageFile) {
        const regex = /\/upload\/(?:v\d+\/)?(.+)\.\w+$/;
        const match = existingImageUrl.match(regex);
        const publicId = match ? match[1] : null;

        if (publicId) {
          await CloudinaryAdapter.uploader.destroy(publicId);
          console.log(`Imagen anterior eliminada: ${publicId}`);
        }
      }

      // upload new image to cloudinary
      let newImageUrl = existingImageUrl;
      if (newImageFile) {
        const uploadResult = await CloudinaryAdapter.uploader.upload(
          newImageFile.path,
          {
            folder: "users",
          }
        );
        newImageUrl = uploadResult.secure_url;
        console.log(`Nueva imagen subida: ${newImageUrl}`);
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        updateUserDto.id,
        {
          name: updateUserDto.name,
          phone: updateUserDto.phone,
          img: newImageUrl,
          state: updateUserDto.state,
        },
        { new: true }
      );

      if (!updatedUser) throw CustomError.internalServer("Error updating user");

      return { message: "User updated successfully", user: updatedUser };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async deleteUser(getUserDto: GetUserDto) {
    const userExist = await UserModel.findById(getUserDto.id);
    if (!userExist) throw CustomError.notFound("User not found");

    try {
      // extract public_id from imageUrl & delete image from cloudinary
      const imageUrl = userExist.img;
      if (imageUrl) {
        const regex = /\/upload\/(?:v\d+\/)?(.+)\.\w+$/;
        const match = imageUrl.match(regex);

        const publicId = match ? match[1] : null;

        if (publicId) {
          const result = await CloudinaryAdapter.uploader.destroy(publicId);
          //console.log(`Imagen eliminada de Cloudinary: ${result.result}`);
        } else {
          console.log("No se pudo obtener el public_id de la imagen.");
        }
      }

      const resellers = await UserModel.deleteMany({
        creatorId: getUserDto.id,
        role: "RESELLER_ROLE",
      });
      console.log(`Usuarios reseller eliminados: ${resellers.deletedCount}`);

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

  async deleteReseller(getUserDto: GetUserDto) {
    const userExist = await UserModel.findById(getUserDto.id);
    if (!userExist) throw CustomError.notFound("User not found");
    if (!userExist.role.includes("RESELLER_ROLE"))
      throw CustomError.badRequest("User is not a reseller");

    try {
      // extract public_id from imageUrl & delete image from cloudinary
      const imageUrl = userExist.img;
      if (imageUrl) {
        const regex = /\/upload\/(?:v\d+\/)?(.+)\.\w+$/;
        const match = imageUrl.match(regex);

        const publicId = match ? match[1] : null;

        if (publicId) {
          const result = await CloudinaryAdapter.uploader.destroy(publicId);
          //console.log(`Imagen eliminada de Cloudinary: ${result.result}`);
        } else {
          console.log("No se pudo obtener el public_id de la imagen.");
        }
      }

      // Remove reseller ID from all associated projects
      await ProjectModel.updateMany(
        { members: getUserDto.id },
        { $pull: { members: getUserDto.id } }
      );

      // Find all tickets where the seller is the reseller
      const relatedTickets = await TicketModel.find({
        seller: getUserDto.id,
      }).populate("project");
      for (const ticket of relatedTickets) {
        const projectOwner = (ticket.project as any)?.owner;
        if (projectOwner) {
          await TicketModel.findByIdAndUpdate(ticket._id, {
            seller: projectOwner,
          });
          console.log(`Ticket owner ${ticket._id} updated`);
        } else {
          throw CustomError.notFound(
            `Ticket or project owner not found for ticket ${ticket._id}`
          );
        }
      }

      // Find all histories where the seller is the reseller
      const relatedHistory = await HistoryModel.find({
        seller: getUserDto.id,
      }).populate("ticket");
      for (const history of relatedHistory) {
        const ticketOwner = (history.ticket as any)?.seller;
        if (ticketOwner) {
          await HistoryModel.findByIdAndUpdate(history._id, {
            seller: ticketOwner,
          });
          console.log(`History owner ${history._id} updated`);
        } else {
          throw CustomError.notFound(
            `History or project owner not found for history ${history._id}`
          );
        }
      }

      // Delete the reseller user
      await UserModel.findByIdAndDelete(getUserDto.id);

      return {
        message: "Reseller deleted successfully",
      };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }
}
