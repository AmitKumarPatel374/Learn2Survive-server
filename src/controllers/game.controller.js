const GameModel = require("../model/game.model");

const getAllGamesController = async (req, res) => {
    try {
        const games = await GameModel.find({
            isPublished: true
        })
        .populate("disaster", "name category")
        .sort({ name: 1 });

        return res.status(200).json({
            success: true,
            total: games.length,
            data: games
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    getAllGamesController
};