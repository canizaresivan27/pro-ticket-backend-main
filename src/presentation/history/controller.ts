import { Request, Response } from "express";
import {
  ByIdHistoryDto,
  CreateHistoryDto,
  CustomError,
  PaginationDto,
  UpdateHistoryDto,
} from "../../domain";
import { HistoryServices } from "../services";

export class HistoryController {
  // DI
  constructor(private readonly historyServices: HistoryServices) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: "Internal server error" });
  };

  createHistory = async (req: Request, res: Response) => {
    const [error, createHistoryDto] = CreateHistoryDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.historyServices
      .createHistory(createHistoryDto!)
      .then((history) => res.status(201).json(history))
      .catch((error) => this.handleError(error, res));
  };

  getHistory = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    const ticketId = req.params.id;
    if (!ticketId)
      return res.status(400).json({ error: "Ticket ID is required" });

    const [errorID, getTicketDto] = ByIdHistoryDto.create({ id: ticketId });
    if (errorID) return res.status(400).json({ error });

    this.historyServices
      .getHistory(getTicketDto!, paginationDto!)
      .then((history) => res.status(201).json(history))
      .catch((error) => this.handleError(error, res));
  };

  getHistoryById = async (req: Request, res: Response) => {
    const historyId = req.params.id;
    if (!historyId)
      return res.status(400).json({ error: "History ID is required" });

    const [error, byIdHistoryDto] = ByIdHistoryDto.create({ id: historyId });
    if (error) return res.status(400).json({ error });

    this.historyServices
      .getHistoryById(byIdHistoryDto!)
      .then((history) => res.status(201).json(history))
      .catch((error) => this.handleError(error, res));
  };

  updateHistory = async (req: Request, res: Response) => {
    const [error, updateHistoryDto] = UpdateHistoryDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.historyServices
      .updateHistory(updateHistoryDto!)
      .then((history) => res.status(201).json(history))
      .catch((error) => this.handleError(error, res));
  };

  deleteHistory = async (req: Request, res: Response) => {
    const [error, byIdHistoryDto] = ByIdHistoryDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.historyServices
      .deleteHistory(byIdHistoryDto!)
      .then((history) => res.status(201).json(history))
      .catch((error) => this.handleError(error, res));
  };
}
