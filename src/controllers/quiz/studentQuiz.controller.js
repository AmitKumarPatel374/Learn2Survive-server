const Attempt = require("../../model/quiz/Attempt")
const Quiz = require("../../model/quiz/Quiz")
const Question = require("../../model/quiz/Question")
const StudentAnswer = require("../../model/quiz/StudentAnswer")

const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find(
      { isPublished: true },
      {
        title: 1,
        description: 1,
        difficulty: 1,
        duration: 1,
        totalQuestions: 1,
        category: 1,
        disasterId: 1,
        createdAt: 1,
      }
    ).sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      message: "Quizzes fetched successfully.",
      data: quizzes,
    })
  } catch (error) {
    console.error("Get Quizzes Error:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes.",
    })
  }
}
const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params
    console.log(quizId)

    const quiz = await Quiz.findById(quizId).populate({
      path: "disasterId",
      select: "title",
    })

    console.log(quiz);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found.",
      })
    }

    return res.status(200).json({
      success: true,
      data: quiz,
    })
  } catch (error) {
    console.error("Get Quiz Error:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to fetch quiz.",
    })
  }
}

const startQuiz = async (req, res) => {
  try {
    const { quizId } = req.params
    const userId = req.user._id

    // Check quiz exists
    const quiz = await Quiz.findById(quizId)

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found.",
      })
    }

    // Check for existing in-progress attempt
    const existingAttempt = await Attempt.findOne({
      userId,
      quizId,
      status: "In Progress",
    })

    if (existingAttempt) {
      return res.status(200).json({
        success: true,
        message: "Resume previous attempt.",
        attemptId: existingAttempt._id,
      })
    }

    // Create new attempt
    const attempt = await Attempt.create({
      userId,
      quizId,
      totalQuestions: quiz.totalQuestions,
      status: "In Progress",
      remainingTime: quiz.duration * 60,
    })

    return res.status(201).json({
      success: true,
      message: "Quiz started successfully.",
      attemptId: attempt._id,
    })
  } catch (error) {
    console.error("Start Quiz Error:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to start quiz.",
    })
  }
}

const getQuizAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params
    const userId = req.user._id

    // Check attempt
    const attempt = await Attempt.findOne({
      _id: attemptId,
      userId,
    })

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found.",
      })
    }

    // Quiz details
    const quiz = await Quiz.findById(attempt.quizId)

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found.",
      })
    }

    // Questions (Hide answers)
    const questions = await Question.find(
      { quizId: attempt.quizId },
      {
        correctAnswer: 0,
        explanation: 0,
      }
    )

    // Previously saved answers
    const answers = await StudentAnswer.find({
      attemptId,
    }).select("questionId selectedAnswer")

    return res.status(200).json({
      success: true,
      data: {
        attempt,
        quiz,
        questions,
        answers,
        remainingTime: attempt.remainingTime,
      },
    })
  } catch (error) {
    console.error("Get Quiz Attempt Error:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to load quiz.",
    })
  }
}

const saveAnswer = async (req, res) => {
  try {
    const { attemptId } = req.params
    const { questionId, selectedAnswer } = req.body
    const userId = req.user._id

    // Check attempt
    const attempt = await Attempt.findOne({
      _id: attemptId,
      userId,
      status: "In Progress",
    })

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found.",
      })
    }

    // Check question
    const question = await Question.findById(questionId)

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      })
    }

    const isCorrect = question.correctAnswer === selectedAnswer

    // Save or Update Answer
    await StudentAnswer.findOneAndUpdate(
      {
        attemptId,
        questionId,
      },
      {
        selectedAnswer,
        isCorrect,
      },
      {
        upsert: true,
        new: true,
      }
    )

    // Count answered questions
    const answeredQuestions = await StudentAnswer.countDocuments({
      attemptId,
    })

    // Update attempt
    attempt.answeredQuestions = answeredQuestions

    await attempt.save()

    return res.status(200).json({
      success: true,
      message: "Answer saved successfully.",
      data: {
        answeredQuestions,
        totalQuestions: attempt.totalQuestions,
        progress: Math.round(
          (answeredQuestions / attempt.totalQuestions) * 100
        ),
      },
    })
  } catch (error) {
    console.error("Save Answer Error:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to save answer.",
    })
  }
}

