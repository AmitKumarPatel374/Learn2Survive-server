const { createQuiz } = require("../../services/quiz/quiz.service")

const generateQuiz = async (req, res) => {
  try {
    const quizData = req.body

    // Assuming auth middleware adds the logged-in admin to req.user
    const adminId = req.user._id

    const quiz = await createQuiz(quizData, adminId)

    return res.status(201).json({
      success: true,
      message: "Quiz generated successfully.",
      data: quiz,
    })
  } catch (error) {
    console.error("Generate Quiz Error:", error)

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate quiz.",
    })
  }
}

module.exports = {
  generateQuiz,
}
