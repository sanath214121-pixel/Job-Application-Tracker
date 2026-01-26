const Job = require("../models/job"); // <-- IMPORTANT: matches your file name job.js in models

const createJob = async (req, res) => {
  try {
    const { company, role, status, applicationDate, link, notes } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: "company and role are required" });
    }

    const job = await Job.create({
      user: req.user.id,
      company,
      role,
      status,
      applicationDate,
      link,
      notes,
    });

    return res.status(201).json({ message: "Job created", job });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = { user: req.user.id };
    if (status) filter.status = status;

    const jobs = await Job.find(filter).sort({ createdAt: -1 }).select("-__v");
    return res.json({ jobs });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!job) return res.status(404).json({ message: "Job not found" });

    return res.json({ message: "Job updated", job });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findOneAndDelete({ _id: id, user: req.user.id });
    if (!job) return res.status(404).json({ message: "Job not found" });

    return res.json({ message: "Job deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createJob, getJobs, updateJob, deleteJob };
