import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Dashboard from "./Dashboard";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      const token = res?.data?.token || res?.data?.jwt || res?.data?.accessToken;
      if (!token) throw new Error("Token not found in login response");

      localStorage.setItem("token", token);
      setLoggedIn(true);
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      setError(err?.response?.data?.message || err?.message || "Login failed");
    }
  };

  if (loggedIn) return <Dashboard />;

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
        />

        <button type="submit" style={{ width: "100%", padding: "8px" }}>
          Login
        </button>
      </form>
        
      <p style={{ marginTop: 14 }}>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;