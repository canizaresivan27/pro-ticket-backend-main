import { HistoryModel } from "../../data/mongo/models/history.model";
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
    //todo: Check amounts if they are greater than the total cost of the ticket
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

  async getHistory(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [total, history] = await Promise.all([
        HistoryModel.countDocuments(),
        HistoryModel.find()
          .skip((page - 1) * limit)
          .limit(limit),
        //.populate("ticket"),
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
    const recordExist = await HistoryModel.findById(updateHistoryDto.id);
    if (!recordExist) throw CustomError.badRequest("History not found");

    try {
      const updatedHistory = await HistoryModel.findByIdAndUpdate(
        updateHistoryDto.id,
        {
          ...updateHistoryDto,
        },
        { new: true }
      );

      return updatedHistory;
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  async deleteHistory(byIdHistoryDto: ByIdHistoryDto) {
    const recordExist = await HistoryModel.findById(byIdHistoryDto.id);
    if (!recordExist) throw CustomError.badRequest("History not found");

    try {
      await HistoryModel.findByIdAndDelete(byIdHistoryDto.id);
      return { message: "Project deleted successfully" };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }
}
