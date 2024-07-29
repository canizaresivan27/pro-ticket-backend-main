import { Validators } from "../../../config";

export class CreateTicketDto {
  private constructor(
    public readonly number: number,
    public readonly ownerData: Record<string, any>,
    public readonly history: string[],
    public readonly state: "PAID" | "UNPAID" | "CANCELLED",
    public readonly project: string, // ID
    public readonly seller: string // ID
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateTicketDto?] {
    const {
      number,

      ownerData,
      history,
      state,
      project,
      seller,
    } = object;

    if (!number) return ["Missing numbers"];

    if (!ownerData) return ["Missing ownerData"];
    if (!project) return ["Missing project"];
    if (!Validators.isMongoID(project)) return ["Invalid Project Id"];
    if (!seller) return ["Missing seller"];
    if (!Validators.isMongoID(seller)) return ["Invalid Seller Id"];

    return [
      undefined,
      new CreateTicketDto(+number, ownerData, history, state, project, seller),
    ];
  }
}
