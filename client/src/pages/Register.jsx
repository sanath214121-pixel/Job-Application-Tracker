import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/Register", form);

      // optional: auto-login after register
      const loginRes = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("user", JSON.stringify(loginRes.data.user));

      navigate("/"); // or "/dashboard" depending on your routes
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "60px auto", padding: 16 }}>
      <h2 style={{ marginBottom: 16 }}>Create an account</h2>

      {error ? (
        <div
          style={{
            background: "#ffecec",
            border: "1px solid #ffb3b3",
            padding: 10,
            marginBottom: 12,
            borderRadius: 6,
            color: "#9b1c1c",
          }}
        >
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            required
            placeholder="Your name"
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
            placeholder="you@email.com"
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
            placeholder="Create a password"
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p style={{ marginTop: 14 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
