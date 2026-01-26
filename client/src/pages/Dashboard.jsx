import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api/axios";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // form state
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");

  const token = localStorage.getItem("token");

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // If your backend requires auth, keep this header.
      // If it doesn't, it's still okay.
      const res = await api.get("/jobs", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const payload = res.data;

const list =
  Array.isArray(payload) ? payload :
  Array.isArray(payload.jobs) ? payload.jobs :
  Array.isArray(payload.data) ? payload.data :
  [];

setJobs(list);

    } catch (e) {
      console.error("fetchJobs failed:", e);
      setJobs([]);
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to load jobs. Check server + API route."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const onAddJob = async (e) => {
    e.preventDefault();
    try {
      setError("");

      const payload = { company, role, status, link, notes };

      await api.post("/jobs", payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // reset
      setCompany("");
      setRole("");
      setStatus("Applied");
      setLink("");
      setNotes("");

      await fetchJobs();
    } catch (e) {
      console.error("addJob failed:", e);
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to add job."
      );
    }
  };

  const deleteJob = async (id) => {
    try {
      setError("");
      await api.delete(`/jobs/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      await fetchJobs();
    } catch (e) {
      console.error("deleteJob failed:", e);
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to delete job."
      );
    }
  };

  const counts = useMemo(() => {
    const byStatus = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
    for (const j of jobs) {
      if (j?.status && byStatus[j.status] !== undefined) byStatus[j.status]++;
    }
    return byStatus;
  }, [jobs]);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>
        Job Application Tracker
      </h1>

      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <span>Applied: <b>{counts.Applied}</b></span>
        <span>Interview: <b>{counts.Interview}</b></span>
        <span>Offer: <b>{counts.Offer}</b></span>
        <span>Rejected: <b>{counts.Rejected}</b></span>
      </div>

      {error ? (
        <div
          style={{
            background: "#ffe6e6",
            border: "1px solid #ffb3b3",
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <b>Error:</b> {error}
        </div>
      ) : null}

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 10,
          padding: 16,
          marginBottom: 18,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Add a Job</h2>

        <form onSubmit={onAddJob}>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <input
              placeholder="Company *"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={{ flex: 1, padding: 10 }}
              required
            />
            <input
              placeholder="Role *"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ flex: 1, padding: 10 }}
              required
            />
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ padding: 10, minWidth: 140 }}
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
              <option value="Offer">Offer</option>
            </select>

            <input
              placeholder="Job link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              style={{ flex: 1, padding: 10 }}
            />
          </div>

          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ width: "100%", padding: 10, minHeight: 90 }}
          />

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button type="submit">+ Add Job</button>
            <button type="button" onClick={fetchJobs}>
              Refresh
            </button>
          </div>
        </form>
      </div>

      <h2 style={{ marginTop: 0 }}>My Jobs</h2>

      {loading ? (
        <p>Loading…</p>
      ) : jobs.length === 0 ? (
        <p>No jobs yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {jobs.map((job) => (
            <div
              key={job._id || job.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: 16,
              }}
            >
              <h3 style={{ marginTop: 0 }}>
                {job.role} @ {job.company}
              </h3>

              <div style={{ marginBottom: 8 }}>
                <b>Status:</b>{" "}
                <span style={{ padding: "2px 8px", border: "1px solid #ccc", borderRadius: 6 }}>
                  {job.status}
                </span>
              </div>

              {job.link ? (
                <div style={{ marginBottom: 8 }}>
                  <a href={job.link} target="_blank" rel="noreferrer">
                    Job link
                  </a>
                </div>
              ) : null}

              {job.notes ? <p style={{ marginBottom: 10 }}>{job.notes}</p> : null}

              <button
                onClick={() => deleteJob(job._id || job.id)}
                style={{ background: "#e74c3c", color: "white", border: "none", padding: "8px 12px", borderRadius: 6 }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
