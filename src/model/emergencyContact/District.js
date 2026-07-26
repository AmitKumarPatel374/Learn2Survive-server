const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    stateCode: {
      type: String,
      required: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  }
);

districtSchema.index({ name: 1, stateCode: 1 }, { unique: true });

module.exports = mongoose.model("District", districtSchema);