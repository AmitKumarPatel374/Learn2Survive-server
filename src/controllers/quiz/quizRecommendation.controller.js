const {
  getRecommendedQuiz,
} = require("../../services/quiz/quizRecommendation.service")

const getRecommendedQuizController = async (req, res) => {
  try {
    const state = req.user.location?.state

    if (!state) {
      return res.status(400).json({
        success: false,
        message: "User state not found",
      })
    }

    const quiz = await getRecommendedQuiz(state)

    return res.status(200).json({
      success: true,
      data: quiz,
    })
  } catch (error) {
    console.error(
      "Get recommended quiz error:",
      error
    )

    return res.status(500).json({
      success: false,
      message: "Failed to get recommended quiz",
    })
  }
}

module.exports = {
  getRecommendedQuizController,
}