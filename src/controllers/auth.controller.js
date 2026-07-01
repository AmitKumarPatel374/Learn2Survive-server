const TempUserModel = require("../model/tempUser.model")
const UserModel = require("../model/user.model")
const bcrypt = require("bcrypt")
const { emailQueue } = require("../queues/emailQueue")
const { getCookieOptions, getClearCookieOptions } = require("../utils/cookie.utils")
const cacheInstance = require("../services/cache.service")
const sendFilesToStorage = require("../services/storage.service")
const jwt = require("jsonwebtoken")

const registerController = async (req, res) => {
  try {
    const { email, password, role } = req.body
    if (!email || !password) {
      return res.status(404).json({
        message: "all feilds required!",
      })
    }

    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return res.status(422).json({
        message: "user already exists!",
      })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000) //for 5 minutes

    const hashedPassword = await bcrypt.hash(password, 10)

    await TempUserModel.findOneAndUpdate(
      { email },
      {
        email,
        password: hashedPassword,
        otp,
        role,
        otpExpiry,
      },
      { upsert: true }
    )

    await emailQueue.add("verify-email", {
      email,
      otp,
      otpExpiry,
    })
    return res.status(201).json({
      message: "OTP sent to your email. please verify!",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const verifyEmailByOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body
    const tempUser = await TempUserModel.findOne({ email })

    if (!tempUser) {
      return res.status(400).json({ message: "OTP expired" })
    }

    if (tempUser.otpExpiry < Date.now()) {
      await TempUserModel.deleteOne({ email })
      return res.status(400).json({ message: "OTP expired" })
    }

    if (tempUser.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    let newUser = await UserModel.create({
      email: tempUser.email,
      password: tempUser.password,
      role: tempUser.role,
      isEmailVerified: true,
    })

    let token = newUser.generateToken()
    console.log("token generated:", token ? "yes" : "no")
    res.cookie("token", token, getCookieOptions())

    await TempUserModel.deleteOne({ email })

    await emailQueue.add("welcome-email", {
      email: newUser.email,
      role: newUser.role,
    })
    return res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: newUser,
    })
  } catch (error) {
    console.log("error in vrification->", error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}
const resendOTPController = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const tempUser = await TempUserModel.findOne({ email: email })

    if (!tempUser) {
      return res.status(404).json({
        message: "Session expired. Please register again.",
      })
    }

    // 🔐 Rate limit (Redis or Cache)
    const key = `otp-resend:${email}`
    const attempts = await cacheInstance.get(key)

    if (attempts && Number(attempts) >= 3) {
      return res.status(429).json({
        message: "Too many requests. Try again after 10 minutes.",
      })
    }

    // 🔄 Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000)

    tempUser.otp = otp
    tempUser.otpExpiry = otpExpiry
    await tempUser.save()

    // ⏱️ Increase rate limit count
    await cacheInstance.set(key, (Number(attempts) || 0) + 1, "EX", 600)

    // 📬 Queue email
    await emailQueue.add("verify-email", {
      email: tempUser.email,
      otp,
      otpExpiry,
    })

    return res.status(200).json({
      message: "New OTP sent to your email",
    })
  } catch (err) {
    console.log("Resend OTP error →", err)
    return res.status(500).json({
      message: "Internal server error",
    })
  }
}

