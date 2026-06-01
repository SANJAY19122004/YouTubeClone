import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../context/AuthContext";
import Header from "../components/Header";
import "./ChannelPage.css";

// Channel page - shows channel info and videos with CRUD
const ChannelPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Channel state
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create channel form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channelDesc, setChannelDesc] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  // Upload video form state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoCategory, setVideoCategory] = useState("All");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Edit video state
  const [editingVideo, setEditingVideo] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // Categories list
  const categories = [
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

  useEffect(() => {
    // If id is "create" show create channel form
    if (id === "create") {
      setLoading(false);
      setShowCreateForm(true);
    } else {
      fetchChannel();
    }
  }, [id]);

  // Fetch channel details from backend
  const fetchChannel = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/channels/${id}`);
      setChannel(res.data.channel);
    } catch (err) {
      setError("Channel not found");
    } finally {
      setLoading(false);
    }
  };

  // Handle create channel form submit
  const handleCreateChannel = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (!channelName.trim()) {
      setCreateError("Channel name is required");
      return;
    }

    try {
      setCreateLoading(true);
      const res = await axios.post(`${API_URL}/channels`, {
        channelName,
        description: channelDesc,
      });

      // Redirect to new channel page
      navigate(`/channel/${res.data.channel._id}`);
    } catch (err) {
      setCreateError(err.response?.data?.message || "Failed to create channel");
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle upload video form submit
  const handleUploadVideo = async (e) => {
    e.preventDefault();
    setUploadError("");

    if (!videoTitle || !videoUrl || !thumbnailUrl) {
      setUploadError("Title, video URL and thumbnail URL are required");
      return;
    }

    try {
      setUploadLoading(true);
      const res = await axios.post(`${API_URL}/videos`, {
        title: videoTitle,
        description: videoDesc,
        videoUrl,
        thumbnailUrl,
        channelId: channel._id,
        category: videoCategory,
      });

      // Add new video to channel state
      setChannel({
        ...channel,
        videos: [res.data.video, ...channel.videos],
      });

      // Reset form
      setShowUploadForm(false);
      setVideoTitle("");
      setVideoDesc("");
      setVideoUrl("");
      setThumbnailUrl("");
      setVideoCategory("All");
    } catch (err) {
      setUploadError(err.response?.data?.message || "Failed to upload video");
    } finally {
      setUploadLoading(false);
    }
  };

  // Handle edit video save
  const handleEditVideo = async (videoId) => {
    try {
      const res = await axios.put(`${API_URL}/videos/${videoId}`, {
        title: editTitle,
        description: editDesc,
      });

      // Update video in channel state
      setChannel({
        ...channel,
        videos: channel.videos.map((v) =>
          v._id === videoId ? { ...v, ...res.data.video } : v,
        ),
      });
      setEditingVideo(null);
    } catch (err) {
      console.error("Failed to edit video");
    }
  };

  // Handle delete video
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await axios.delete(`${API_URL}/videos/${videoId}`);
      // Remove video from channel state
      setChannel({
        ...channel,
        videos: channel.videos.filter((v) => v._id !== videoId),
      });
    } catch (err) {
      console.error("Failed to delete video");
    }
  };

  // Check if logged in user owns this channel
  const isOwner = user && channel && channel.owner?._id === user.id;

  if (loading) {
    return (
      <div className="channel-page">
        <Header onMenuClick={() => {}} onSearch={() => {}} />
        <div className="channel-loading">Loading channel...</div>
      </div>
    );
  }

  // Show create channel form
  if (showCreateForm) {
    return (
      <div className="channel-page">
        <Header onMenuClick={() => {}} onSearch={() => {}} />
        <div className="create-channel-wrapper">
          <div className="create-channel-card">
            <h2>How you'll appear</h2>
            <div className="channel-avatar-preview">👤</div>
            <p className="avatar-hint">Select picture</p>

            {createError && <div className="form-error">{createError}</div>}

            <form onSubmit={handleCreateChannel}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Channel name"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="channel-input"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="Describe your channel"
                  value={channelDesc}
                  onChange={(e) => setChannelDesc(e.target.value)}
                  className="channel-input"
                />
              </div>
              <div className="create-channel-actions">
                <Link to="/" className="cancel-link">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="create-channel-btn"
                  disabled={createLoading}
                >
                  {createLoading ? "Creating..." : "Create channel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="channel-page">
        <Header onMenuClick={() => {}} onSearch={() => {}} />
        <div className="channel-error">
          <h2>{error}</h2>
          <Link to="/" className="back-btn">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="channel-page">
      <Header onMenuClick={() => {}} onSearch={() => {}} />

      {/* Channel Banner */}
      <div
        className="channel-banner"
        style={{
          backgroundImage: channel.channelBanner
            ? `url(${channel.channelBanner})`
            : "linear-gradient(135deg, #1a1a2e, #16213e)",
        }}
      />

      {/* Channel Info */}
      <div className="channel-info">
        <div className="channel-avatar-large">{channel.channelName?.[0]}</div>
        <div className="channel-details">
          <h1 className="channel-name">{channel.channelName}</h1>
          <p className="channel-owner">@{channel.owner?.username}</p>
          <p className="channel-stats">
            {channel.subscribers.toLocaleString()} subscribers •{" "}
            {channel.videos?.length} videos
          </p>
          <p className="channel-desc">{channel.description}</p>
        </div>

        {/* Upload video button for channel owner */}
        {isOwner && (
          <button
            className="upload-btn"
            onClick={() => setShowUploadForm(!showUploadForm)}
          >
            + Upload Video
          </button>
        )}
      </div>

      {/* Upload Video Form */}
      {isOwner && showUploadForm && (
        <div className="upload-form-wrapper">
          <div className="upload-form">
            <h3>Upload New Video</h3>
            {uploadError && <div className="form-error">{uploadError}</div>}
            <form onSubmit={handleUploadVideo}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  placeholder="Video title"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="channel-input"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Video description"
                  value={videoDesc}
                  onChange={(e) => setVideoDesc(e.target.value)}
                  className="channel-input"
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Video URL *</label>
                <input
                  type="text"
                  placeholder="https://example.com/video.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="channel-input"
                />
              </div>
              <div className="form-group">
                <label>Thumbnail URL *</label>
                <input
                  type="text"
                  placeholder="https://example.com/thumbnail.jpg"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="channel-input"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={videoCategory}
                  onChange={(e) => setVideoCategory(e.target.value)}
                  className="channel-input"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="upload-form-actions">
                <button
                  type="button"
                  className="cancel-upload-btn"
                  onClick={() => setShowUploadForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="create-channel-btn"
                  disabled={uploadLoading}
                >
                  {uploadLoading ? "Uploading..." : "Upload Video"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Videos Section */}
      <div className="channel-videos-section">
        <h2>Videos</h2>

        {channel.videos?.length === 0 ? (
          <p className="no-videos">No videos uploaded yet.</p>
        ) : (
          <div className="channel-videos-grid">
            {channel.videos?.map((video) => (
              <div key={video._id} className="channel-video-card">
                {/* Thumbnail */}
                <Link to={`/video/${video._id}`}>
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="channel-video-thumb"
                    loading="lazy"
                  />
                </Link>

                {/* Video Info */}
                {editingVideo === video._id ? (
                  // Edit mode
                  <div className="edit-video-form">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="channel-input"
                      placeholder="Video title"
                    />
                    <textarea
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="channel-input"
                      placeholder="Description"
                      rows={2}
                    />
                    <div className="edit-video-actions">
                      <button
                        className="create-channel-btn"
                        onClick={() => handleEditVideo(video._id)}
                      >
                        Save
                      </button>
                      <button
                        className="cancel-upload-btn"
                        onClick={() => setEditingVideo(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display mode
                  <div className="channel-video-info">
                    <h3 className="channel-video-title">{video.title}</h3>
                    <p className="channel-video-views">{video.views} views</p>

                    {/* Edit and Delete for owner */}
                    {isOwner && (
                      <div className="video-owner-actions">
                        <button
                          className="video-edit-btn"
                          onClick={() => {
                            setEditingVideo(video._id);
                            setEditTitle(video.title);
                            setEditDesc(video.description);
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="video-delete-btn"
                          onClick={() => handleDeleteVideo(video._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelPage;
