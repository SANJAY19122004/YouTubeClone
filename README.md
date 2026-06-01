# YouTubeClone

A full-stack YouTube clone built with the MERN stack (MongoDB, Express, React, Node.js).

## Repo Link

https://github.com/SANJAY19122004/YouTubeClone

## Features

### Frontend
- YouTube-like home page with video grid
- Sidebar with toggle from hamburger menu
- Filter buttons by category (at least 6)
- Search videos by title from header
- User registration and login with JWT
- Video player page with like and dislike
- Comments section with add, edit, delete
- Channel page with create channel
- Upload, edit and delete videos from channel
- 404 Not Found page
- Fully responsive design

### Backend
- REST API with Node.js and Express
- MongoDB database with 4 collections
- JWT authentication and protected routes
- Video, Channel, Comment CRUD operations
- Search and filter API support

## Tech Stack

- Frontend: React 18, Vite, React Router, Axios
- Backend: Node.js, Express.js
- Database: MongoDB Atlas + Mongoose
- Auth: JWT + bcryptjs
- Styling: Plain CSS

## Project Structure

YouTubeClone/
|-- backend/
│   |-- middleware/
│   │   |-- authMiddlewarejs
│   |-- models/
│   │   |-- User.js
│   │   |-- Channel.js
│   │   |-- Video.js
│   │   |-- Comment.js
│   |-- routes/
│   │   |-- authRoutes.js
│   │   |-- videoRoutes.js
│   │   |-- channelRoutes.js
│   │   |-- channelRoutes.js
│   │   |-- commentRoutes.js
│   |-- index.js
│   |-- seeder.js
│   |-- package.json
|-- frontend/
|-- src/
│   |-- components/
│   │   |-- Header.jsx
│   │   |-- Sidebar.jsx
│   │   |-- VideoCard.jsx
│   |-- context/
│   │   |-- AuthContext.jsx
│   |-- pages/
│   │   |-- Home.jsx
│   │   |-- Login.jsx
│   │   |-- Register.jsx
│   │   |-- VideoPlayer.jsx
│   │   |-- ChannelPage.jsx
│   │   |-- NotFound.jsx
│   |-- App.jsx
│   |-- main.jsx
|-- package.json

## How to Run

Make sure Node.js is installed.

### Backend Setup

1. Go to backend folder:
bash
   cd backend


2. Install packages:
bash
   npm install


3. Create `.env` file:

PORT=5000
MONGO_URI=mongodb://sanjay:sanjay191204@ac-s4mqzcf-shard-00-00.cobsis9.mongodb.net:27017,ac-s4mqzcf-shard-00-01.cobsis9.mongodb.net:27017,ac-s4mqzcf-shard-00-02.cobsis9.mongodb.net:27017/?ssl=true&replicaSet=atlas-9x2elt-shard-0&authSource=admin&appName=Cluster0&dbName=youtubeclone
JWT_SECRET=youtubeclone_secret_key_2024

4. Seed the database with sample data:
```bash
   node seeder.js
```

5. Start backend server:
```bash
   node index.js
```

### Frontend Setup

1. Open new terminal and go to frontend folder:
bash
   cd frontend


2. Install packages:
bash
   npm install


3. Start frontend:
bash
   npm run dev


4. Open `http://localhost:5173` in your browser

