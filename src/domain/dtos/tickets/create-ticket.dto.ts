export class CreateTicketDto {
  private constructor(
    public readonly number: number,
    public readonly price: number,
    public readonly date: string,
    public readonly qr: string,
    public readonly ownerData: Record<string, any>,
    public readonly history: string[],
    public readonly state: "PAID" | "UNPAID" | "CANCELLED",
    public readonly project: string, // ID
    public readonly seller: string // ID
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateTicketDto?] {
    const {
      number,
      price,
      date,
      qr,
      ownerData,
      history,
      state,
      project,
      seller,
    } = object;

    if (!number) return ["Missing numbers"];
    if (!price) return ["Price is required"];
    if (!date) return ["Date is required"];
    if (!qr) return ["QR is required"];
    if (!ownerData) return ["Missing ownerData"];
    if (!project) return ["Missing project"];
    if (!seller) return ["Missing seller"];

    return [
      undefined,
      new CreateTicketDto(
        +number,
        +price,
        date,
        qr,
        ownerData,
        history,
        state,
        project,
        seller
      ),
    ];
  }
}
