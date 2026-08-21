const { generateAIResponse } = require("../services/ai/gemini.service");
const {
  getGovernmentAlerts,
  getAlertDetails,
  isAlertForDistrict,
} = require("../services/disasterAlert.service");

const { getDisasterBySlug } = require("../services/disaster.service");

const { getDisasterSlugFromEvent } = require("../utils/disasterClassifier");

const { buildDisasterContext } = require("../utils/disasterContext");
const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    let hasActiveAlert = false;
    const state = req.user.location?.state;
    const district = req.user.location?.district;

    let alertContext = "No active disaster alert available.";
    let disasterContext = "No disaster safety guide available.";

    if (state && district) {
      const alerts = await getGovernmentAlerts(state);

      for (const alert of alerts) {
        const details = await getAlertDetails(alert.detailsUrl);

        const isForDistrict = isAlertForDistrict(details, district);

        const isActive = new Date(details.expires) > new Date();

        if (isForDistrict && isActive) {
          hasActiveAlert = true;
          const disasterSlug = getDisasterSlugFromEvent(details.event);

          alertContext = `
Event: ${details.event}
Category: ${details.category}
Severity: ${details.severity}
Urgency: ${details.urgency}
Certainty: ${details.certainty}
Headline: ${details.headline}
Effective: ${details.effective}
Expires: ${details.expires}
Instruction: ${details.instruction}
Source: ${details.sender}
`;

          if (disasterSlug) {
            const disaster = await getDisasterBySlug(disasterSlug);

            if (disaster) {
              disasterContext = buildDisasterContext(disaster);
            }
          }

          break;
        }
      }
    }

    const prompt = `
Current Learn2Survive User:

State: ${state || "Not available"}
District: ${district || "Not available"}

ACTIVE ALERT STATUS:
${hasActiveAlert ? "ACTIVE GOVERNMENT ALERT EXISTS" : "NO ACTIVE GOVERNMENT ALERT"}

CURRENT GOVERNMENT ALERT:
${alertContext}

LEARN2SURVIVE SAFETY KNOWLEDGE:
${disasterContext}

USER QUESTION:
${message}


IMPORTANT INSTRUCTIONS:

1. If an active government alert exists:

   - Use CURRENT GOVERNMENT ALERT as the source of truth
     for the current situation, location, severity, urgency,
     timing, and official instructions.

   - Use LEARN2SURVIVE SAFETY KNOWLEDGE as the primary source
     for disaster preparedness and safety guidance.

   - Combine both sources when answering the user's question.

   - Do not claim that a different disaster is currently
     happening.

   - Do not invent or modify government alert information.

2. If NO active government alert exists:

   - Clearly state that there is currently no active
     government alert available for the user's district
     only when the user's question is about the current
     alert situation.

   - Do NOT assume that any particular disaster is currently
     happening.

   - Do NOT use the absence of an alert as evidence that
     a disaster cannot happen.

   - Answer general disaster-safety questions using your
     general knowledge when appropriate.

   - Do not pretend that the answer came from the
     Learn2Survive database.

3. Disaster classification is only used to select the
   relevant Learn2Survive safety guide when an active
   government alert exists.

   For example:

   Heavy Rain alert
       → classifier
       → flood
       → MongoDB Flood Guide

   This does NOT mean that a flood is currently happening.

4. Never invent government alerts, warnings, locations,
   severity levels, timings, official instructions,
   organizations, or emergency information.

5. When mentioning information from the CURRENT GOVERNMENT
   ALERT, preserve the provided information accurately.

6. If an official government instruction conflicts with
   general safety knowledge, prioritize the official
   government instruction.

7. Prioritize immediate human safety.

8. Keep the answer clear, practical, and easy to understand.

9. If the question is unrelated to disaster safety,
   politely explain that Learn2Survive is primarily designed
   for disaster preparedness and emergency-safety questions.
`;

    const aiResponse = await generateAIResponse(prompt);

    return res.status(200).json({
      response: aiResponse.response,
      relatedQuestions: aiResponse.relatedQuestions,
    });
  } catch (error) {
    console.error("AI chat controller error:", error);

    return res.status(500).json({
      message: "Failed to get AI response",
    });
  }
};

module.exports = {
  chatWithAI,
};
