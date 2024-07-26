import mongoose, { Schema } from "mongoose";

const raffleConfigSchema = new mongoose.Schema({
  img: {
    type: String,
  },
  totalTickets: {
    type: Number,
    required: [true, "Total tickets is required"],
  },
  perTicket: {
    type: Number,
    default: 1,
    enum: [1, 2, 4, 5, 10],
  },
  qrPosition: {
    type: String,
    default: "bl",
    enum: ["br", "bl", "tr", "tl"],
  },
  numberPosition: {
    type: String,
    default: "bl",
    enum: ["br", "bl", "tr", "tl"],
  },
});

// PROJECT MODEL
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  date: {
    start: {
      type: String,
      required: [true, "Start date is required"],
    },
    end: {
      type: String,
      required: [true, "End date required"],
    },
  },
  raffleConfig: {
    type: raffleConfigSchema,
    required: true,
  },
  state: {
    type: [String],
    default: "ACTIVE",
    enum: ["ACTIVE", "SUSPENDED", "FINISHED", "CANCELLED"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const ProjectModel = mongoose.model("Project", projectSchema);
