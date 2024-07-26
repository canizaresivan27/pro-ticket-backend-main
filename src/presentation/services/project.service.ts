import { ProjectModel } from "../../data";
import { CreateProjectDto, CustomError, UserEntity } from "../../domain";

export class ProjectServices {
  //DI
  constructor() {}

  async createProject(createProjectDto: CreateProjectDto, user: UserEntity) {
    const projectExist = await ProjectModel.findOne({
      name: createProjectDto.name,
    });
    if (projectExist) throw CustomError.badRequest("Project already exists");

    try {
      const project = new ProjectModel({
        ...createProjectDto,
        user: user.id,
      });

      await project.save();

      return {
        id: project.id,
        name: project.name,
        state: project.state,
        config: project.raffleConfig,
      };
    } catch (error) {
      console.log({ error });
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async getProjects() {
    try {
      const projects = await ProjectModel.find();

      return projects.map((project) => ({
        id: project.id,
        name: project.name,
        totalTickets: project.raffleConfig.totalTickets,
        state: project.state,
      }));
    } catch (error) {
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async getProjectById(body: any) {
    try {
      const project = await ProjectModel.findById(body.id);
      if (!project) throw CustomError.badRequest("Project not exists");

      return { project };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }
}
