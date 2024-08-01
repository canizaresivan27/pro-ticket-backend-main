import { ProjectModel, TicketModel } from "../../data";
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
    const ticketExist = await TicketModel.findOne({
      number: createTicketDto.number,
    });
    if (ticketExist) throw CustomError.badRequest("Ticket already exists");

    const projectExist = await ProjectModel.findById(createTicketDto.project);
    if (!projectExist) throw CustomError.badRequest("Project dont exists");

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

  async getTickets(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [total, tickets] = await Promise.all([
        TicketModel.countDocuments(),
        TicketModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("seller", "name email role"), // add data in relation database
      ]);

      //
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
      await TicketModel.findByIdAndDelete(deleteTicketDto.id);
      return { message: "Project deleted successfully" };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }
}
