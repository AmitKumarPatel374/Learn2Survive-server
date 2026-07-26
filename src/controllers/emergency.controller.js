const State = require("../model/emergencyContact/State")
const EmergencyContact = require("../model/emergencyContact/EmergencyContact")
const District = require("../model/emergencyContact/District")

const createEmergencyContact = async (req, res) => {
  try {
    const emergencyContact = await EmergencyContact.create(req.body)

    res.status(201).json({
      success: true,
      message: "Emergency contact created successfully.",
      data: emergencyContact,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const getAllEmergencyContacts = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", category, stateCode, isNational } = req.query

    page = parseInt(page)
    limit = parseInt(limit)

    const filter = {}

    if (search) {
      filter.$or = [
        { office: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
      ]
    }

    if (category) {
      filter.category = category
    }

    if (stateCode) {
      filter.stateCode = stateCode
    }

    if (isNational !== undefined) {
      filter.isNational = isNational === "true"
    }

    const total = await EmergencyContact.countDocuments(filter)

    const contacts = await EmergencyContact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: contacts,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const updateEmergencyContact = async (req, res) => {
  try {
    const { id } = req.params

    const emergencyContact = await EmergencyContact.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!emergencyContact) {
      return res.status(404).json({
        success: false,
        message: "Emergency contact not found.",
      })
    }

    res.status(200).json({
      success: true,
      message: "Emergency contact updated successfully.",
      data: emergencyContact,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const deleteEmergencyContact = async (req, res) => {
  try {
    const { id } = req.params

    const emergencyContact = await EmergencyContact.findById(id)

    if (!emergencyContact) {
      return res.status(404).json({
        success: false,
        message: "Emergency contact not found.",
      })
    }

    await emergencyContact.deleteOne()

    res.status(200).json({
      success: true,
      message: "Emergency contact deleted successfully.",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const getNationalContacts = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({
      isNational: true,
      isActive: true,
    }).sort({ category: 1 })

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const getAllStates = async (req, res) => {
  try {
    const states = await State.find({}).sort({ name: 1 }).select("-createdAt -updatedAt -__v")

    res.status(200).json({
      success: true,
      count: states.length,
      data: states,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const getDistrictsByState = async (req, res) => {
  try {
    const { stateCode } = req.params

    const districts = await District.find({
      stateCode: stateCode.toUpperCase(),
    })
      .sort({ name: 1 })
      .select("-createdAt -updatedAt -__v")

    res.status(200).json({
      success: true,
      count: districts.length,
      data: districts,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const getStateEmergencyContacts = async (req, res) => {
  try {
    const { stateCode } = req.params;

    const contacts = await EmergencyContact.find({
      stateCode: stateCode.toUpperCase(),
      isActive: true,
    })
      .sort({
        district: 1,
        category: 1,
        office: 1,
      })
      .select("-createdAt -updatedAt -__v");

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDistrictEmergencyContacts = async (req, res) => {
  try {
    const { stateCode, district } = req.params

    // Escape special regex characters
    const escapedDistrict = district.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

    const contacts = await EmergencyContact.find({
      stateCode: stateCode.toUpperCase(),
      isActive: true,
      district: {
        $regex: `^${escapedDistrict}$`,
        $options: "i",
      },
    })
      .sort({ category: 1, office: 1 })
      .select("-createdAt -updatedAt -__v")

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const getCategories = async (req, res) => {
  try {
    const categories = await EmergencyContact.distinct("category", {
      isActive: true,
    })

    categories.sort()

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const searchEmergencyContacts = async (req, res) => {
  try {
    const { query } = req.query

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      })
    }

    const contacts = await EmergencyContact.find({
      isActive: true,
      $or: [
        {
          office: {
            $regex: query,
            $options: "i",
          },
        },
        {
          category: {
            $regex: query,
            $options: "i",
          },
        },
        {
          district: {
            $regex: query,
            $options: "i",
          },
        },
        {
          stateCode: {
            $regex: query,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    }).select("-createdAt -updatedAt -__v")

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = {
  createEmergencyContact,
  getAllEmergencyContacts,
  updateEmergencyContact,
  deleteEmergencyContact,
  getNationalContacts,
  getAllStates,
  getDistrictsByState,
  getStateEmergencyContacts,
  getDistrictEmergencyContacts,
  getCategories,
  searchEmergencyContacts,
}
