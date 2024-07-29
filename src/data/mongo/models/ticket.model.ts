import mongoose, { Schema } from "mongoose";

const ticketSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: [true, "Number are required"],
    unique: true,
  },
  date: {
    type: String,
    required: true,
  },
  qr: {
    type: String,
    required: true,
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
  history: [
    {
      type: Schema.Types.ObjectId,
      ref: "History",
    },
  ],
  state: {
    type: String,
    default: "UNPAID",
    enum: ["PAID", "UNPAID", "CANCELLED"],
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const TicketModel = mongoose.model("Ticket", ticketSchema);
