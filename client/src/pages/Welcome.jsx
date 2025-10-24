import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Welcome() {
  const { name, setName } = useContext(AppContext);
  const [inputName, setInputName] = useState(name || "");
  const navigate = useNavigate();

  useEffect(() => {
    if (name) navigate("/dashboard");
  }, [name, navigate]);

  const handleGetStarted = () => {
    if (!inputName.trim()) return alert("Please enter your name to get started.");
    setName(inputName.trim());
    navigate("/dashboard");
  };

  return (
    <div className="welcome-section d-flex align-items-center justify-content-center min-vh-100 text-center position-relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="welcome-glow"></div>

      <div className="card welcome-card fade-in-up p-5 shadow-lg border-0">
        <h1 className="fw-bold mb-3 header-brand">Virtual Study Room</h1>
        <p className="text-muted mb-4 px-3">
          Your personal space to stay focused, collaborate with peers, and
          elevate your study experience. Let’s make learning smarter and fun!
        </p>

        <div className="form-group mb-4">
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleGetStarted()}
            className="form-control form-control-lg text-center rounded-pill shadow-sm"
            placeholder="Enter your name"
          />
        </div>

        <button
          className="btn btn-gradient w-100 rounded-pill py-3 fs-5"
          onClick={handleGetStarted}
        >
          🚀 Get Started
        </button>

        <div className="mt-4 text-muted small">
          <em>Built for students who love to learn together 💡</em>
        </div>
      </div>
    </div>
  );
}
