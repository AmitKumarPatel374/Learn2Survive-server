const xml2js = require("xml2js")

const SACHET_STATE_FEEDS = {
  "madhya pradesh":
    "https://sachet.ndma.gov.in/cap_public_website/rss/rss_madhya.xml",

  // We will add the remaining states here.
}

const getGovernmentAlerts = async (state) => {
  try {
    const normalizedState = state.trim().toLowerCase()

    const url = SACHET_STATE_FEEDS[normalizedState]

    if (!url) {
      throw new Error(
        `SACHET feed not configured for state: ${state}`
      )
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("SACHET RSS request failed")
    }

    const xmlData = await response.text()

    const parsedData = await xml2js.parseStringPromise(xmlData)

    const items = parsedData.rss.channel[0].item || []

    const alerts = items.map((item) => ({
      id: item.guid[0]._,
      title: item.title[0],
      category: item.category[0],
      source: item.author[0],
      publishedAt: item.pubDate[0],
      detailsUrl: item.link[0],
    }))


    return alerts
  } catch (error) {
    console.error("SACHET RSS error:", error)
    throw error
  }
}

const getAlertDetails = async (detailsUrl) => {
  try {
    const response = await fetch(detailsUrl)

    if (!response.ok) {
      throw new Error("SACHET alert details request failed")
    }

    const xmlData = await response.text()

    const parsedData = await xml2js.parseStringPromise(xmlData)

    const alert = parsedData["cap:alert"]
    const info = alert["cap:info"][0]

    const alertDetails = {
      id: alert["cap:identifier"][0],
      sender: alert["cap:sender"][0],
      sent: alert["cap:sent"][0],
      status: alert["cap:status"][0],
      messageType: alert["cap:msgType"][0],

      event: info["cap:event"][0],
      category: info["cap:category"][0],
      urgency: info["cap:urgency"][0],
      severity: info["cap:severity"][0],
      certainty: info["cap:certainty"][0],

      effective: info["cap:effective"][0],
      onset: info["cap:onset"][0],
      expires: info["cap:expires"][0],

      headline: info["cap:headline"][0],
      description: info["cap:description"][0],
      instruction: info["cap:instruction"][0],
    }


    return alertDetails
  } catch (error) {
    console.error("SACHET alert details error:", error)
    throw error
  }
}

const isAlertForDistrict = (alertDetails, district) => {
  if (!district || !alertDetails?.headline) {
    return false
  }

  const normalizedDistrict = district.trim().toLowerCase()
  const normalizedHeadline = alertDetails.headline.toLowerCase()

  return normalizedHeadline.includes(normalizedDistrict)
}

module.exports = {
  getGovernmentAlerts,
  getAlertDetails,
  isAlertForDistrict,
}