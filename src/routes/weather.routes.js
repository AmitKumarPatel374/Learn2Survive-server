const express = require("express")
const { getWeatherController, getAirQualityController } = require("../controllers/weather.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router()

router.get("/current",authMiddleware, getWeatherController)
router.get("/air-quality",authMiddleware, getAirQualityController)

module.exports = router
