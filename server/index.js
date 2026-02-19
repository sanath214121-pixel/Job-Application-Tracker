const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes.js");
const jobRoutes = require("./routes/job.routes.js");
const connectDB = require("./config/db");

require("dotenv").config();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "https://job-tracker-h7dool600-sanath-kumars-projects-c5194ee6.vercel.app",
  "https://job-tracker-lime-beta.vercel.app",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // curl/postman
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// CORS
app.use(cors(corsOptions));

// ✅ DO NOT use app.options("*", ...) because it crashes on your Render stack
// If you really want it, use:
// app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/healthcheck", (req, res) => {
  res.json({ status: "good", message: "Job Tracker API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

if (process.env.MONGO_URI) {
  connectDB(process.env.MONGO_URI);
} else {
  console.log("⚠️ MONGO_URI not set yet. Running without DB.");
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log("✅ Allowed CORS origins:", allowedOrigins);
});