const submitQuiz = async (req, res) => {
  try {
    const { attemptId } = req.params
    const userId = req.user._id

    // Check attempt
    const attempt = await Attempt.findOne({
      _id: attemptId,
      userId,
      status: "In Progress",
    })

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found.",
      })
    }

    // Total Questions
    const totalQuestions = await Question.countDocuments({
      quizId: attempt.quizId,
    })

    // Correct Answers
    const correctAnswers = await StudentAnswer.countDocuments({
      attemptId,
      isCorrect: true,
    })

    // Percentage
    const percentage =
      totalQuestions === 0
        ? 0
        : Number(
            ((correctAnswers / totalQuestions) * 100).toFixed(2)
          )

    // Calculate submission time
    const submittedAt = new Date()

    // Time taken in seconds
    const timeTaken = Math.floor(
      (submittedAt.getTime() - attempt.startedAt.getTime()) / 1000
    )

    // Update Attempt
    attempt.score = correctAnswers
    attempt.percentage = percentage
    attempt.status = "Completed"
    attempt.submittedAt = submittedAt
    attempt.timeTaken = timeTaken

    await attempt.save()

    return res.status(200).json({
      success: true,
      message: "Quiz submitted successfully.",
      data: {
        score: correctAnswers,
        totalQuestions,
        percentage,
        timeTaken,
      },
    })
  } catch (error) {
    console.error("Submit Quiz Error:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to submit quiz.",
    })
  }
}

const getQuizResult = async (req, res) => {
  try {
    const { attemptId } = req.params
    const userId = req.user._id

    // Find completed attempt
    const attempt = await Attempt.findOne({
      _id: attemptId,
      userId,
      status: "Completed",
    })

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Result not found.",
      })
    }

    // Quiz details
    const quiz = await Quiz.findById(attempt.quizId).select(
      "title description difficulty duration totalQuestions"
    )

    // Questions with answers
    const questions = await Question.find({
      quizId: attempt.quizId,
    }).select("question options correctAnswer explanation")

    // Student Answers
    const answers = await StudentAnswer.find({
      attemptId,
    }).select("questionId selectedAnswer isCorrect")

    // Merge Questions + Answers
    const result = questions.map((question) => {
      const answer = answers.find((ans) => ans.questionId.toString() === question._id.toString())

      return {
        questionId: question._id,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        selectedAnswer: answer ? answer.selectedAnswer : null,
        isCorrect: answer ? answer.isCorrect : false,
        explanation: question.explanation,
      }
    })

    return res.status(200).json({
      success: true,
      data: {
        quiz,
        score: attempt.score,
        percentage: attempt.percentage,
        timeTaken: attempt.timeTaken,
        submittedAt: attempt.submittedAt,
        questions: result,
      },
    })
  } catch (error) {
    console.error("Quiz Result Error:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to fetch result.",
    })
  }
}

const getQuizHistory = async (req, res) => {
  try {
    const userId = req.user._id

    const attempts = await Attempt.find({ userId })
      .populate({
        path: "quizId",
        select: "title description difficulty duration totalQuestions category",
      })
      .sort({ createdAt: -1 })

    const history = attempts.map((attempt) => ({
  attemptId: attempt._id,
  quizId: attempt.quizId?._id,
  title: attempt.quizId?.title,
  description: attempt.quizId?.description,
  difficulty: attempt.quizId?.difficulty,
  duration: attempt.quizId?.duration,
  totalQuestions: attempt.totalQuestions,
  answeredQuestions: attempt.answeredQuestions,
  category: attempt.quizId?.category,
  score: attempt.score,
  percentage: attempt.percentage,
  status: attempt.status,
  startedAt: attempt.createdAt,
  submittedAt: attempt.submittedAt,
}))

    return res.status(200).json({
      success: true,
      data: history,
    })
  } catch (error) {
    console.error("Quiz History Error:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to fetch quiz history.",
    })
  }
}

const getQuizAnalytics = async (req, res) => {
  try {
    const { quizId } = req.params

    // Check quiz exists
    const quiz = await Quiz.findById(quizId)

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found.",
      })
    }

    // Completed attempts only
    const attempts = await Attempt.find({
      quizId,
      status: "Completed",
    })

    const totalAttempts = attempts.length

    let totalScore = 0
    let highestScore = 0
    let lowestScore = 0
    let passCount = 0

    if (totalAttempts > 0) {
      lowestScore = attempts[0].score

      attempts.forEach((attempt) => {
        totalScore += attempt.score

        if (attempt.score > highestScore) {
          highestScore = attempt.score
        }

        if (attempt.score < lowestScore) {
          lowestScore = attempt.score
        }

        // Passing Percentage >= 40%
        if (attempt.percentage >= 40) {
          passCount++
        }
      })
    }

    const averageScore = totalAttempts > 0 ? Number((totalScore / totalAttempts).toFixed(2)) : 0

    const passPercentage =
      totalAttempts > 0 ? Number(((passCount / totalAttempts) * 100).toFixed(2)) : 0

    return res.status(200).json({
      success: true,
      data: {
        quizTitle: quiz.title,
        totalQuestions: quiz.totalQuestions,
        totalAttempts,
        averageScore,
        highestScore,
        lowestScore,
        passPercentage,
      },
    })
  } catch (error) {
    console.error("Quiz Analytics Error:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics.",
    })
  }
}

