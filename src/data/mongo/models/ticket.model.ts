import mongoose, { Schema } from "mongoose";

const ticketSchema = new mongoose.Schema({
  number: {
    type: [Number],
    required: [true, "Number is required"],
    unique: true,
  },
  qr: {
    type: String,
    required: [false, "QR is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  ownerData: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {},
  },
  history: {
    type: [Object],
    default: {
      note: {
        type: String,
      },
      date: {
        type: String,
        required: [true, "Date is required"],
      },
      amount: {
        type: Number,
        required: [true, "Amount is required"],
      },
      badge: {
        type: [String],
        default: ["VES"],
        enum: ["VES", "USD", "COP"],
      },
      paymentType: {
        type: [String],
        default: ["CASH"],
        enum: ["CASH", "TRANSFER"],
      },
      ref: {
        type: String,
      },
    },
  },
  state: {
    type: [String],
    default: ["UNPAID"],
    enum: ["PAID", "UNPAID", "CANCELLED"],
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

export const TickettModel = mongoose.model("Ticket", ticketSchema);
