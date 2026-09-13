const xml2js = require("xml2js")

const SACHET_STATE_FEEDS = {
  // States
  "andhra pradesh": "https://sachet.ndma.gov.in/cap_public_website/rss/rss_andhra.xml",
  "arunachal pradesh": "https://sachet.ndma.gov.in/cap_public_website/rss/rss_arunachal.xml",
  assam: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_assam.xml",
  bihar: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_bihar.xml",
  chhattisgarh: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_chhattisgarh.xml",
  goa: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_goa.xml",
  gujarat: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_gujarat.xml",
  haryana: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_haryana.xml",
  "himachal pradesh": "https://sachet.ndma.gov.in/cap_public_website/rss/rss_himachal.xml",
  jharkhand: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_jharkhand.xml",
  karnataka: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_karnataka.xml",
  kerala: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_kerala.xml",

  "madhya pradesh": "https://sachet.ndma.gov.in/cap_public_website/rss/rss_madhya.xml",

  maharashtra: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_maharashtra.xml",
  manipur: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_manipur.xml",
  meghalaya: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_meghalaya.xml",
  mizoram: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_mizoram.xml",
  nagaland: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_nagaland.xml",
  odisha: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_odisha.xml",
  punjab: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_punjab.xml",
  rajasthan: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_rajasthan.xml",
  sikkim: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_sikkim.xml",
  "tamil nadu": "https://sachet.ndma.gov.in/cap_public_website/rss/rss_tamil.xml",
  telangana: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_telangana.xml",
  tripura: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_tripura.xml",
  "uttar pradesh": "https://sachet.ndma.gov.in/cap_public_website/rss/rss_uttar.xml",
  uttarakhand: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_uttarakhand.xml",
  "west bengal": "https://sachet.ndma.gov.in/cap_public_website/rss/rss_west.xml",

  // Union Territories
  "andaman and nicobar islands":
    "https://sachet.ndma.gov.in/cap_public_website/rss/rss_andaman.xml",
  chandigarh: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_chhattisgarh.xml",
  "dadra and nagar haveli and daman and diu":
    "https://sachet.ndma.gov.in/cap_public_website/rss/rss_dadra.xml",
  delhi: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_delhi.xml",
  "jammu and kashmir": "https://sachet.ndma.gov.in/cap_public_website/rss/rss_jammu.xml",
  ladakh: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_ladakh.xml",
  lakshadweep: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_lakshadweep.xml",
  puducherry: "https://sachet.ndma.gov.in/cap_public_website/rss/rss_puducherry.xml",
}

const getGovernmentAlerts = async (state) => {
  try {
    const normalizedState = state.trim().toLowerCase()

    const url = SACHET_STATE_FEEDS[normalizedState]

    if (!url) {
      throw new Error(`SACHET feed not configured for state: ${state}`)
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

    if (!alert) {
      console.error("Unexpected SACHET XML response:", parsedData)
      throw new Error("Invalid SACHET alert XML format")
    }

    const info = alert["cap:info"]?.[0]

    if (!info) {
      console.error("SACHET alert info missing:", parsedData)
      throw new Error("SACHET alert info not found")
    }

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
