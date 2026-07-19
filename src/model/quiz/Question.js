import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,

      validate: {
        validator: function (value) {
          return value.length === 4;
        },
        message: "Each question must have exactly 4 options.",
      },
    },

    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },

    explanation: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;