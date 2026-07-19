const express = require("express")
const { generateQuiz } = require("../controllers/quiz/adminQuiz.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const router = express.Router()


// Add your authentication/authorization middleware here
router.post("/generate-quiz",authMiddleware, generateQuiz)

module.exports = router
