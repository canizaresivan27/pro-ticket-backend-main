import { Request, Response } from "express";
import {
  CreateProjectDto,
  CustomError,
  DeleteProjectDto,
  GetProjectByIdDto,
  PaginationDto,
  UpdateProjectDto,
} from "../../domain";
import { ProjectServices } from "../services";

export class ProjectController {
  // DI
  constructor(private readonly projectServices: ProjectServices) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: "Internal server error" });
  };

  createProject = async (req: Request, res: Response) => {
    const [error, createProjectDto] = CreateProjectDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.projectServices
      .createProject(createProjectDto!)
      .then((project) => res.status(201).json(project))
      .catch((error) => this.handleError(error, res));
  };

  getProject = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.projectServices
      .getProjects(paginationDto!)
      .then((projects) => res.status(201).json(projects))
      .catch((error) => this.handleError(error, res));
  };

  getRelatedProjects = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    const projectId = req.params.id;
    if (!projectId)
      return res.status(400).json({ error: "Project ID is required" });

    this.projectServices
      .getRelatedProjects(projectId, paginationDto!)
      .then((relatedTickets) => res.status(200).json(relatedTickets))
      .catch((error) => this.handleError(error, res));
  };

  getRelatedTickets = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    const projectId = req.params.id;
    if (!projectId)
      return res.status(400).json({ error: "Project ID is required" });

    this.projectServices
      .getRelatedTickets(projectId, paginationDto!)
      .then((relatedTickets) => res.status(200).json(relatedTickets))
      .catch((error) => this.handleError(error, res));
  };

  getProjectById = async (req: Request, res: Response) => {
    const projectId = req.params.id;
    if (!projectId)
      return res.status(400).json({ error: "Project ID is required" });

    const [error, getProjectByIdDto] = GetProjectByIdDto.create({
      id: projectId,
    });
    if (error) return res.status(400).json({ error });

    this.projectServices
      .getProjectById(getProjectByIdDto!)
      .then((project) => res.status(200).json(project))
      .catch((error) => this.handleError(error, res));
  };

  getProjectStatus = async (req: Request, res: Response) => {
    const projectId = req.params.id;
    if (!projectId)
      return res.status(400).json({ error: "Project ID is required" });

    const [error, getProjectByIdDto] = GetProjectByIdDto.create({
      id: projectId,
    });
    if (error) return res.status(400).json({ error });

    this.projectServices
      .getProjectStatus(getProjectByIdDto!)
      .then((status) => res.status(200).json(status))
      .catch((error) => this.handleError(error, res));
  };

  updateProject = async (req: Request, res: Response) => {
    const [error, updateProjectDto] = UpdateProjectDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.projectServices
      .updateProject(updateProjectDto!)
      .then((project) => res.status(201).json(project))
      .catch((error) => this.handleError(error, res));
  };

  deleteProject = async (req: Request, res: Response) => {
    const [error, deleteProjectDto] = DeleteProjectDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.projectServices
      .deleteProject(deleteProjectDto!)
      .then((project) => res.status(201).json(project))
      .catch((error) => this.handleError(error, res));
  };
}
