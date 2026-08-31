const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    disasterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Disaster",
      required: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Preparedness",
        "Safety",
        "Recovery",
        "Emergency Response",
        "Awareness",
        "General",
      ],
      index: true,
    },

    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
      index: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;