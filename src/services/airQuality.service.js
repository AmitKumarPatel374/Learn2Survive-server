const getCurrentAirQuality = async ({ latitude, longitude }) => {
  try {
    const url =
      `https://air-quality-api.open-meteo.com/v1/air-quality` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&current=us_aqi,pm2_5,pm10` +
      `&timezone=auto`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Air Quality API request failed")
    }

    const data = await response.json()

    if (!data.current) {
      throw new Error("Current air quality data not available")
    }

    return {
      aqi: data.current.us_aqi,
      pm2_5: data.current.pm2_5,
      pm10: data.current.pm10,
    }
  } catch (error) {
    console.error("Air Quality API error:", error)
    throw error
  }
}

module.exports = {
  getCurrentAirQuality,
}