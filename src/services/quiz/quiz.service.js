const Question = require("../../model/quiz/Question")
const Quiz = require("../../model/quiz/Quiz")
const { buildQuizPrompt } = require("../../utils/promptBuilder")
const { generateQuiz } = require("../ai/gemini.service")

const createQuiz = async (quizData, adminId) => {
  // Build AI prompt
  const prompt = buildQuizPrompt(quizData)

  // Generate questions from Gemini
  const generatedQuestions = await generateQuiz(prompt)

  // Create quiz
  const quiz = await Quiz.create({
    ...quizData,
    createdBy: adminId,
  })

  // Prepare question documents
  const questions = generatedQuestions.map((item) => ({
    quizId: quiz._id,
    question: item.question,
    options: item.options,
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
  }))

  // Save all questions
  await Question.insertMany(questions)

  return quiz
}

module.exports = {
  createQuiz,
}
