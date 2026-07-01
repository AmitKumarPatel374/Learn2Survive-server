const mongoose = require("mongoose")

const tempUserSchema = new mongoose.Schema({
  email: String,
  password: String,
  otp: String,
  role: String,
  otpExpiry: Date,
})

const TempUserModel = mongoose.model("TempUser", tempUserSchema)

module.exports = TempUserModel
