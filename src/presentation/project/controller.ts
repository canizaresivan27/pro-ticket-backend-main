import { Request, Response } from "express";
import {
  CreateProjectDto,
  CustomError,
  DeleteProjectDto,
  GetProjectByIdDto,
  PaginationDto,
  UpdateProjectDto,
  UpdateProjectMembersDto,
} from "../../domain";
import { ProjectServices } from "../services";
import { getSocketAdapter, whatsapp } from "../../config";
import { Console } from "console";

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
    const { image, ...projectData } = req.body;
    const [error, createProjectDto] = CreateProjectDto.create(projectData);
    if (error) return res.status(400).json({ error });

    this.projectServices
      .createProject(createProjectDto!, req.file)
      .then((project) => res.status(201).json(project))
      .catch((error) => this.handleError(error, res));
  };

  getWhatsappStatus = async (req: Request, res: Response) => {
    const socketAdapter = getSocketAdapter();

    whatsapp
      .getState()
      .then((state) => {
        if (state === "CONNECTED") {
          res.json({ status: "connected", qr: "" });
        } else {
          // Si no está conectado, escucha el evento de QR
          whatsapp.on("qr", (qr) => {
            socketAdapter
              .getIO()
              .emit("whatsapp-qr", { status: "linkup", qr: qr });
            res.json({ status: "linkup", qr: qr });
          });
        }
      })
      .catch((err) => {
        console.error("Error getting WhatsApp state:", err);
        res.status(500).json({ error: "Error getting WhatsApp state" });
      });
  };

  disconnectWhatsappSession = async (req: Request, res: Response) => {
    const socketAdapter = getSocketAdapter();

    whatsapp
      .getState()
      .then((state) => {
        if (state === "CONNECTED") {
          // Desconectar la sesión
          whatsapp.logout().then(() => {
            socketAdapter
              .getIO()
              .emit("whatsapp-qr", { status: "disconnected", qr: "" });

            res.json({
              status: "disconnected",
              message: "WhatsApp session disconnected successfully",
            });
          });
        } else {
          res.status(400).json({
            status: "not_connected",
            message: "WhatsApp session is not connected",
          });
        }
      })
      .catch((err) => {
        console.error(
          "Error getting WhatsApp state or disconnecting session:",
          err
        );
        res.status(500).json({ error: "Error disconnecting WhatsApp session" });
      });
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

  // realted reseller projects
  getRelatedProjectsReseller = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    const projectId = req.params.id;
    if (!projectId)
      return res.status(400).json({ error: "Project ID is required" });

    this.projectServices
      .getRelatedProjectsReseller(projectId, paginationDto!)
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
      .then((status) => {
        res.status(200).json(status);
      })
      .catch((error) => this.handleError(error, res));
  };

  updateProject = async (req: Request, res: Response) => {
    const { image, ...projectData } = req.body;
    const [error, updateProjectDto] = UpdateProjectDto.create(projectData);
    if (error) return res.status(400).json({ error });

    this.projectServices
      .updateProject(updateProjectDto!, req.file)
      .then((project) => res.status(201).json(project))
      .catch((error) => this.handleError(error, res));
  };

  // update project members
  updateProjectMembers = async (req: Request, res: Response) => {
    const [error, updateProjectDto] = UpdateProjectMembersDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.projectServices
      .updateProjectMembers(updateProjectDto!)
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
