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
      throw CustomError.internalServer(`Internal Error`);
    }
  }
}
