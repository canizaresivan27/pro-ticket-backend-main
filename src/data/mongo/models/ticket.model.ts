import mongoose, { Schema } from "mongoose";

const ticketSchema = new mongoose.Schema({
  number: {
    type: String,
    required: [true, "Number are required"],
    //unique: true,
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
    default: "RESERVED",
    enum: [
      "PAID",
      "UNPAID",
      "RESERVED",
      "CANCELLED",
      "WINNER",
      "LOSER",
      "EXPIRED",
    ],
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

ticketSchema.set("toJSON", {
  virtuals: true, // add ID like [id: ""] and not this [_id: " "]
  versionKey: false, // << remove version "__v:0"
  transform: function (doc, ret, options) {
    delete ret._id; // remove "_id"
  },
});

export const TicketModel = mongoose.model("Ticket", ticketSchema);
