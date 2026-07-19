export const buildQuizPrompt = ({
  title,
  description,
  disaster,
  category,
  difficulty,
  totalQuestions,
  duration,
  audience = "Students",
}) => {
  return `
Generate ${totalQuestions} multiple-choice questions.

Quiz Details:

Title:
${title}

Description:
${description}

Disaster:
${disaster.name}

Category:
${category}

Difficulty:
${difficulty}

Audience:
${audience}

Duration:
${duration} minutes

Reference Material:
${disaster.content}

Rules:

1. Generate exactly ${totalQuestions} questions.
2. Use ONLY the reference material provided.
3. Do NOT use external knowledge.
4. Difficulty must be ${difficulty}.
5. Each question must have exactly 4 options.
6. Only one option should be correct.
7. Include a short explanation for the correct answer.
8. Do NOT repeat questions.
9. Return ONLY valid JSON.
10. Do NOT include markdown or code blocks.

JSON Format:

[
  {
    "question": "",
    "options": ["", "", "", ""],
    "correctAnswer": 0,
    "explanation": ""
  }
]
`;
};