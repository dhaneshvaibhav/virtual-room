import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Navbar() {
  const { name, theme, setTheme } = useContext(AppContext);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const NavItem = ({ to, children, icon }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold no-underline transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-medium' 
          : 'text-secondary-600 hover:bg-primary-50 hover:text-primary-600'
      }`}
    >
      {icon && <span className="text-base">{icon}</span>}
      {children}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary-200/50 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-soft">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Home Button */}
          <NavLink to="/" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-medium transition-all duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            StudyHub
          </NavLink>
          
          <NavLink to="/" className="flex items-center space-x-3 no-underline group">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl shadow-medium">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Smart Study Hub
            </span>
          </NavLink>
          <nav className="hidden lg:flex items-center gap-1">
            <NavItem to="/dashboard" icon="📊">Dashboard</NavItem>
            <NavItem to="/solo" icon="🎯">Solo Study</NavItem>
            <NavItem to="/group" icon="👥">Group Study</NavItem>
            <NavItem to="/leaderboard" icon="🏆">Leaderboard</NavItem>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="btn btn-secondary w-10 h-10 rounded-xl p-0 shadow-soft hover:shadow-medium transition-all duration-200"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
          
          {/* User Greeting */}
          {name && (
            <div className="hidden sm:flex items-center gap-3 bg-gradient-to-r from-primary-50 to-accent-50 px-4 py-2 rounded-xl border border-primary-200/50">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold text-primary-700">Welcome back!</div>
                <div className="text-xs text-secondary-500">{name}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
