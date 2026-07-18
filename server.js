require("dotenv").config()
const cookieParser = require("cookie-parser")
const express = require("express")
const cors = require("cors")
const path = require("path")
const connectDB = require("./src/config/database/db")
const ejs = require("ejs")
const cacheInstance = require("./src/services/cache.service")
const authRoutes=require("./src/routes/auth.routes")
const disasterRoutes=require("./src/routes/disaster.routes")

require("./src/services/googleOauth.service")
const session = require("express-session")
const passport = require("passport")

connectDB()
const app = express()
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/src/views"))

require("./src/workers/emailWorker")

app.use(express.urlencoded({ extended: true }))
// CORS configuration - handle multiple origins in production
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173"]

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true)

      // In development, allow all origins
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true)
      }

      // In production, check against allowed origins
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true, // 👈 allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
  })
)

app.use(express.json())
app.use(cookieParser())

//google oauth session so that not need authenticate again and again
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || process.env.JWT_SECRET || "change-this-secret-in-production",
    resave: false,
    saveUninitialized: false, // Changed to false for security
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
)

cacheInstance.on("connect", () => {
  console.log("redis connected successfully!")
})
cacheInstance.on("error", (error) => {
  console.log("Error connecting redis", error)
})

app.use("/api/auth", authRoutes);
app.use("/api/disasters", disasterRoutes);

let port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server is running on  port ${port}`)
})
