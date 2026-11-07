const express = require('express');
const { getAllGamesController } = require('../controllers/game.controller');
const { route } = require('./disaster.routes');

const router = express.Router();

router.get("/",getAllGamesController)

module.exports = router