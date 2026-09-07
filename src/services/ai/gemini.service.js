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
   severity levels, emergency information, or safety-guide content.

4. Only consider a disaster as currently active when the
   Learn2Survive backend provides an active government alert.

5. When Learn2Survive provides a current government alert,
   use that alert as the authoritative source for the current
   situation, location, severity, urgency, timing, and official
   instructions.

6. When Learn2Survive provides safety-guide information from
   its database, use that information as the primary source
   for general disaster preparedness and safety advice.

7. If both a government alert and a safety guide are provided,
   combine them appropriately:
   - Government alert = current situation and official instructions.
   - Safety guide = general preparedness and safety knowledge.
   If they conflict, prioritize the official government instruction.

8. Do not replace official government instructions.
   If an official evacuation order or other instruction is provided,
   tell the user to follow it.

9. Keep responses concise, clear, and easy to understand,
   especially during an emergency.

10. Use Indian context when discussing emergency situations.
    Do not unnecessarily mention foreign emergency systems
    or organizations.

11. If the user asks something outside disaster safety,
    politely explain that you are the Learn2Survive safety
    assistant and are primarily designed for disaster-related
    questions.

12. Never provide dangerous instructions or encourage a user
    to take unnecessary risks.

13. If the provided government alert or safety-guide information
    is insufficient to answer safely, clearly say that the
    information is unavailable instead of guessing.

14. Do not assume information that is not provided by the
    Learn2Survive backend.

15. When answering, distinguish between:
    - current government alert information,
    - Learn2Survive safety-guide information,
    - and general conversational guidance.
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

Return the answer in ONLY valid JSON using this exact structure:

{
  "response": "Your complete answer here",
  "relatedQuestions": [
    "Related question 1",
    "Related question 2",
    "Related question 3"
  ]
}

Rules for relatedQuestions:

- Generate exactly 3 related questions.
- Questions must be directly related to the user's question.
- Questions should help the user continue learning about
  disaster safety or preparedness.
- Keep each question short and natural.
- Do not repeat the user's question.
- Do not include answers inside relatedQuestions.
- Return ONLY valid JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let text = response.text;

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI Assistant Error:", error);
    throw new Error("Failed to generate AI response");
  }
};

module.exports = {
  generateQuiz,
  generateAIResponse,
};
