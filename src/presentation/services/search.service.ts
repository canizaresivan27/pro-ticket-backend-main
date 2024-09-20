import { TicketModel } from "../../data";
import { CustomError, PaginationDto, GetTicketDto } from "../../domain";

export class SearchServices {
  constructor() {}

  async getTickets(getTicketDto: GetTicketDto, paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const projectId = getTicketDto ? getTicketDto.id : null;

      // Crear el filtro basado en el id si existe
      const filter = projectId ? { project: projectId } : {};

      const [total, tickets] = await Promise.all([
        TicketModel.countDocuments(filter),
        TicketModel.find(filter)
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("seller", "name email role") // agrega datos en relación a la base de datos
          .populate("project", "name state owner"), // agrega datos en relación a la base de datos
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/tickets?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0 ? `/api/tickets?page=${page - 1}&limit=${limit}` : null,
        tickets: tickets,
      };
    } catch (error) {
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async ticketById(getTicketDto: GetTicketDto) {
    const ticketExist = await TicketModel.findById(getTicketDto.id);
    if (!ticketExist) throw CustomError.badRequest("Ticket not exists");

    try {
      const ticket = await TicketModel.findById(getTicketDto.id).populate(
        "seller project"
      );

      return ticket;
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async ticketByIdAllUsers(getTicketDto: GetTicketDto) {
    const ticketExist = await TicketModel.findById(getTicketDto.id);
    if (!ticketExist) throw CustomError.badRequest("Ticket not exists");

    try {
      const ticket = await TicketModel.findById(getTicketDto.id).populate(
        "seller project"
      );

      return ticket;
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }
}
