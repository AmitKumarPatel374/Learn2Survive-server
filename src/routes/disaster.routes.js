const express = require("express")
const {
  getFeaturedDisastersController,
  getRecommendedDisastersController,
  getCategoriesController,
  searchDisastersController,
  getDisasterBySlugController,
  getAllDisastersController,
} = require("../controllers/disaster.controller")
const {
  updateLearningProgress,
  getLearningProgress,
  getAllLearningProgress,
} = require("../controllers/learning/learningProgress.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const router = express.Router()

router.get("/", getAllDisastersController)
router.get("/featured", getFeaturedDisastersController)
router.get("/recommended", getRecommendedDisastersController)
router.get("/categories", getCategoriesController)
router.get("/search", searchDisastersController)
/* Learning Progress */

router.patch("/progress", authMiddleware, updateLearningProgress)

router.get("/progress", authMiddleware, getAllLearningProgress)

router.get("/progress/:disasterSlug", authMiddleware, getLearningProgress)

router.get("/:slug", getDisasterBySlugController)

module.exports = router
