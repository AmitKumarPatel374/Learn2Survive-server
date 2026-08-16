const { generateAIResponse } = require("../services/ai/gemini.service")

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      })
    }

    const response = await generateAIResponse(message)

    return res.status(200).json({
      response,
    })
  } catch (error) {
    console.error("AI chat controller error:", error)

    return res.status(500).json({
      message: "Failed to get AI response",
    })
  }
}

module.exports = {
  chatWithAI,
}