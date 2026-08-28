const mongoose = require("mongoose")

const LearningProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    disaster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Disaster",
      required: true,
    },

    completedSections: {
      type: [String],
      default: [],
    },

    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

LearningProgressSchema.index(
  { user: 1, disaster: 1 },
  { unique: true }
)

module.exports = mongoose.model(
  "LearningProgress",
  LearningProgressSchema
)