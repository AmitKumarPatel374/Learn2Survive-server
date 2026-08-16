const express = require("express")

const {
  chatWithAI,
} = require("../controllers/assistant.controller")

const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router()

router.post(
  "/chat",
  authMiddleware,
  chatWithAI
)

module.exports = router