import { Link } from "react-router-dom";
import "./VideoCard.css";

// VideoCard component - displays a single video thumbnail card
const VideoCard = ({ video }) => {
  // Format view count to show K or M
 const formatViews = (views) => {
  if (!views) return "0 views";
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K views`;
  }
  return `${views} views`;
};
  // Format date to show how long ago
  const formatDate = (date) => {
    const now = new Date();
    const uploadDate = new Date(date);
    const diffDays = Math.floor((now - uploadDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <Link to={`/video/${video._id}`} className="video-card">
      {/* Video Thumbnail */}
      <div className="thumbnail-container">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="thumbnail"
          loading="lazy"
        />
      </div>

      {/* Video Info */}
      <div className="video-info">
        {/* Channel Avatar */}
        <div className="channel-avatar">
          {video.channelId?.channelName?.[0] || "C"}
        </div>

        <div className="video-details">
          {/* Video Title */}
          <h3 className="video-title">{video.title}</h3>

          {/* Channel Name */}
          <p className="channel-name">
            {video.channelId?.channelName || "Unknown Channel"}
          </p>

          {/* Views and Date */}
          <p className="video-meta">
            {formatViews(video.views)} • {formatDate(video.uploadDate)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
