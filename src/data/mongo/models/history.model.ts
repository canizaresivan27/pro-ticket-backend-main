import mongoose, { Schema } from "mongoose";

const historySchema = new mongoose.Schema({
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
    type: String,
    default: "VES",
    enum: ["VES", "USD", "COP"],
  },
  paymentType: {
    type: String,
    default: "CASH",
    enum: ["CASH", "TRANSFER"],
  },
  ref: {
    type: String,
  },
  ticket: {
    type: Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const HistoryModel = mongoose.model("History", historySchema);
