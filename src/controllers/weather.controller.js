const UserModel = require("../model/user.model")
const { getCurrentAirQuality } = require("../services/airQuality.service")
const { getCurrentWeather } = require("../services/weather.service")

const getWeatherController = async (req, res) => {
  try {
    const userId = req.user._id

    // Get user's location from database

    const user = await UserModel.findById(userId).select("location")

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    const { latitude, longitude } = user.location.coordinates || {}

    if (latitude == null || longitude == null) {
      return res.status(400).json({
        message: "Location coordinates are not available",
      })
    }

    const weather = await getCurrentWeather({
      latitude,
      longitude,
    })

    return res.status(200).json({
      message: "Weather fetched successfully",
      weather,
    })
  } catch (error) {
    console.error("Weather controller error:", error)

    return res.status(500).json({
      message: "Failed to fetch weather",
    })
  }
}
const getAirQualityController = async (req, res) => {
  try {
    const userId = req.user._id

    // Get user's location
    const user = await UserModel.findById(userId).select("location")

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    const { latitude, longitude } = user.location.coordinates || {}

    if (latitude == null || longitude == null) {
      return res.status(400).json({
        message: "Location coordinates are not available",
      })
    }

    // Get current air quality
    const airQuality = await getCurrentAirQuality({
      latitude,
      longitude,
    })

    return res.status(200).json({
      message: "Air quality fetched successfully",
      airQuality,
    })
  } catch (error) {
    console.error("Air Quality controller error:", error)

    return res.status(500).json({
      message: "Failed to fetch air quality",
    })
  }
}
module.exports = {
  getWeatherController,
  getAirQualityController
}
