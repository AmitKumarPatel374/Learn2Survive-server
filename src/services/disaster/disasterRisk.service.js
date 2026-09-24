const DisasterRisk = require("../../model/disaster/DisasterRisk.model")

const getDisasterRiskForState = async (state) => {
  try {
    if (!state) {
      return []
    }

    const disasterRisk = await DisasterRisk.findOne({
      state: {
        $regex: new RegExp(`^${state.trim()}$`, "i"),
      },
    }).lean()

    if (!disasterRisk) {
      return []
    }

    return disasterRisk.disasters
      .sort((a, b) => a.priority - b.priority)
  } catch (error) {
    console.error("Get disaster risk error:", error)
    throw error
  }
}

module.exports = {
  getDisasterRiskForState,
}