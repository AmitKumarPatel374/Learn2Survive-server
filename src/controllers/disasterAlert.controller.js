const {
  getGovernmentAlerts,
  getAlertDetails,
  isAlertForDistrict,
} = require("../services/disasterAlert.service")

const getCurrentDisasterAlertController = async (req, res) => {
  try {
    const state = req.user.location?.state
    const district = req.user.location?.district

    if (!state || !district) {
      return res.status(400).json({
        message: "User state or district not found",
      })
    }

    const alerts = await getGovernmentAlerts(state)

    const activeAlerts = []

    for (const alert of alerts) {
      const details = await getAlertDetails(alert.detailsUrl)

      const isForDistrict = isAlertForDistrict(
        details,
        district
      )

      const isActive =
        new Date(details.expires) > new Date()

      if (isForDistrict && isActive) {
        activeAlerts.push({
          ...alert,
          details,
        })
      }
    }

    return res.status(200).json({
      state,
      district,
      alerts: activeAlerts,
    })
  } catch (error) {
    console.error("Get disaster alert error:", error)

    return res.status(500).json({
      message: "Failed to fetch disaster alerts",
    })
  }
}

module.exports = {
  getCurrentDisasterAlertController,
}