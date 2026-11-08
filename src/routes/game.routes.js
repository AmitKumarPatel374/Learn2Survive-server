const express = require("express");

const {
    getAllGamesController,
    getGameByIdController,
    getScoreController,
    saveScoreController,
} = require("../controllers/game.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Public routes
router.get("/", getAllGamesController);
router.get("/:id", getGameByIdController);

// Protected routes
router.get("/score/:gameId", authMiddleware, getScoreController);
router.post("/score", authMiddleware, saveScoreController);

module.exports = router;