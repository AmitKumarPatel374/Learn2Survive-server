const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema(
  {
    // Authentication
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // Profile Completion
    profileCompleted: {
      type: Boolean,
      default: false,
    },

    // Personal Information
    fullName: {
      type: String,
      default: "",
    },

    profileImage: {
      url: {
        type: String,
        default: "",
      },
      fileId: {
        type: String,
        default: "",
      },
    },

    mobileNumber: {
      type: String,
      default: "",
    },

    dateOfBirth: Date,

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: null,
    },

    // Location Details
    location: {
      country: {
        type: String,
        default: "India",
      },

      state: String,

      district: String,

      city: String,

      pinCode: String,
    },

    // Educational Details
    education: {
      institution: String,
      studentId: String,
      classGrade: String,
      course: String,
    },

    // Emergency Details
    emergencyContact: {
      contactName: String,
      relationship: String,
      bloodGroup: String,
      emergencyNumber: String,
      medicalConditions: String,
    },

    // Preferences
    preferences: {
      language: {
        type: String,
        enum: ["English", "Hindi", "Marathi", "Bengali"],
        default: "English",
      },

      notifications: {
        governmentAlerts: {
          type: Boolean,
          default: true,
        },

        weatherReports: {
          type: Boolean,
          default: true,
        },

        schoolBroadcasts: {
          type: Boolean,
          default: true,
        },

        emergencyDrills: {
          type: Boolean,
          default: false,
        },
      },
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
)

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return

  // If password is already a bcrypt hash, don't hash again
  if (this.password.startsWith("$2b$")) return

  this.password = await bcrypt.hash(this.password, 11)
})

userSchema.methods.comparePass = async function (password) {
  console.log("Entered:", password)
  console.log("Database:", this.password)

  const result = await bcrypt.compare(password, this.password)
  console.log("Compare Result:", result)

  return result
}

userSchema.methods.generateToken = function () {
  let token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  })
  return token
}

const UserModel = mongoose.model("User", userSchema)
module.exports = UserModel
