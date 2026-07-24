import mongoose from "mongoose";

const stateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    stateCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("State", stateSchema);