const loginController = async (req, res) => {
  try {
    let { email, password } = req.body

    if (!email || !password) {
      return res.status(404).json({
        message: "All fields are required",
      })
    }

    const user = await UserModel.findOne({ email })

    if (!user)
      return res.status(404).json({
        message: "User not found",
      })

    let cp = await user.comparePass(password)

    if (!cp)
      return res.status(400).json({
        message: "Invalid credentials",
      })

    let token = user.generateToken()
    console.log("token generated:", token ? "yes" : "no")
    res.cookie("token", token, getCookieOptions())

    return res.status(200).json({
      message: `user logined successfully.`,
      user: user,
    })
  } catch (error) {
    console.log("error in login->", error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const logoutController = async (req, res) => {
  try {
    let token = req.cookies.token

    if (!token) {
      return res.status(404).json({
        message: "token not found",
      })
    }

    await cacheInstance.set(token, "blacklisted")

    res.clearCookie("token", getClearCookieOptions())

    return res.status(200).json({
      message: "user logged out successfully!",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const completeProfileController = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      fullName,
      mobileNumber,
      dateOfBirth,
      gender,
    } = req.body;

    const location = JSON.parse(req.body.location);
    const education = JSON.parse(req.body.education);
    const emergencyContact = JSON.parse(req.body.emergencyContact);
    const preferences = JSON.parse(req.body.preferences);
    console.log(education);
    

    // Check if user exists
    const existingUser = await UserModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Data to update
    const updateData = {
      fullName,
      mobileNumber,
      dateOfBirth,
      gender,
      location,
      education,
      emergencyContact,
      preferences,
      profileCompleted: true,
    };

    // Upload new image only if user selected one
    if (req.file) {
      const uploadedImage = await sendFilesToStorage(
        req.file.buffer,
        req.file.originalname
      );

      updateData.profileImage = {
        url: uploadedImage.url,
        fileId: uploadedImage.fileId,
      };
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      message: existingUser.profileCompleted
        ? "Profile updated successfully."
        : "Profile completed successfully.",
      user: updatedUser,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    let { email } = req.body

    if (!email) {
      return res.status(404).json({
        message: "email not found",
      })
    }

    let user = await UserModel.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      })
    }

    let resetToken = jwt.sign({ id: user._id }, process.env.JWT_RAW_SECRET, {
      expiresIn: "5min",
    })

    console.log(resetToken)

    // Use environment variable for reset link base URL
    const baseUrl = process.env.CLIENT_ORIGIN
    let resetLink = `${baseUrl}/auth/reset-password/${resetToken}`

    // let resetTemp = resePassTemp(user.fullname, resetLink)

    // await sendMail(email, "Reset your Password", resetTemp)
    const fullname = user.fullname
    await emailQueue.add("reset-password", {
      email,
      fullname,
      resetLink,
    })

    return res.status(201).json({
      message: "reset link sended at your registered email!",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error ",
      error: error,
    })
  }
}

const verifyResetTokenController = async (req, res) => {
    try {

        const { token } = req.params;

        if (!token) {
            return res.status(400).json({
                valid: false,
                message: "Token is required"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_RAW_SECRET
        );

        return res.status(200).json({
            valid: true,
            userId: decoded.id
        });

    } catch (err) {

        return res.status(401).json({
            valid: false,
            message: "Reset link has expired or is invalid"
        });

    }
};

const updatePasswordController = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_RAW_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: "Invalid or expired reset link",
      });
    }

    const hashPass = await bcrypt.hash(password, 11);

    const updatedPassUser = await UserModel.findByIdAndUpdate(
      decoded.id,
      {
        password: hashPass,
      },
      {
        new: true,
      }
    );

    if (!updatedPassUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await emailQueue.add("password-updated", {
      email: updatedPassUser.email,
      name: updatedPassUser.fullName,
    });

    return res.status(200).json({
      message: "Password updated successfully!",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getProfileController = async (req, res) => {
  try {
    let user = req.user ///authmiddleware sets this
    return res.status(200).json({
      message: "profile fetched successfully!",
      user: user,
    })
  } catch (error) {
    return res.status(500).json({
      message: "internal server error!",
      error: error,
    })
  }
}

const googleController = async (req, res) => {
  try {
    // console.log("user->",req.user);
    const profile = req.user

    // Example: Create/find user in DB
    let user = await UserModel.findOne({ email: profile.emails[0].value })
    if (!user) {
      user = await UserModel.create({
        fullName: profile.displayName,
        email: profile.emails[0].value,
        password: "google_auth", // placeholder, not used
        profileImage: {
          url: profile.photos[0].value || "",
          fileId: "",
        }
      })
    }

    const token = user.generateToken()
    console.log("Google OAuth token generated:", token ? "✓" : "✗")

    res.cookie("token", token, getCookieOptions())

    await emailQueue.add("google_alert", {
      email: user.email,
      name: user.fullname,
    })

    const redirectUrl = process.env.CLIENT_ORIGIN
    res.redirect(redirectUrl)
  } catch (error) {
    console.log("error in callback url->", error)
    const redirectUrl = process.env.CLIENT_ORIGIN
    res.redirect(redirectUrl)
  }
}

module.exports = {
  registerController,
  verifyEmailByOtpController,
  resendOTPController,
  loginController,
  logoutController,
  completeProfileController,
  verifyResetTokenController,
  forgotPasswordController,
  updatePasswordController,
  getProfileController,
  googleController,
}
