const { generateAIResponse } = require("./src/services/ai/gemini.service")
require("dotenv").config()
generateAIResponse(
  "You are Learn2Survive AI. Explain in simple words what a person should do during a flood."
)
  .then((response) => {
    console.log("AI ASSISTANT:", response)
  })
  .catch((error) => {
    console.error(error)
  })