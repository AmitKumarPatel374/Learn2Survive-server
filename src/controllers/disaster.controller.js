const DisasterModel = require("../model/disaster/disaster.model")


/* =====================================================
   GET ALL DISASTERS
   GET /api/disasters
===================================================== */

const getAllDisastersController = async (req, res) => {
  try {
    const disasters = await DisasterModel.find(
      { isPublished: true },
      {
        name: 1,
        slug: 1,
        thumbnail: 1,
        shortDescription: 1,
        estimatedTime: 1,
        lessons: 1,
        difficulty: 1,
        category: 1,
        type: 1,
        featured: 1,
        recommended: 1,
        themeColor: 1,
      }
    ).sort({ name: 1 })

    return res.status(200).json({
      success: true,
      total: disasters.length,
      data: disasters,
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

/* =====================================================
   GET DISASTER DETAILS
   GET /api/disasters/:slug
===================================================== */

const getDisasterBySlugController = async (req, res) => {
  try {
    const { slug } = req.params

    const disaster = await DisasterModel.findOne({
      slug,
      isPublished: true,
    })

    if (!disaster) {
      return res.status(404).json({
        success: false,
        message: "Disaster not found",
      })
    }

    return res.status(200).json({
      success: true,
      data: disaster,
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

/* =====================================================
   FEATURED DISASTERS
===================================================== */

const getFeaturedDisastersController = async (req, res) => {
  try {
    const disasters = await DisasterModel.find(
      {
        featured: true,
        isPublished: true,
      },
      {
        name: 1,
        slug: 1,
        thumbnail: 1,
        shortDescription: 1,
        estimatedTime: 1,
        lessons: 1,
        difficulty: 1,
        themeColor: 1,
      }
    )

    return res.status(200).json({
      success: true,
      data: disasters,
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

/* =====================================================
   RECOMMENDED DISASTERS
===================================================== */

const getRecommendedDisastersController = async (req, res) => {
  try {
    const disasters = await DisasterModel.find(
      {
        recommended: true,
        isPublished: true,
      },
      {
        name: 1,
        slug: 1,
        thumbnail: 1,
        shortDescription: 1,
        estimatedTime: 1,
        lessons: 1,
        difficulty: 1,
        themeColor: 1,
      }
    )

    return res.status(200).json({
      success: true,
      data: disasters,
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

/* =====================================================
   SEARCH
===================================================== */

const searchDisastersController = async (req, res) => {
  try {
    const { q } = req.query

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      })
    }

    const disasters = await DisasterModel.find(
      {
        $text: {
          $search: q,
        },
        isPublished: true,
      },
      {
        score: {
          $meta: "textScore",
        },
        name: 1,
        slug: 1,
        thumbnail: 1,
        shortDescription: 1,
        estimatedTime: 1,
      }
    ).sort({
      score: {
        $meta: "textScore",
      },
    })

    return res.status(200).json({
      success: true,
      total: disasters.length,
      data: disasters,
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

/* =====================================================
   GET CATEGORIES
===================================================== */

const getCategoriesController = async (req, res) => {
  try {
    const categories = await DisasterModel.distinct("category")

    return res.status(200).json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }
}

module.exports = {
  getAllDisastersController,
  getCategoriesController,
  getDisasterBySlugController,
  getFeaturedDisastersController,
  getRecommendedDisastersController,
  searchDisastersController
}
