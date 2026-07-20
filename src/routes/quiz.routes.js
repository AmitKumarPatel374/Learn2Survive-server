const express = require("express")
const { generateQuiz } = require("../controllers/quiz/adminQuiz.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const {
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
} = require("../controllers/quiz/studentQuiz.controller")
const router = express.Router()

// Add your authentication/authorization middleware here
router.get("/", authMiddleware, getQuizzes)
router.post("/generate-quiz", authMiddleware, generateQuiz)
router.post("/:quizId/start", authMiddleware, startQuiz)
router.get("/attempt/:attemptId", authMiddleware, getQuizAttempt)
router.post("/attempt/:attemptId/save-answer", authMiddleware, saveAnswer)
router.post("/attempt/:attemptId/submit", authMiddleware, submitQuiz)
router.get("/attempt/:attemptId/result", authMiddleware, getQuizResult)
router.get("/history", authMiddleware, getQuizHistory)
router.get("/quiz/:quizId/analytics", authMiddleware, getQuizAnalytics)
router.get("/quiz/:quizId/question-analytics", authMiddleware, getQuestionAnalytics)
router.get("/quiz/:quizId/attempts", authMiddleware, getQuizAttempts)
router.get("/attempt/:attemptId", authMiddleware, getAttemptDetails)

module.exports = router