const getQuestionAnalytics = async (req, res) => {
  try {
    const { quizId } = req.params

    // Check Quiz
    const quiz = await Quiz.findById(quizId)

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found.",
      })
    }

    // Get all questions
    const questions = await Question.find({ quizId })

    const analytics = []

    for (const question of questions) {
      const totalAnswers = await StudentAnswer.countDocuments({
        questionId: question._id,
      })

      const correctAnswers = await StudentAnswer.countDocuments({
        questionId: question._id,
        isCorrect: true,
      })

      const wrongAnswers = totalAnswers - correctAnswers

      const accuracy =
        totalAnswers > 0 ? Number(((correctAnswers / totalAnswers) * 100).toFixed(2)) : 0

      analytics.push({
        questionId: question._id,
        question: question.question,
        totalAnswers,
        correctAnswers,
        wrongAnswers,
        accuracy,
      })
    }

    return res.status(200).json({
      success: true,
      data: analytics,
    })
  } catch (error) {
    console.error("Question Analytics Error:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to fetch question analytics.",
    })
  }
}

const getQuizAttempts = async (req, res) => {
  try {
    const { quizId } = req.params

    const attempts = await Attempt.find({
      quizId,
    })
      .populate({
        path: "userId",
        select: "name email",
      })
      .sort({ createdAt: -1 })

    const data = attempts.map((attempt) => ({
      attemptId: attempt._id,
      studentId: attempt.userId?._id,
      studentName: attempt.userId?.name,
      studentEmail: attempt.userId?.email,
      score: attempt.score,
      percentage: attempt.percentage,
      status: attempt.status,
      startedAt: attempt.createdAt,
      submittedAt: attempt.submittedAt,
    }))

    return res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Quiz Attempts Error:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to fetch quiz attempts.",
    })
  }
}

const getAttemptDetails = async (req, res) => {
  try {
    const { attemptId } = req.params

    // Find Attempt
    const attempt = await Attempt.findById(attemptId).populate({
      path: "userId",
      select: "name email",
    })

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found.",
      })
    }

    // Quiz Details
    const quiz = await Quiz.findById(attempt.quizId)

    // Questions
    const questions = await Question.find({
      quizId: attempt.quizId,
    })

    // Student Answers
    const answers = await StudentAnswer.find({
      attemptId,
    })

    const result = questions.map((question) => {
      const answer = answers.find((item) => item.questionId.toString() === question._id.toString())

      return {
        questionId: question._id,
        question: question.question,
        options: question.options,
        selectedAnswer: answer?.selectedAnswer ?? null,
        correctAnswer: question.correctAnswer,
        isCorrect: answer?.isCorrect ?? false,
        explanation: question.explanation,
      }
    })

    return res.status(200).json({
      success: true,
      data: {
        student: {
          id: attempt.userId._id,
          name: attempt.userId.name,
          email: attempt.userId.email,
        },

        quiz: {
          id: quiz._id,
          title: quiz.title,
          difficulty: quiz.difficulty,
          totalQuestions: quiz.totalQuestions,
          duration: quiz.duration,
        },

        attempt: {
          score: attempt.score,
          percentage: attempt.percentage,
          status: attempt.status,
          startedAt: attempt.createdAt,
          submittedAt: attempt.submittedAt,
        },

        questions: result,
      },
    })
  } catch (error) {
    console.error("Attempt Details Error:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to fetch attempt details.",
    })
  }
}

const updateTimer = async (req, res) => {
  try {
    const { attemptId } = req.params
    const { remainingTime } = req.body
    const userId = req.user._id

    const attempt = await Attempt.findOne({
      _id: attemptId,
      userId,
      status: "In Progress",
    })

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found.",
      })
    }

    attempt.remainingTime = remainingTime
    await attempt.save()

    return res.json({
      success: true,
    })
  } catch (err) {
    console.error(err)

    return res.status(500).json({
      success: false,
      message: "Failed to update timer.",
    })
  }
}

module.exports = {
  getQuizzes,
  startQuiz,
  getQuizAttempt,
  saveAnswer,
  submitQuiz,
  getQuizResult,
  getQuizHistory,
  getQuizAnalytics,
  getQuestionAnalytics,
  getQuizAttempts,
  getAttemptDetails,
  getQuizById,
  updateTimer
}
