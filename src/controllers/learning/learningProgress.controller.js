const LearningProgressModel = require("../../model/disaster/learningProgress.model")
const DisasterModel = require("../../model/disaster/disaster.model")

const updateLearningProgress = async (req, res) => {
  try {
    const userId = req.user._id
    const { disasterSlug, section, completed } = req.body

    if (!disasterSlug || !section || typeof completed !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "disasterSlug, section and completed are required",
      })
    }

    const allowedSections = [
      "overview",
      "preparedness",
      "dosDonts",
      "emergencyKit",
      "resources",
      "faq",
    ]

    if (!allowedSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: "Invalid learning section",
      })
    }

    const disaster = await DisasterModel.findOne({
      slug: disasterSlug,
      isPublished: true,
    })

    if (!disaster) {
      return res.status(404).json({
        success: false,
        message: "Disaster not found",
      })
    }

    let progress = await LearningProgressModel.findOne({
      user: userId,
      disaster: disaster._id,
    })

    if (!progress) {
      progress = new LearningProgressModel({
        user: userId,
        disaster: disaster._id,
        completedSections: [],
      })
    }

    if (completed) {
      if (!progress.completedSections.includes(section)) {
        progress.completedSections.push(section)
      }
    } else {
      progress.completedSections = progress.completedSections.filter(
        (item) => item !== section
      )
    }

    progress.lastSeenAt = new Date()

    await progress.save()

    return res.status(200).json({
      success: true,
      message: completed
        ? "Section marked as studied"
        : "Section marked as incomplete",
      data: {
        disaster: disaster.slug,
        completedSections: progress.completedSections,
        totalSections: allowedSections.length,
        progress: Math.round(
          (progress.completedSections.length / allowedSections.length) * 100
        ),
        lastSeenAt: progress.lastSeenAt,
      },
    })
  } catch (error) {
    console.error("Update learning progress error:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to update learning progress",
    })
  }
}
const getLearningProgress = async (req, res) => {
  try {
    const userId = req.user._id
    const { disasterSlug } = req.params

    const disaster = await DisasterModel.findOne({
      slug: disasterSlug,
      isPublished: true,
    })

    if (!disaster) {
      return res.status(404).json({
        success: false,
        message: "Disaster not found",
      })
    }

    const progress = await LearningProgressModel.findOne({
      user: userId,
      disaster: disaster._id,
    })

    return res.status(200).json({
      success: true,
      data: {
        disaster: disaster.slug,
        completedSections: progress?.completedSections || [],
        totalSections: 6,
        progress: Math.round(
          ((progress?.completedSections?.length || 0) / 6) * 100
        ),
        lastSeenAt: progress?.lastSeenAt || null,
      },
    })
  } catch (error) {
    console.error("Get learning progress error:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to get learning progress",
    })
  }
}

const getAllLearningProgress = async (req, res) => {
  try {
    const userId = req.user._id

    const progressRecords = await LearningProgressModel.find({
      user: userId,
      "completedSections.0": { $exists: true },
    })
      .populate(
        "disaster",
        "name slug thumbnail themeColor"
      )
      .sort({ lastSeenAt: -1 })
      .lean()

    const data = progressRecords
      .filter((item) => item.disaster)
      .map((item) => ({
        disaster: item.disaster,
        completedSections: item.completedSections,
        totalSections: 6,
        progress: Math.round(
          (item.completedSections.length / 6) * 100
        ),
        lastSeenAt: item.lastSeenAt,
      }))

    return res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Get all learning progress error:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to get learning progress",
    })
  }
}
module.exports = {
  updateLearningProgress,
  getLearningProgress,
  getAllLearningProgress,
}