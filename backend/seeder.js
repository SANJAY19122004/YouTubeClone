import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Channel from "./models/Channel.js";
import Video from "./models/Video.js";

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany();
    await Channel.deleteMany();
    await Video.deleteMany();
    console.log("Existing data cleared");

    // Create sample users
    const hashedPassword = await bcrypt.hash("password123", 10);

    const user1 = await User.create({
      username: "JohnDoe",
      email: "john@example.com",
      password: hashedPassword,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    });

    const user2 = await User.create({
      username: "JaneSmith",
      email: "jane@example.com",
      password: hashedPassword,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    });

    console.log("Users created");

    // Create sample channels
    const channel1 = await Channel.create({
      channelName: "Code with John",
      owner: user1._id,
      description: "Coding tutorials and tech reviews by John Doe.",
      channelBanner: "https://picsum.photos/seed/channel1/1200/300",
      subscribers: 5200,
    });

    const channel2 = await Channel.create({
      channelName: "Jane Explains",
      owner: user2._id,
      description: "Simple explanations of complex topics.",
      channelBanner: "https://picsum.photos/seed/channel2/1200/300",
      subscribers: 3100,
    });

    // Add channels to users
    user1.channels.push(channel1._id);
    user2.channels.push(channel2._id);
    await user1.save();
    await user2.save();

    console.log("Channels created");

    // Create sample videos
    const videos = [
      {
        title: "Learn React in 30 Minutes",
        description:
          "A quick tutorial to get started with React hooks and components.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://picsum.photos/seed/react/480/270",
        channelId: channel1._id,
        uploader: user1._id,
        category: "React",
        views: 15200,
      },
      {
        title: "React Hooks Complete Guide",
        description:
          "Master useState useEffect useContext and custom hooks in React.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://picsum.photos/seed/reacthooks/480/270",
        channelId: channel1._id,
        uploader: user1._id,
        category: "React",
        views: 19800,
      },
      {
        title: "JavaScript ES6 Features Explained",
        description:
          "Learn all the modern JavaScript ES6 features with examples.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://picsum.photos/seed/js/480/270",
        channelId: channel1._id,
        uploader: user1._id,
        category: "JavaScript",
        views: 22400,
      },
      {
        title: "JavaScript Promises and Async Await",
        description:
          "Understand asynchronous JavaScript with promises and async await.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://picsum.photos/seed/jsasync/480/270",
        channelId: channel1._id,
        uploader: user1._id,
        category: "JavaScript",
        views: 17600,
      },
      {
        title: "Node.js Crash Course for Beginners",
        description:
          "Build your first Node.js server and REST API from scratch.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://picsum.photos/seed/node/480/270",
        channelId: channel1._id,
        uploader: user1._id,
        category: "Node.js",
        views: 18900,
      },
      {
        title: "Node.js with Express REST API",
        description:
          "Build a complete REST API with Node.js Express and MongoDB.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://picsum.photos/seed/nodeexpress/480/270",
        channelId: channel1._id,
        uploader: user1._id,
        category: "Node.js",
        views: 24100,
      },
      {
        title: "Python for Data Science",
        description: "Get started with Python programming for data analysis.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://picsum.photos/seed/python/480/270",
        channelId: channel2._id,
        uploader: user2._id,
        category: "Python",
        views: 31000,
      },
      {
        title: "Python Django Web Framework",
        description: "Build web applications with Python Django framework.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://picsum.photos/seed/django/480/270",
        channelId: channel2._id,
        uploader: user2._id,
        category: "Python",
        views: 27500,
      },
      {
        title: "Web Development Full Course 2024",
        description:
          "Complete web development course covering HTML CSS and JavaScript.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://picsum.photos/seed/webdev/480/270",
        channelId: channel2._id,
        uploader: user2._id,
        category: "Web Development",
        views: 45000,
      },
      {
        title: "CSS Flexbox and Grid Complete Guide",
        description: "Master CSS layout with Flexbox and Grid from scratch.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://picsum.photos/seed/css/480/270",
        channelId: channel2._id,
        uploader: user2._id,
        category: "Web Development",
        views: 33000,
      },
      {
        title: "Data Science Roadmap 2024",
        description: "Complete roadmap to becoming a data scientist in 2024.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://picsum.photos/seed/datascience/480/270",
        channelId: channel2._id,
        uploader: user2._id,
        category: "Data Science",
        views: 28000,
      },
      {
        title: "Machine Learning with Python",
        description:
          "Build your first machine learning model with Python and scikit-learn.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://picsum.photos/seed/ml/480/270",
        channelId: channel2._id,
        uploader: user2._id,
        category: "Data Science",
        views: 41000,
      },
      {
        title: "Top 10 Gaming Moments of 2024",
        description: "The most epic gaming moments compiled from 2024.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://picsum.photos/seed/gaming/480/270",
        channelId: channel1._id,
        uploader: user1._id,
        category: "Gaming",
        views: 67000,
      },
      {
        title: "Best Gaming Setup Tour 2024",
        description:
          "Tour of the ultimate gaming setup with RGB and dual monitors.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://picsum.photos/seed/gamingsetup/480/270",
        channelId: channel1._id,
        uploader: user1._id,
        category: "Gaming",
        views: 52000,
      },
      {
        title: "Relaxing Music for Coding",
        description: "Lo-fi music playlist to help you focus while coding.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://picsum.photos/seed/music/480/270",
        channelId: channel2._id,
        uploader: user2._id,
        category: "Music",
        views: 89000,
      },
      {
        title: "Top Music Hits of 2024",
        description: "Collection of the most popular music hits from 2024.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://picsum.photos/seed/musichits/480/270",
        channelId: channel2._id,
        uploader: user2._id,
        category: "Music",
        views: 120000,
      },
      {
        title: "Tech News Weekly Roundup",
        description: "Latest technology news and updates from this week.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://picsum.photos/seed/news/480/270",
        channelId: channel1._id,
        uploader: user1._id,
        category: "News",
        views: 14000,
      },
      {
        title: "AI News - Latest Developments",
        description: "Biggest AI developments and news from the tech world.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://picsum.photos/seed/ainews/480/270",
        channelId: channel1._id,
        uploader: user1._id,
        category: "News",
        views: 21000,
      },
    ];
    // Insert all videos
    const createdVideos = await Video.insertMany(videos);
    console.log("Videos created");

    // Add videos to channels
    const channel1Videos = createdVideos
      .filter((v) => v.channelId.toString() === channel1._id.toString())
      .map((v) => v._id);

    const channel2Videos = createdVideos
      .filter((v) => v.channelId.toString() === channel2._id.toString())
      .map((v) => v._id);

    channel1.videos = channel1Videos;
    channel2.videos = channel2Videos;
    await channel1.save();
    await channel2.save();

    console.log("✅ Database seeded successfully!");
    console.log("-----------------------------------");
    console.log("Test Login Credentials:");
    console.log("Email: john@example.com");
    console.log("Password: password123");
    console.log("-----------------------------------");

    mongoose.disconnect();
  } catch (err) {
    console.error("Seeder error:", err.message);
    process.exit(1);
  }
};

seedDatabase();
