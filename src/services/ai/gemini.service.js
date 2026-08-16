const { GoogleGenAI } = require("@google/genai");
// require("dotenv").config()
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const LEARN2SURVIVE_SYSTEM_PROMPT = `
You are Learn2Survive AI Assistant.

Your purpose is to help users understand disaster preparedness,
safety procedures, and emergency situations.

Follow these rules:

1. Give clear, simple, and practical safety instructions.

2. Prioritize immediate human safety.

3. Do not invent government alerts, warnings, locations,
   severity levels, or emergency information.

4. Do not claim that a disaster is currently happening
   unless the Learn2Survive backend provides an active alert.

5. When Learn2Survive provides safety-guide information,
   use that information as the primary source.

6. Do not replace official government instructions.
   If an official evacuation order is provided, tell the
   user to follow it.

7. Keep responses concise and easy to understand,
   especially during an emergency.

8. Use Indian context when discussing emergency situations.
   Do not unnecessarily mention foreign emergency systems
   or organizations.

9. If the user asks something outside disaster safety,
   politely explain that you are the Learn2Survive safety
   assistant and are primarily designed for disaster-related
   questions.

10. Never provide dangerous instructions or encourage a user
    to take unnecessary risks.

11. If the available information is insufficient to answer
    safely, clearly say that the information is unavailable
    instead of guessing.
`;

const generateQuiz = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text;

    // Remove markdown if Gemini returns ```json ... ```
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate quiz");
  }
};

const generateAIResponse = async (prompt) => {
  try {
    const finalPrompt = `
${LEARN2SURVIVE_SYSTEM_PROMPT}

User Question:
${prompt}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini AI Assistant Error:", error);
    throw new Error("Failed to generate AI response");
  }
};

module.exports = {
  generateQuiz,
  generateAIResponse,
};
