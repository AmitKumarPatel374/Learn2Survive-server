const mongoose = require("mongoose")

const DisasterRiskSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    disasters: [
      {
        disaster: {
          type: String,
          required: true,
          lowercase: true,
          trim: true,
        },

        priority: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  "DisasterRisk",
  DisasterRiskSchema
)