const mongoose = require("mongoose");

const GameModel = require("../model/game.model");
const UserModel = require("../model/user.model");

const getAllGamesController = async (req, res) => {
    try {
        const games = await GameModel.find({
            isPublished: true
        })
        .sort({ name: 1 });

        return res.status(200).json({
            success: true,
            total: games.length,
            data: games
        })
    } catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const getGameByIdController = async (req,res) => {
    try {
        const {id} = req.params
        const game = await GameModel.findById(id).populate("disaster", "name category shortDescription");

        return res.status(200).json({
            success: true,
            data: game
        })
    } catch (error) {
        console.log(error)

        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}



const getScoreController = async (req, res) => {
    try {
        const { gameId } = req.params;

        // Validate gameId
        if (!mongoose.Types.ObjectId.isValid(gameId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Game ID"
            });
        }

        // Find logged-in user
        const user = await UserModel.findById(req.user.id)
            .select("gameProgress");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Find game progress
        const progress = user.gameProgress.find(
            (item) => item.game.toString() === gameId
        );

        // Game not played yet
        if (!progress) {
            return res.status(200).json({
                success: true,
                played: false,
                message: "Game has not been played yet",
                data: null
            });
        }

        // Game already played
        return res.status(200).json({
            success: true,
            played: true,
            message: "Game score fetched successfully",
            data: progress
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const saveScoreController = async (req, res) => {
    try {
        const { gameId } = req.params;
        const { score } = req.body;

        // Validate game ID
        if (!mongoose.Types.ObjectId.isValid(gameId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Game ID"
            });
        }

        // Validate score
        if (typeof score !== "number" || !Number.isFinite(score) || score < 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid score"
            });
        }

        // Check whether game exists
        const game = await GameModel.findById(gameId);

        if (!game) {
            return res.status(404).json({
                success: false,
                message: "Game not found"
            });
        }

        // Find user
        const user = await UserModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Find existing game progress
        const progress = user.gameProgress.find(
            (item) => item.game.toString() === gameId
        );

        if (progress) {
            // Update existing progress
            progress.lastBestScore = progress.bestScore;
            progress.lastScore = score;
            progress.bestScore = Math.max(progress.bestScore, score);
            progress.attempts += 1;
            progress.lastPlayedAt = new Date();

        } else {
            // Create new progress
            user.gameProgress.push({
                game: gameId,
                bestScore: score,
                lastScore: score,
                lastBestScore: 0,
                attempts: 1,
                lastPlayedAt: new Date()
            });
        }

        await user.save();

        const updatedProgress = user.gameProgress.find(
            (item) => item.game.toString() === gameId
        );

        return res.status(200).json({
            success: true,
            message: "Game score saved successfully",
            data: updatedProgress
        });

    } catch (error) {
        console.error("Save Score Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


module.exports = {
    getAllGamesController,
    getGameByIdController,
    getScoreController,
    saveScoreController
};