const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const jobController = require("../controllers/job.controller");

// protect all job routes
router.use(authMiddleware);

// NOTE: we call functions from jobController directly to avoid undefined destructuring issues
router.post("/", jobController.createJob);
router.get("/", jobController.getJobs);
router.put("/:id", jobController.updateJob);
router.delete("/:id", jobController.deleteJob);

module.exports = router;
