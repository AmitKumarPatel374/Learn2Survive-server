const DisasterModel = require("../../model/disaster/disaster.model")
const Quiz = require("../../model/quiz/Quiz")

const {
  getDisasterRiskForState,
} = require("../disaster/disasterRisk.service")

const getRecommendedQuiz = async (state) => {
  try {
    if (!state) {
      return null
    }

    // 1. Get recommended disasters for user's state
    const disasterRecommendations =
      await getDisasterRiskForState(state)

    if (!disasterRecommendations.length) {
      return null
    }

    // 2. Check disasters according to priority
    for (const recommendation of disasterRecommendations) {
      const disaster = await DisasterModel.findOne({
        slug: recommendation.disaster,
        isPublished: true,
      }).lean()

      if (!disaster) {
        continue
      }

      // 3. Find a published quiz for this disaster
      const quiz = await Quiz.findOne({
        disasterId: disaster._id,
        isPublished: true,
      })
        .sort({ createdAt: -1 })
        .lean()

      // 4. First available quiz wins
      if (quiz) {
        return quiz
      }
    }

    return null
  } catch (error) {
    console.error("Get recommended quiz error:", error)
    throw error
  }
}

module.exports = {
  getRecommendedQuiz,
}