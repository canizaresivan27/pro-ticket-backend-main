import { HistoryModel, TicketModel } from "../../data";
import {
  CreateHistoryDto,
  CustomError,
  PaginationDto,
  UpdateHistoryDto,
  ByIdHistoryDto,
} from "../../domain";

export class HistoryServices {
  //DI
  constructor() {}

  async createHistory(createHistoryDto: CreateHistoryDto) {
    const ticket = await TicketModel.findById(createHistoryDto.ticket);
    if (!ticket) throw CustomError.badRequest("Ticket not found");
    if (ticket.state === "PAID")
      throw CustomError.badRequest("Ticket already paid");

    const historyRecords = await HistoryModel.find({
      ticket: createHistoryDto.ticket,
    });

    const totalPaid = historyRecords.reduce(
      (sum, record) => sum + record.dolarAmount,
      0
    );

    const updatedTotalPaid =
      totalPaid + parseFloat(createHistoryDto.dolarAmount.toString());

    if (updatedTotalPaid > ticket.price) {
      throw CustomError.badRequest("Total payment exceeds the ticket price");
    }

    if (updatedTotalPaid === ticket.price) {
      ticket.state = "PAID";
      await ticket.save();
    }

    try {
      const history = new HistoryModel({
        ...createHistoryDto,
      });

      await history.save();

      return history;
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async getHistory(
    byIdHistoryDto: ByIdHistoryDto,
    paginationDto: PaginationDto
  ) {
    const { page, limit } = paginationDto;
    const ticketId = byIdHistoryDto.id;

    try {
      const filter = ticketId ? { ticket: ticketId } : {};
      const [total, history] = await Promise.all([
        HistoryModel.countDocuments(filter),
        HistoryModel.find(filter)
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("seller", "name email role"),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/projects?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0 ? `/api/projects?page=${page - 1}&limit=${limit}` : null,

        history: history,
      };
    } catch (error) {
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async getHistoryById(byIdHistoryDto: ByIdHistoryDto) {
    const recordExist = await HistoryModel.findById(byIdHistoryDto.id);
    if (!recordExist) throw CustomError.badRequest("History not found");

    try {
      const history = await HistoryModel.findById(byIdHistoryDto.id);
      return history;
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async updateHistory(updateHistoryDto: UpdateHistoryDto) {
    // Verificar si el historial existe
    const recordExist = await HistoryModel.findById(updateHistoryDto.id);
    if (!recordExist) throw CustomError.badRequest("History not found");

    // Obtener el ticket asociado al historial
    const ticket = await TicketModel.findById(recordExist.ticket);
    if (!ticket) throw CustomError.badRequest("Associated ticket not found");

    try {
      // Actualizar el historial
      const updatedHistory = await HistoryModel.findByIdAndUpdate(
        updateHistoryDto.id,
        {
          ...updateHistoryDto,
        },
        { new: true }
      );

      // Obtener el historial restante para el ticket
      const historyRecords = await HistoryModel.find({ ticket: ticket._id });

      // Recalcular la suma total de los pagos restantes
      const totalPaid = historyRecords.reduce(
        (sum, record) => sum + parseFloat(record.amount.toString()),
        0
      );

      // Si la suma total es menor que el precio del ticket, actualizar el estado a "UNPAID"
      if (totalPaid < parseFloat(ticket.price.toString())) {
        ticket.state = "UNPAID"; // Cambiar 'UNPAID' al estado que corresponda
        await ticket.save();
      } else if (totalPaid >= parseFloat(ticket.price.toString())) {
        // Opcional: Si el total pagado es igual o mayor al precio, asegurarse de que el estado esté en "PAID"
        ticket.state = "PAID";
        await ticket.save();
      }

      return updatedHistory;
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async deleteHistory(byIdHistoryDto: ByIdHistoryDto) {
    const recordExist = await HistoryModel.findById(byIdHistoryDto.id);
    if (!recordExist) throw CustomError.badRequest("History not found");

    const ticket = await TicketModel.findById(recordExist.ticket);
    if (!ticket) throw CustomError.badRequest("Associated ticket not found");

    try {
      await HistoryModel.findByIdAndDelete(byIdHistoryDto.id);
      // find all the payment history records for the ticket
      const remainingHistoryRecords = await HistoryModel.find({
        ticket: ticket._id,
      });
      // calculate the total amount paid for the ticket
      const remainingTotalPaid = remainingHistoryRecords.reduce(
        (sum, record) => sum + parseFloat(record.amount.toString()),
        0
      );
      // if the total amount paid is less than the ticket price, change the ticket state to 'UNPAID'
      if (remainingTotalPaid < parseFloat(ticket.price.toString())) {
        ticket.state = "UNPAID";
        await ticket.save();
      }

      return { message: "Payment history deleted successfully" };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }
}
