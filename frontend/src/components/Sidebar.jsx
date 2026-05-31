import { Link } from "react-router-dom";
import "./Sidebar.css";

// Sidebar component - toggleable from hamburger menu
const Sidebar = ({ isOpen }) => {
  // Sidebar navigation items
  const mainLinks = [
    { icon: "🏠", label: "Home", path: "/" },
    { icon: "🔥", label: "Trending", path: "/" },
    { icon: "📺", label: "Subscriptions", path: "/" },
  ];

  const exploreLinks = [
    { icon: "🎵", label: "Music", path: "/?category=Music" },
    { icon: "🎮", label: "Gaming", path: "/?category=Gaming" },
    { icon: "📰", label: "News", path: "/?category=News" },
    { icon: "🏆", label: "Sports", path: "/" },
    { icon: "🎬", label: "Movies", path: "/" },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Main navigation links */}
      <div className="sidebar-section">
        {mainLinks.map((link) => (
          <Link key={link.label} to={link.path} className="sidebar-link">
            <span className="sidebar-icon">{link.icon}</span>
            {/* Only show label when sidebar is open */}
            {isOpen && <span className="sidebar-label">{link.label}</span>}
          </Link>
        ))}
      </div>

      <div className="sidebar-divider" />

      {/* Explore section */}
      {isOpen && (
        <div className="sidebar-section">
          <p className="sidebar-title">Explore</p>
          {exploreLinks.map((link) => (
            <Link key={link.label} to={link.path} className="sidebar-link">
              <span className="sidebar-icon">{link.icon}</span>
              <span className="sidebar-label">{link.label}</span>
            </Link>
          ))}
        </div>
      )}

      {!isOpen && (
        <div className="sidebar-section">
          {exploreLinks.map((link) => (
            <Link key={link.label} to={link.path} className="sidebar-link">
              <span className="sidebar-icon">{link.icon}</span>
            </Link>
          ))}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
