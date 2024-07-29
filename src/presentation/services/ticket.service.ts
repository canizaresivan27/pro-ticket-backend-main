import { TicketModel } from "../../data";
import { CreateTicketDto, CustomError, PaginationDto } from "../../domain";

export class TicketServices {
  constructor() {}

  async createTicket(createTicketDto: CreateTicketDto) {
    const ticketExist = await TicketModel.findOne({
      name: createTicketDto.number,
    });
    if (ticketExist) throw CustomError.badRequest("Ticket already exists <<");

    try {
      const ticket = new TicketModel({
        ...createTicketDto,
      });

      ticket.price = 10;
      ticket.date = "121321";
      ticket.qr = Math.random().toString();

      await ticket.save();

      return ticket;
    } catch (error) {
      console.log({ error });
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async getTickets(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [total, tickets] = await Promise.all([
        TicketModel.countDocuments(),
        TicketModel.find()
          .skip((page - 1) * limit)
          .limit(limit),
        //todo: populate
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/tickets?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0 ? `/api/tickets?page=${page - 1}&limit=${limit}` : null,

        tickets: tickets.map((ticket) => ({
          id: ticket.id,
          number: ticket.number,
          data: ticket.ownerData,
          state: ticket.state,
        })),
      };
    } catch (error) {
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }
}
