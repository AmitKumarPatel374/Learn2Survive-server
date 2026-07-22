const mongoose = require("mongoose")

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["In Progress", "Completed", "Abandoned"],
      default: "In Progress",
      index: true,
    },

    score: {
      type: Number,
      default: 0,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    answeredQuestions: {
      type: Number,
      default: 0,
    },

    percentage: {
      type: Number,
      default: 0,
    },

    remainingTime: {
      type: Number, // seconds
      default: 0,
    },

    lastActiveAt: {
      type: Date,
      default: Date.now,
    },

    timeTaken: {
      type: Number,
      default: 0, // seconds
    },
  },
  {
    timestamps: true,
  }
)

const Attempt = mongoose.model("Attempt", attemptSchema)

module.exports = Attempt
