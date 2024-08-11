import { Request, Response } from "express";
import { CustomError, PaginationDto } from "../../domain";
import { UserServices } from "../services";

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
    this.userServices
      .createUser()
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
    this.userServices
      .userById()
      .then((user) => res.status(201).json(user))
      .catch((error) => this.handleError(error, res));
  };

  updateUser = async (req: Request, res: Response) => {
    this.userServices
      .updateUser()
      .then((user) => res.status(201).json(user))
      .catch((error) => this.handleError(error, res));
  };

  deleteUser = async (req: Request, res: Response) => {
    this.userServices
      .deleteUser()
      .then((user) => res.status(201).json(user))
      .catch((error) => this.handleError(error, res));
  };
}
