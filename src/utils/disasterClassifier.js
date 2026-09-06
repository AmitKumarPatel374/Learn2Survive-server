const disasterEventMap = {
  flood: [
    "flood",
    "urban flood",
    "urban flooding",
    "moderate rain",
    "heavy rain",
    "very heavy rain",
    "extremely heavy rain",
    "heavy rainfall",
    "very heavy rainfall",
    "extremely heavy rainfall",
  ],

  lightning: [
    "lightning",
  ],

  thunderstorm: [
    "thunderstorm",
    "thunderstorms",
  ],

  cyclone: [
    "cyclone",
  ],

  earthquake: [
    "earthquake",
  ],

  landslide: [
    "landslide",
  ],

  "heat-wave": [
    "heat wave",
    "heatwave",
  ],

  "cold-wave": [
    "cold wave",
    "coldwave",
  ],
}

const getDisasterSlugFromEvent = (event) => {
  if (!event) {
    return null
  }

  const normalizedEvent = event.trim().toLowerCase()

  for (const [slug, events] of Object.entries(disasterEventMap)) {
    if (events.includes(normalizedEvent)) {
      return slug
    }
  }

  return null
}

module.exports = {
  getDisasterSlugFromEvent,
}