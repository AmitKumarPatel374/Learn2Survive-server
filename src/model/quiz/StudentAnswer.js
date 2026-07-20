const mongoose = require('mongoose')

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

studentAnswerSchema.index(
  { attemptId: 1, questionId: 1 },
  { unique: true }
);

const StudentAnswer = mongoose.model(
  "StudentAnswer",
  studentAnswerSchema
);

module.exports=StudentAnswer;