import { Request, Response } from "express";
import {
  CustomError,
  PaginationDto,
  CreateTicketDto,
  UpdateTicketDto,
  DeleteTicketDto,
  GetTicketDto,
} from "../../domain";
import { TicketServices } from "../services/ticket.service";

export class TicketController {
  // DI
  constructor(private readonly ticketServices: TicketServices) {} //

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: "Internal server error" });
  };

  createTicket = async (req: Request, res: Response) => {
    const [error, createTicketDto] = CreateTicketDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.ticketServices
      .createTicket(createTicketDto!)
      .then((ticket) => res.status(201).json(ticket))
      .catch((error) => this.handleError(error, res));
  };

  getTicket = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    const projectId = req.params.id;
    const [errorID, getTicketDto] = GetTicketDto.create({ id: projectId });
    if (errorID) return res.status(400).json({ error });

    this.ticketServices
      .getTickets(getTicketDto!, paginationDto!)
      .then((ticket) => res.status(201).json(ticket))
      .catch((error) => this.handleError(error, res));
  };

  ticketById = async (req: Request, res: Response) => {
    const ticketId = req.params.id;
    if (!ticketId) res.status(400).json({ error: "Ticket ID is required" });

    const [error, getTicketDto] = GetTicketDto.create({ id: ticketId });
    if (error) return res.status(400).json({ error });

    this.ticketServices
      .ticketById(getTicketDto!)
      .then((ticket) => res.status(201).json(ticket))
      .catch((error) => this.handleError(error, res));
  };

  updateTicket = async (req: Request, res: Response) => {
    const [error, updateTicketDto] = UpdateTicketDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.ticketServices
      .updateTicket(updateTicketDto!)
      .then((ticket) => res.status(201).json(ticket))
      .catch((error) => this.handleError(error, res));
  };

  deleteTicket = async (req: Request, res: Response) => {
    const [error, deleteTicketDto] = DeleteTicketDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.ticketServices
      .deleteTicket(deleteTicketDto!)
      .then((ticket) => res.status(201).json(ticket))
      .catch((error) => this.handleError(error, res));
  };
}
