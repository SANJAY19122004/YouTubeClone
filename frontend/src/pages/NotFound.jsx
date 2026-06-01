import { Link, useLocation } from "react-router-dom";
import "./NotFound.css";

// 404 Not Found page
const NotFound = () => {
  const location = useLocation();

  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <span className="notfound-icon">▶</span>
        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">Page not found</h2>
        <p className="notfound-url">
          The page <code>{location.pathname}</code> could not be found.
        </p>
        <Link to="/" className="notfound-btn">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
