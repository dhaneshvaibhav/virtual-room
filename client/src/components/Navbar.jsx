import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Navbar() {
  const { name, theme, setTheme } = useContext(AppContext);
  const navigate = useNavigate();

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      navigate("/");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-deep-gradient shadow-sm py-3 px-4 sticky-top">
      <div className="container-fluid">
        {/* Brand */}
        <NavLink to="/" className="navbar-brand fw-bold d-flex align-items-center gap-2">
          <div className="logo-icon d-flex align-items-center justify-content-center">
            <i className="bi bi-lightning-charge-fill text-warning fs-5"></i>
          </div>
          <span className="text-gradient fs-4">Smart Study Hub</span>
        </NavLink>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/dashboard" className="nav-link">
                <i className="bi bi-speedometer2 me-2"></i> Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/solo" className="nav-link">
                <i className="bi bi-bullseye me-2"></i> Solo Study
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/group" className="nav-link">
                <i className="bi bi-people-fill me-2"></i> Group Study
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/leaderboard" className="nav-link">
                <i className="bi bi-trophy-fill me-2"></i> Leaderboard
              </NavLink>
            </li>
          </ul>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-3">
            {/* Theme Toggle */}
            <button
              className="btn btn-outline-light rounded-circle p-2 border-0 bg-light bg-opacity-10 hover-glow"
              onClick={toggleTheme}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <i className="bi bi-moon-stars-fill text-warning"></i>
              ) : (
                <i className="bi bi-sun-fill text-warning"></i>
              )}
            </button>

            {/* User Info */}
           

            {/* Logout */}
           
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .bg-deep-gradient {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
        }

        .text-gradient {
          background: linear-gradient(90deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
        }

        .avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .hover-scale {
          transition: all 0.3s ease;
        }
        .hover-scale:hover {
          transform: scale(1.05);
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
        }

        .hover-glow:hover {
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
        }

        .nav-link {
          color: rgba(255,255,255,0.85) !important;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .nav-link:hover, .nav-link.active {
          color: #fff !important;
          background: rgba(255,255,255,0.15);
          border-radius: 8px;
          padding-left: 12px;
          padding-right: 12px;
        }
      `}</style>
    </nav>
  );
}
