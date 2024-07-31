import { ProjectModel } from "../../data";
import {
  CreateProjectDto,
  CustomError,
  DeleteProjectDto,
  GetProjectByIdDto,
  PaginationDto,
  UpdateProjectDto,
  UserEntity,
} from "../../domain";

export class ProjectServices {
  //DI
  constructor() {}

  async createProject(createProjectDto: CreateProjectDto) {
    const projectExist = await ProjectModel.findOne({
      name: createProjectDto.name,
    });
    if (projectExist) throw CustomError.badRequest("Project already exists");

    try {
      const project = new ProjectModel({
        ...createProjectDto,
      });

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
          totalTickets: project.raffleConfig.totalTickets,
          state: project.state,
          owner: project.owner,
        })),
      };
    } catch (error) {
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async getProjectById(getProjectByIdDto: GetProjectByIdDto) {
    try {
      const project = await ProjectModel.findById(
        getProjectByIdDto.projectId
      ).populate("owner");

      if (!project) throw CustomError.badRequest("Project not exists");

      return { project };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  updateProject = async (updateProjectDto: UpdateProjectDto) => {
    const nameConflict = await ProjectModel.findOne({
      name: updateProjectDto.name,
      _id: { $ne: updateProjectDto.id }, // Exclude the current project
    });
    if (nameConflict)
      throw CustomError.badRequest("Project name already exists");

    const projectExist = await ProjectModel.findById(updateProjectDto.id);
    if (!projectExist) throw CustomError.badRequest("Project not found");

    try {
      const updateFields: any = {};

      if (updateProjectDto.name !== undefined)
        updateFields.name = updateProjectDto.name;
      if (updateProjectDto.date !== undefined)
        updateFields.date = updateProjectDto.date;
      if (updateProjectDto.raffleConfig !== undefined) {
        updateFields.raffleConfig = {
          ...projectExist.raffleConfig, // Keep existing fields
          ...updateProjectDto.raffleConfig, // Overwrite only the fields provided
        };
      }
      if (updateProjectDto.state !== undefined)
        updateFields.state = updateProjectDto.state;

      const updatedProject = await ProjectModel.findByIdAndUpdate(
        updateProjectDto.id,
        updateFields,
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
      await ProjectModel.findByIdAndDelete(deleteProjectDto.id);
      return { message: "Project deleted successfully" };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  };
}
