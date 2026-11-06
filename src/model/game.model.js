const mongoose = require('mongoose')

const { Schema } = mongoose

const GameSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    disaster: {
        type: Schema.Types.ObjectId,
        ref: "Disaster",
        required: true
    },

    gameType: {
        type: String,
        required: true,
        enum: [
            "survival-kit",
            "evacuation",
            "quiz",
            "decision-making"
        ]
    },

    thumbnail: {
        type: String,
        required: true
    },

    isPublished: {
        type: Boolean,
        default: true
    },

    gameConfig: {
        type: Schema.Types.Mixed,
        required: true
    }
});

const GameModel = mongoose.model("Game",GameSchema)
module.exports = GameModel