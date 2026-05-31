import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

// Header component with navbar, search bar and auth buttons
const Header = ({ onMenuClick, onSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Handle search form submit
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
    setShowDropdown(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        {/* Hamburger menu button to toggle sidebar */}
        <button className="menu-btn" onClick={onMenuClick}>
          ☰
        </button>

        {/* YouTube Clone Logo */}
        <Link to="/" className="logo">
          <span className="logo-icon">▶</span>
          <span className="logo-text">YouTube</span>
        </Link>
      </div>

      {/* Search bar in center */}
      <div className="header-center">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">
            🔍
          </button>
        </form>
      </div>

      {/* Right side - auth buttons or user info */}
      <div className="header-right">
        {user ? (
          // Show user avatar and dropdown if logged in
          <div className="user-menu">
            <button
              className="avatar-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={user.avatar}
                alt={user.username}
                className="user-avatar"
              />
              <span className="username">{user.username}</span>
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
              <div className="dropdown">
                <Link
                  to={`/channel/${user.channels?.[0] || "create"}`}
                  className="dropdown-item"
                  onClick={() => setShowDropdown(false)}
                >
                  My Channel
                </Link>
                <button className="dropdown-item" onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          // Show sign in button if not logged in
          <Link to="/login" className="signin-btn">
            👤 Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
