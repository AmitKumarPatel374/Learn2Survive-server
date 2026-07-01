const express = require("express");
const { registerController, loginController, verifyEmailByOtpController, resendOTPController, logoutController, completeProfileController, forgotPasswordController, verifyResetTokenController, updatePasswordController, googleController, getProfileController } = require("../controllers/auth.controller");
const uploads = require("../config/database/multer");
const passport = require("passport");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/forgot-Password", forgotPasswordController);
router.get("/verify-reset-token/:token", verifyResetTokenController);
router.post("/update-Password", updatePasswordController);

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/verify-otp", verifyEmailByOtpController);
router.post("/resend-otp", resendOTPController);
router.delete("/logout",authMiddleware, logoutController);
router.put('/update-profile',authMiddleware,uploads.single("profileImage"),completeProfileController);

router.get('/profile',authMiddleware,getProfileController);


router.get("/google",passport.authenticate("google",{scope:["profile","email"]}));

router.get("/google/callback",passport.authenticate("google",{failureRedirect:"/api/auth/google/failed"}),googleController);

// router.post("/add-email",addEmailController)

// router.post("/verify-email",verifyEmailFaceController);

//failed api
router.get("/google/failed",(req,res)=>{
    res.send("tumse n ho payega");
})
router.get("/facebook/failed",(req,res)=>{
    res.send("tumse n ho payega");
})

// success api
router.get("/profile",(req,res)=>{
    res.send(`ho gya aa gaye login hokar ${req.user.displayName}`);
})

module.exports = router;