import { useState } from "react";
import api from "./api";
import "./Login.css";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isSignup) {
        await api.post("/signup", {
          username,
          password,
        });

        setMessage("Account created successfully. You can now login.");
        setIsSignup(false);
      } else {
        const res = await api.post("/login", {
          username,
          password,
        });

        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("username", res.data.username);


        window.location.href =
          res.data.role === "admin" ? "/admin" : "/record";
      }
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Something went wrong."
      );
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-left">
        <div className="brand">
          <div className="brand-icon">🎙️</div>
          <h1>Voice<span>Feedback</span></h1>
        </div>

        <div className="hero-text">
          <h2>
            Turn customer voices into
            <span> valuable insights.</span>
          </h2>

          <p>
            Record customer feedback, automatically transcribe
            conversations and understand sentiment with AI.
          </p>
        </div>

        <div className="features">
          <div>
            <strong>🎙️ Voice Recording</strong>
            <small>Capture feedback naturally</small>
          </div>

          <div>
            <strong>🤖 AI Analysis</strong>
            <small>Automatic transcription & sentiment</small>
          </div>

          <div>
            <strong>📊 Simple Dashboard</strong>
            <small>View feedback in one place</small>
          </div>
        </div>
      </div>

      <div className="auth-right">

        <div className="auth-card">

          <div className="mobile-logo">🎙️</div>

          <h2>
            {isSignup ? "Create your account" : "Welcome back"}
          </h2>

          <p className="subtitle">
            {isSignup
              ? "Start collecting smarter customer feedback."
              : "Sign in to your feedback portal."}
          </p>

          <form onSubmit={handleSubmit}>

            <label>Username</label>

            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="auth-button">
              {isSignup ? "Create Account" : "Sign In"}
            </button>

          </form>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          <div className="switch-auth">
            {isSignup
              ? "Already have an account?"
              : "Don't have an account?"}

            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setMessage("");
              }}
            >
              {isSignup ? "Sign In" : "Create Account"}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}