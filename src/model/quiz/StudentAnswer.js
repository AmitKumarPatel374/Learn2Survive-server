import mongoose from "mongoose";

const studentAnswerSchema = new mongoose.Schema(
  {
    attemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attempt",
      required: true,
      index: true,
    },

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },

    selectedAnswer: {
      type: Number,
      min: 0,
      max: 3,
      required: true,
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const StudentAnswer = mongoose.model(
  "StudentAnswer",
  studentAnswerSchema
);

export default StudentAnswer;