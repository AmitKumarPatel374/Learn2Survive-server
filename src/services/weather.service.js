const getCurrentWeather = async ({ latitude, longitude }) => {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&current=temperature_2m,weather_code` +
      `&temperature_unit=celsius` +
      `&timezone=auto`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Weather API request failed")
    }

    const data = await response.json()

    if (!data.current) {
      throw new Error("Current weather data not available")
    }

    return {
      temperature: data.current.temperature_2m,
      weatherCode: data.current.weather_code,
    }
  } catch (error) {
    console.error("Weather API error:", error)
    throw error
  }
}

module.exports = {
  getCurrentWeather,
}