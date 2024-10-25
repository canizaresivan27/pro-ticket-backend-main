import { CloudinaryAdapter } from "../../config";
import { HistoryModel, ProjectModel, TicketModel } from "../../data";
import {
  CreateProjectDto,
  CustomError,
  DeleteProjectDto,
  GetProjectByIdDto,
  PaginationDto,
  UpdateProjectDto,
  UpdateProjectMembersDto,
} from "../../domain";

export class ProjectServices {
  //DI
  constructor() {}

  async createProject(createProjectDto: CreateProjectDto, file: any) {
    let imgUrl = "";

    const projectExist = await ProjectModel.findOne({
      name: createProjectDto.name,
    });
    if (projectExist) throw CustomError.badRequest("La rifa ya existe");

    try {
      if (file) {
        const result = await CloudinaryAdapter.uploader.upload(file.path, {
          folder: "projects",
          /*
          use_filename: true,
          unique_filename: false,
          overwrite: true,
          */
        });
        imgUrl = result.secure_url;
      }

      const project = new ProjectModel({
        ...createProjectDto,
        raffleConfig: {
          ...createProjectDto.raffleConfig,
          img: imgUrl,
        },
      });

      console.log(imgUrl, "imageUrl");

      await project.save();

      return project;
    } catch (error) {
      console.log({ error });
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async getProjects(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [total, projects] = await Promise.all([
        ProjectModel.countDocuments(),
        ProjectModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("owner"),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/projects?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0 ? `/api/projects?page=${page - 1}&limit=${limit}` : null,

        projects: projects.map((project) => ({
          id: project.id,
          name: project.name,
          image: project.raffleConfig.img,
          priceTicket: project.raffleConfig.priceTicket,
          totalTickets: project.raffleConfig.totalTickets,
          state: project.state,
          owner: project.owner,
        })),
      };
    } catch (error) {
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async getRelatedTickets(projectId: string, paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [total, tickets] = await Promise.all([
        TicketModel.countDocuments({ project: projectId }),
        TicketModel.find({ project: projectId })
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("seller"),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/projects/${projectId}/tickets?page=${
          page + 1
        }&limit=${limit}`,
        prev:
          page - 1 > 0
            ? `/api/projects/${projectId}/tickets?page=${
                page - 1
              }&limit=${limit}`
            : null,

        tickets: tickets,
      };
    } catch (error) {
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async getRelatedProjects(projectId: string, paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [total, projects] = await Promise.all([
        ProjectModel.countDocuments({ owner: projectId }),
        ProjectModel.find({ owner: projectId })
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("owner"),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/projects/related/${projectId}?page=${
          page + 1
        }&limit=${limit}`,
        prev:
          page - 1 > 0
            ? `/api/projects/related/${projectId}?page=${
                page - 1
              }&limit=${limit}`
            : null,
        projects: projects.map((project) => ({
          id: project.id,
          name: project.name,
          image: project.raffleConfig.img,
          priceTicket: project.raffleConfig.priceTicket,
          totalTickets: project.raffleConfig.totalTickets,
          state: project.state,
          owner: project.owner,
        })),
      };
    } catch (error) {
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  // realted reseller projects
  async getRelatedProjectsReseller(
    resellerId: string,
    paginationDto: PaginationDto
  ) {
    const { page, limit } = paginationDto;

    try {
      const [total, projects] = await Promise.all([
        ProjectModel.countDocuments({ members: { $in: [resellerId] } }),
        ProjectModel.find({ members: { $in: [resellerId] } })
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("owner", "id name email"),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/projects/related/reseller/${resellerId}?page=${
          page + 1
        }&limit=${limit}`,
        prev:
          page - 1 > 0
            ? `/api/projects/related/reseller/${resellerId}?page=${
                page - 1
              }&limit=${limit}`
            : null,
        projects: projects.map((project) => ({
          id: project.id,
          name: project.name,
          image: project.raffleConfig.img,
          priceTicket: project.raffleConfig.priceTicket,
          totalTickets: project.raffleConfig.totalTickets,
          state: project.state,
          owner: project.owner,
          members: project.members.length,
        })),
      };
    } catch (error) {
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async getProjectById(getProjectByIdDto: GetProjectByIdDto) {
    const projectExist = await ProjectModel.findById(getProjectByIdDto.id);
    if (!projectExist) throw CustomError.badRequest("Project not exists");

    try {
      const project = await ProjectModel.findById(getProjectByIdDto.id)
        .populate("owner")
        .populate("members", "id name state");
      return project;
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async getProjectStatus(getProjectByIdDto: GetProjectByIdDto) {
    const projectExist = await ProjectModel.findById(getProjectByIdDto.id);
    if (!projectExist) throw CustomError.badRequest("Project not exists");

    try {
      const project = await ProjectModel.findById(getProjectByIdDto.id);
      const totalTickets = project?.raffleConfig.totalTickets || 1;
      const perTicket = project?.raffleConfig.perTicket || 1;

      const numberTickets = Math.floor(totalTickets / perTicket);

      // Obtener todos los tickets del proyecto en una sola consulta
      const tickets = await TicketModel.find({
        project: getProjectByIdDto.id,
      }).lean();

      // Crear un mapa para acceder rápidamente a los tickets por número
      const ticketMap = new Map(
        tickets.map((ticket) => [ticket.number, ticket])
      );

      const projectStatusArray = [];

      for (let i = 0; i < totalTickets; i += perTicket) {
        let numberRange = "";

        for (let j = 0; j < perTicket; j++) {
          if (i + j < totalTickets) {
            numberRange += (i + j + 1).toString();

            if (j < perTicket - 1 && i + j + 1 < totalTickets) {
              numberRange += "-";
            }
          }
        }

        // Obtener el ticket correspondiente desde el mapa
        const existingTicket = ticketMap.get(numberRange);

        if (existingTicket) {
          projectStatusArray.push({
            number: numberRange,
            status: existingTicket.state,
            ticket: existingTicket._id,
            ownerData: existingTicket.ownerData,
          });
        } else {
          projectStatusArray.push({
            number: numberRange,
            status: "AVAILABLE",
            ticket: null,
            ownerData: null,
          });
        }
      }

      let pending = projectStatusArray.filter(
        (ticket) => ticket.status === "UNPAID"
      ).length;

      let reserved = projectStatusArray.filter(
        (ticket) => ticket.status === "RESERVED"
      ).length;

      let sold = projectStatusArray.filter(
        (ticket) => ticket.status === "PAID"
      ).length;

      let goal = (project?.raffleConfig.priceTicket || 0) * numberTickets;
      let collected =
        projectStatusArray.filter((ticket) => ticket.status === "PAID").length *
        (project?.raffleConfig.priceTicket || 0);

      return {
        sold,
        reserved,
        pending,
        goal,
        collected,
        grid: projectStatusArray,
      };
    } catch (error) {
      console.log({ error });
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  updateProject = async (
    updateProjectDto: UpdateProjectDto,
    newImageFile?: any
  ) => {
    const nameConflict = await ProjectModel.findOne({
      name: updateProjectDto.name,
      _id: { $ne: updateProjectDto.id }, // Exclude the current project
    });
    if (nameConflict)
      throw CustomError.badRequest("Project name already exists");

    const projectExist = await ProjectModel.findById(updateProjectDto.id);
    if (!projectExist) throw CustomError.badRequest("Project not found");

    try {
      // delete previous image from cloudinary
      const existingImageUrl = projectExist.raffleConfig.img;
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
            folder: "projects",
          }
        );
        newImageUrl = uploadResult.secure_url;
        console.log(`Nueva imagen subida: ${newImageUrl}`);
      }

      const updatedProject = await ProjectModel.findByIdAndUpdate(
        updateProjectDto.id,
        {
          name: updateProjectDto.name,
          date: updateProjectDto.date,
          raffleConfig: {
            ...updateProjectDto.raffleConfig,
            img: newImageUrl,
          },
          owner: updateProjectDto.owner,
          state: updateProjectDto.state,
        },
        { new: true }
      ).populate("owner");

      return updatedProject;
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  };

  // update project members
  updateProjectMembers = async (updateProjectDto: UpdateProjectMembersDto) => {
    const projectExist = await ProjectModel.findById(updateProjectDto.id);
    if (!projectExist) throw CustomError.badRequest("Project not found");

    try {
      const updatedProject = await ProjectModel.findByIdAndUpdate(
        updateProjectDto.id,
        {
          members: updateProjectDto.members,
        },
        { new: true }
      ).populate("owner");

      return updatedProject;
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  };

  deleteProject = async (deleteProjectDto: DeleteProjectDto) => {
    const projectExist = await ProjectModel.findById(deleteProjectDto.id);
    if (!projectExist) throw CustomError.badRequest("Project not found");

    try {
      // extract public_id from imageUrl & delete image from cloudinary
      const imageUrl = projectExist.raffleConfig.img;
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

      const tickets = await TicketModel.find({ project: deleteProjectDto.id });
      // Delete all history associated with tickets
      for (const ticket of tickets) {
        const deleteHistoryResult = await HistoryModel.deleteMany({
          ticket: ticket._id,
        });
        //console.log(  `Historias eliminadas para ticket ${ticket._id}: ${deleteHistoryResult.deletedCount}`);
      }
      // Delete all tickets associated with the project
      const deleteTicketsResult = await TicketModel.deleteMany({
        project: deleteProjectDto.id,
      });
      //console.log(`Tickets eliminados: ${deleteTicketsResult.deletedCount}`);

      await ProjectModel.findByIdAndDelete(deleteProjectDto.id);
      return { message: "Project deleted successfully" };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  };
}
