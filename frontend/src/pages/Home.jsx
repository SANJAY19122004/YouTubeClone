import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import { API_URL } from "../context/AuthContext";
import "./Home.css";

// Filter categories for the filter buttons
const CATEGORIES = [
  "All",
  "Web Development",
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "Data Science",
  "Gaming",
  "Music",
  "News",
];

// Home page - displays video grid with filters and search
const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  // Fetch videos when category or search changes
  useEffect(() => {
    fetchVideos();
  }, [activeCategory, searchQuery]);

  // Check URL params for category filter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    if (cat) setActiveCategory(cat);
  }, [location.search]);

  // Fetch videos from backend API
 const fetchVideos = async () => {
   try {
     setLoading(true);
     setError(null);

     // Build query params for search and category
     const params = new URLSearchParams();
     if (activeCategory !== "All") params.append("category", activeCategory);
     if (searchQuery.trim()) params.append("search", searchQuery.trim());

     const res = await axios.get(`${API_URL}/videos?${params.toString()}`);
     setVideos(res.data.videos);
   } catch (err) {
     setError("Failed to load videos. Please try again.");
   } finally {
     setLoading(false);
   }
 };

  // Handle search from header
  const handleSearch = (query) => {
    setSearchQuery(query);
    setActiveCategory("All");
  };

  // Handle category filter click
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSearchQuery("");
  };

  return (
    <div className="home-page">
      {/* Header with search */}
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onSearch={handleSearch}
      />

      <div className="home-body">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Main content */}
        <main
          className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
        >
          {/* Category Filter Buttons */}
          <div className="filter-bar">
            {CATEGORIES.map((cat) => {
              // Count videos in each category
              const count =
                cat === "All"
                  ? videos.length
                  : videos.filter((v) => v.category === cat).length;

              return (
                <button
                  key={cat}
                  className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                  {count > 0 && <span className="filter-count">{count}</span>}
                </button>
              );
            })}
          </div>

          {/* Loading state */}
          {loading && <div className="loading">Loading videos...</div>}

          {/* Error state */}
          {error && <div className="error-message">{error}</div>}

          {/* No results */}
          {!loading && !error && videos.length === 0 && (
            <div className="no-results">
              No videos found for "{searchQuery || activeCategory}"
            </div>
          )}

          {/* Video Grid */}
          {!loading && !error && videos.length > 0 && (
            <div className="videos-grid">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
