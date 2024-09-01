import { ProjectModel, TicketModel, HistoryModel } from "../../data";
import {
  CreateTicketDto,
  CustomError,
  PaginationDto,
  UpdateTicketDto,
  DeleteTicketDto,
  GetTicketDto,
} from "../../domain";

export class TicketServices {
  constructor() {}

  async createTicket(createTicketDto: CreateTicketDto) {
    const projectExist = await ProjectModel.findById(createTicketDto.project);
    if (!projectExist) throw CustomError.badRequest("Project dont exists");

    const ticketExist = await TicketModel.findOne({
      project: createTicketDto.project,
      number: createTicketDto.number,
    });

    if (ticketExist) {
      throw CustomError.badRequest(
        "Ticket number already exists for this project"
      );
    }

    try {
      const ticket = new TicketModel({
        ...createTicketDto,
        price: projectExist.raffleConfig.priceTicket,
        date: new Date(),
        qr: Math.random().toString(), //todo: generate qr
      });

      await ticket.save();

      return ticket;
    } catch (error) {
      console.log({ error });
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

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

  async updateTicket(updateTicketDto: UpdateTicketDto) {
    const ticketExist = await TicketModel.findById(updateTicketDto.id);
    if (!ticketExist) throw CustomError.badRequest("Ticket not found");

    try {
      const updatedTicket = await TicketModel.findByIdAndUpdate(
        updateTicketDto.id,
        {
          ownerData: updateTicketDto.ownerData,
          state: updateTicketDto.state,
        },
        { new: true }
      );

      return updatedTicket;
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async deleteTicket(deleteTicketDto: DeleteTicketDto) {
    const ticketExist = await TicketModel.findById(deleteTicketDto.id);
    if (!ticketExist) throw CustomError.badRequest("Ticket not found");

    try {
      const deleteResult = await HistoryModel.deleteMany({
        ticket: deleteTicketDto.id,
      });
      //console.log(`Historias eliminadas: ${deleteResult.deletedCount}`);

      const remainingHistories = await HistoryModel.find({
        ticket: deleteTicketDto.id,
      });
      if (remainingHistories.length > 0) {
        throw new Error(
          "No se eliminaron todos los historiales asociados al ticket."
        );
      }

      await TicketModel.findByIdAndDelete(deleteTicketDto.id);

      return { message: "Ticket deleted successfully" };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }
}
