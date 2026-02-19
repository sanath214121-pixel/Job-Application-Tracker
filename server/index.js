const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes.js");
const jobRoutes = require("./routes/job.routes.js");

require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

 const allowedOrigins = [
  process.env.CLIENT_URL, // production (Vercel)
  "http://localhost:5173" // local dev
  "https://job-tracker-h7dool600-sanath-kumars-projects-c5194ee6.vercel.app",
  "https://job-tracker-lime-beta.vercel.app",
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

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
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
