const express = require("express");
const { getFeaturedDisastersController, getRecommendedDisastersController, getCategoriesController, searchDisastersController, getDisasterBySlugController, getAllDisastersController } = require("../controllers/disaster.controller");

const router = express.Router();

router.get("/", getAllDisastersController)
router.get("/featured", getFeaturedDisastersController)
router.get("/recommended", getRecommendedDisastersController)
router.get("/categories", getCategoriesController)
router.get("/search", searchDisastersController)
router.get("/:slug", getDisasterBySlugController)


module.exports = router;