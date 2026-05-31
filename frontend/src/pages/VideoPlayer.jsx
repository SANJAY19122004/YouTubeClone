import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../context/AuthContext";
import Header from "../components/Header";
import "./VideoPlayer.css";

// VideoPlayer page - shows video with comments and like/dislike
const VideoPlayer = () => {
  const { id } = useParams();
  const { user } = useAuth();

  // Video state
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comment states
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // Like/dislike states
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  // Fetch video on mount
  useEffect(() => {
    fetchVideo();
    fetchComments();
  }, [id]);

  // Fetch video details from backend
  const fetchVideo = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/videos/${id}`);
      setVideo(res.data.video);
      setLikes(res.data.video.likes.length);
      setDislikes(res.data.video.dislikes.length);

      // Check if current user liked or disliked
      if (user) {
        setLiked(res.data.video.likes.includes(user.id));
        setDisliked(res.data.video.dislikes.includes(user.id));
      }
    } catch (err) {
      setError("Failed to load video");
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments for this video
  const fetchComments = async () => {
    try {
      const res = await axios.get(`${API_URL}/comments/${id}`);
      setComments(res.data.comments);
    } catch (err) {
      console.error("Failed to load comments");
    }
  };

  // Handle like button click
  const handleLike = async () => {
    if (!user) {
      alert("Please sign in to like videos");
      return;
    }
    try {
      const res = await axios.put(`${API_URL}/videos/${id}/like`);
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
      setLiked(!liked);
      setDisliked(false);
    } catch (err) {
      console.error("Failed to like video");
    }
  };

  // Handle dislike button click
  const handleDislike = async () => {
    if (!user) {
      alert("Please sign in to dislike videos");
      return;
    }
    try {
      const res = await axios.put(`${API_URL}/videos/${id}/dislike`);
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
      setDisliked(!disliked);
      setLiked(false);
    } catch (err) {
      console.error("Failed to dislike video");
    }
  };

  // Handle add new comment
  const handleAddComment = async () => {
    if (!user) {
      alert("Please sign in to comment");
      return;
    }
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const res = await axios.post(`${API_URL}/comments`, {
        videoId: id,
        text: newComment,
      });
      // Add new comment to top of list
      setComments([res.data.comment, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  // Handle edit comment
  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;
    try {
      const res = await axios.put(`${API_URL}/comments/${commentId}`, {
        text: editText,
      });
      // Update comment in list
      setComments(
        comments.map((c) => (c._id === commentId ? res.data.comment : c)),
      );
      setEditingComment(null);
      setEditText("");
    } catch (err) {
      console.error("Failed to edit comment");
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${API_URL}/comments/${commentId}`);
      // Remove comment from list
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment");
    }
  };

  // Format view count
  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views;
  };

  if (loading) {
    return (
      <div className="vp-page">
        <Header onMenuClick={() => {}} onSearch={() => {}} />
        <div className="vp-loading">Loading video...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vp-page">
        <Header onMenuClick={() => {}} onSearch={() => {}} />
        <div className="vp-error">
          <h2>{error}</h2>
          <Link to="/" className="back-btn">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="vp-page">
      {/* Header */}
      <Header onMenuClick={() => {}} onSearch={() => {}} />

      <div className="vp-content">
        {/* Left - Video Player Section */}
        <div className="vp-main">
          {/* Video Player */}
          <div className="video-player-wrapper">
            <video
              src={video.videoUrl}
              controls
              className="video-player"
              poster={video.thumbnailUrl}
            />
          </div>

          {/* Video Title */}
          <h1 className="vp-title">{video.title}</h1>

          {/* Channel info and like/dislike */}
          <div className="vp-meta">
            <div className="vp-channel-info">
              <div className="vp-channel-avatar">
                {video.channelId?.channelName?.[0] || "C"}
              </div>
              <div>
                <p className="vp-channel-name">
                  {video.channelId?.channelName}
                </p>
                <p className="vp-views">{formatViews(video.views)} views</p>
              </div>
            </div>

            {/* Like and Dislike Buttons */}
            <div className="vp-actions">
              <button
                className={`action-btn ${liked ? "active" : ""}`}
                onClick={handleLike}
              >
                👍 {likes}
              </button>
              <button
                className={`action-btn ${disliked ? "active" : ""}`}
                onClick={handleDislike}
              >
                👎 {dislikes}
              </button>
            </div>
          </div>

          {/* Video Description */}
          <div className="vp-description">
            <p>{video.description}</p>
          </div>

          {/* Comments Section */}
          <div className="comments-section">
            <h2>{comments.length} Comments</h2>

            {/* Add Comment Input */}
            {user ? (
              <div className="add-comment">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="comment-avatar"
                />
                <div className="comment-input-wrapper">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="comment-input"
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                  />
                  <button
                    className="comment-submit-btn"
                    onClick={handleAddComment}
                    disabled={commentLoading}
                  >
                    {commentLoading ? "Posting..." : "Comment"}
                  </button>
                </div>
              </div>
            ) : (
              <p className="signin-to-comment">
                <Link to="/login">Sign in</Link> to add a comment
              </p>
            )}

            {/* Comments List */}
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <img
                    src={comment.userId?.avatar}
                    alt={comment.userId?.username}
                    className="comment-avatar"
                  />
                  <div className="comment-body">
                    <div className="comment-header">
                      <span className="comment-username">
                        {comment.userId?.username}
                      </span>
                      <span className="comment-time">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Edit mode or display mode */}
                    {editingComment === comment._id ? (
                      <div className="edit-comment">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="comment-input"
                        />
                        <div className="edit-actions">
                          <button
                            className="comment-submit-btn"
                            onClick={() => handleEditComment(comment._id)}
                          >
                            Save
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={() => setEditingComment(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="comment-text">{comment.text}</p>
                    )}

                    {/* Edit and Delete buttons for own comments */}
                    {user && user.id === comment.userId?._id && (
                      <div className="comment-actions">
                        <button
                          className="comment-action-btn"
                          onClick={() => {
                            setEditingComment(comment._id);
                            setEditText(comment.text);
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="comment-action-btn delete"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
