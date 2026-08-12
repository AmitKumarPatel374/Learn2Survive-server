const {
  getGovernmentAlerts,
  getAlertDetails,
  isAlertForDistrict
} = require("./src/services/disasterAlert.service")

const test = async () => {
  try {
    const alerts = await getGovernmentAlerts()

    const district = "Bhopal"

    const matchingAlerts = []

    for (const alert of alerts) {
      const details = await getAlertDetails(alert.detailsUrl)

      if (
        isAlertForDistrict(details, district) &&
        new Date(details.expires) > new Date()
      ) {
        matchingAlerts.push({
          ...alert,
          details,
        })
      }
    }

    console.log(`ALERTS FOR ${district.toUpperCase()}:`)
    console.dir(matchingAlerts, { depth: null })
  } catch (error) {
    console.error("Test failed:", error)
  }
}

test()