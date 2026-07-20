const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

const generateQuiz = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    })

    let text = response.text

    // Remove markdown if Gemini returns ```json ... ```
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    return JSON.parse(text)
  } catch (error) {
    console.error("Gemini Error:", error)
    throw new Error("Failed to generate quiz")
  }
}

module.exports = {
  generateQuiz,
}
