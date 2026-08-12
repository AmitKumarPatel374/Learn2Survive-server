const express = require("express")

const {
  getCurrentDisasterAlertController,
} = require("../controllers/disasterAlert.controller")

const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router()

router.get(
  "/current",
  authMiddleware,
  getCurrentDisasterAlertController
)

module.exports = router