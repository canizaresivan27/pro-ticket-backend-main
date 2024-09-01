import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  phone: {
    type: String,
  },
  emailValidated: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  img: {
    type: String,
  },
  role: {
    type: [String],
    default: ["USER_ROLE"],
    enum: ["ADMIN_ROLE", "USER_ROLE", "RESELLER_ROLE"],
  },
  state: {
    type: [String],
    default: ["ACTIVE"],
    enum: ["ACTIVE", "SUSPENDED", "DISABLED"],
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

userSchema.set("toJSON", {
  virtuals: true, // add ID like [id: ""] and not this [_id: " "]
  versionKey: false, // << remove version "__v:0"
  transform: function (doc, ret, options) {
    delete ret._id; // remove "_id"
    delete ret.password;
  },
});

export const UserModel = mongoose.model("User", userSchema);
