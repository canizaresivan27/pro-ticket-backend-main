import { Validators } from "../../../config";

export class CreateHistoryDto {
  private constructor(
    public readonly note: string,
    public readonly date: string,
    public readonly dolarAmount: number,
    public readonly amount: number,
    public readonly badge: string,
    public readonly paymentType: string,
    public readonly ref: string,
    public readonly ticket: string, // ID
    public readonly seller: string // ID
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateHistoryDto?] {
    const {
      note = "",
      date = new Date(),
      dolarAmount,
      amount,
      badge,
      paymentType,
      ref = "",
      ticket,
      seller,
    } = object;

    if (!date) return ["Date ammount in dolars"];
    if (!dolarAmount) return ["Missing ammount in dolars"];
    if (!amount) return ["Missing ammount"];
    if (!badge) return ["Missing badge"];
    if (!paymentType) return ["Missing payment type"];
    if (!ticket) return ["Missing ticket id"];
    if (!Validators.isMongoID(ticket)) return ["Invalid ticket Id"];
    if (!seller) return ["Missing user id"];
    if (!Validators.isMongoID(seller)) return ["Invalid user Id"];

    return [
      undefined,
      new CreateHistoryDto(
        note,
        date,
        dolarAmount,
        amount,
        badge,
        paymentType,
        ref,
        ticket,
        seller
      ),
    ];
  }
}
