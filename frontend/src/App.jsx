// Main App component - sets up routing for all pages
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Import all pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoPlayer from "./pages/VideoPlayer";
import ChannelPage from "./pages/ChannelPage";
import NotFound from "./pages/NotFound";

function App() {
  const { loading } = useAuth();

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#0f0f0f",
          color: "white",
          fontSize: "1.2rem",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Main routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/video/:id" element={<VideoPlayer />} />
        <Route path="/channel/:id" element={<ChannelPage />} />

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
