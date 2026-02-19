const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes.js");
const jobRoutes = require("./routes/job.routes.js");
const connectDB = require("./config/db");

require("dotenv").config();

const app = express();

/**
 * Allowed origins (CORS)
 * Add ALL front-end URLs that will call this API.
 */
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "https://job-tracker-h7dool600-sanath-kumars-projects-c5194ee6.vercel.app",
  "https://job-tracker-lime-beta.vercel.app",
].filter(Boolean);


// CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or curl/postman requests (no Origin header)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // keep true if you ever use cookies; okay even with JWT
  })
);

// ✅ IMPORTANT: respond to preflight requests
app.options("*", cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/healthcheck", (req, res) => {
  res.json({ status: "good", message: "Job Tracker API running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// DB connection
if (process.env.MONGO_URI) {
  connectDB(process.env.MONGO_URI);
} else {
  console.log("⚠️ MONGO_URI not set yet. Running without DB.");
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log("✅ Allowed CORS origins:", allowedOrigins);
});
