const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes.js");
const jobRoutes = require("./routes/job.routes.js");

require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(cors());
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
