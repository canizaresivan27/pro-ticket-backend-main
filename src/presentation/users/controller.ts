import { Request, Response } from "express";
import {
  CreateResellerDto,
  CreateUserDto,
  CustomError,
  GetUserDto,
  PaginationDto,
  UpdateUserDto,
} from "../../domain";
import { UserServices } from "../services";
import { get } from "http";

export class UserController {
  // DI
  constructor(private readonly userServices: UserServices) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: "Internal server error" });
  };

  createUser = async (req: Request, res: Response) => {
    const { image, ...projectData } = req.body;
    const [error, createUserDto] = CreateUserDto.create(projectData);
    if (error) return res.status(400).json({ error });

    this.userServices
      .createUser(createUserDto!, req.file)
      .then((user) => res.status(201).json(user))
      .catch((error) => this.handleError(error, res));
  };

  createReseller = async (req: Request, res: Response) => {
    const { image, ...projectData } = req.body;
    const [error, createResellerDto] = CreateResellerDto.create(projectData);
    if (error) return res.status(400).json({ error });

    this.userServices
      .createReseller(createResellerDto!, req.file)
      .then((user) => res.status(201).json(user))
      .catch((error) => this.handleError(error, res));
  };

  getUser = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.userServices
      .getUser(paginationDto!)
      .then((projects) => res.status(201).json(projects))
      .catch((error) => this.handleError(error, res));
  };

  userById = async (req: Request, res: Response) => {
    const userId = req.params.id;
    if (!userId) res.status(400).json({ error: "Ticket ID is required" });

    const [error, getUserDto] = GetUserDto.create({ id: userId });
    if (error) return res.status(400).json({ error });

    this.userServices
      .userById(getUserDto!)
      .then((user) => res.status(201).json(user))
      .catch((error) => this.handleError(error, res));
  };

  getRelatedUsers = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    const userId = req.params.id;
    if (!userId) res.status(400).json({ error: "Ticket ID is required" });

    const [errorID, getUserDto] = GetUserDto.create({ id: userId });
    if (errorID) return res.status(400).json({ error });

    this.userServices
      .getRelatedUsers(getUserDto!, paginationDto!)
      .then((user) => res.status(201).json(user))
      .catch((error) => this.handleError(error, res));
  };

  updateUser = async (req: Request, res: Response) => {
    const { image, ...projectData } = req.body;
    const [error, updateUserDto] = UpdateUserDto.create(projectData);
    if (error) return res.status(400).json({ error });

    this.userServices
      .updateUser(updateUserDto!, req.file)
      .then((user) => res.status(201).json(user))
      .catch((error) => this.handleError(error, res));
  };

  deleteUser = async (req: Request, res: Response) => {
    const [error, getUserDto] = GetUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.userServices
      .deleteUser(getUserDto!)
      .then((user) => res.status(201).json(user))
      .catch((error) => this.handleError(error, res));
  };

  deleteReseller = async (req: Request, res: Response) => {
    const [error, getUserDto] = GetUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.userServices
      .deleteReseller(getUserDto!)
      .then((user) => res.status(201).json(user))
      .catch((error) => this.handleError(error, res));
  };
}
