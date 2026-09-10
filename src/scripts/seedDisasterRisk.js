require("dotenv").config()

const mongoose = require("mongoose")

const DisasterRisk = require("../model/disaster/DisasterRisk.model")
const disasterRiskData = require("../data/disasterRisk.data")

const seedDisasterRisk = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    console.log("MongoDB connected")

    await DisasterRisk.deleteMany({})

    await DisasterRisk.insertMany(disasterRiskData)

    console.log("Disaster risk data inserted successfully")

    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error("Failed to seed disaster risk data:", error)

    await mongoose.disconnect()
    process.exit(1)
  }
}

seedDisasterRisk()