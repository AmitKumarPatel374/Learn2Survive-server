const {
  getDisasterRiskForState,
} = require("../../services/disaster/disasterRisk.service")

const getDisasterRecommendations = async (req, res) => {
  try {
    const state = req.user.location?.state

    if (!state) {
      return res.status(400).json({
        success: false,
        message: "User state not found",
      })
    }

    const disasters = await getDisasterRiskForState(state)

    return res.status(200).json({
      success: true,
      state,
      data: disasters,
    })
  } catch (error) {
    console.error(
      "Get disaster recommendations error:",
      error
    )

    return res.status(500).json({
      success: false,
      message: "Failed to get disaster recommendations",
    })
  }
}

module.exports = {
  getDisasterRecommendations,
}