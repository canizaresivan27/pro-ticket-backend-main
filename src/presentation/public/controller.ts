import { Request, Response } from "express";
import { CustomError, GetTicketDto } from "../../domain";
import { error } from "console";
import { SearchServices } from "../services";

export class PublicController {
  constructor(public readonly searchServices: SearchServices) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: "Internal server error" });
  };

  ticketById = (req: Request, res: Response) => {
    const ticketId = req.params.id;
    if (!ticketId) res.status(400).json({ error: "Ticket ID is required" });

    const [error, getTicketDto] = GetTicketDto.create({ id: ticketId });
    if (error) return res.status(400).json({ error });

    this.searchServices
      .ticketById(getTicketDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };
}
