# Virtual Study Room — Smart Study Hub (Final Build)

A modern web application for solo and group study sessions with features like timers, task management, leaderboards, and AI chat assistance.

## Features

- **Welcome Page**: Clean, modern UI with name entry
- **Dashboard**: Overview with options for solo study, group study, and leaderboard
- **Solo Study**: 
  - 30-minute study timer (customizable)
  - Task management
  - AI chatbot assistance
- **Group Study**:
  - Create or join study rooms with unique codes
  - Audio/video communication
  - Screen sharing
  - Push-to-talk functionality
  - Group chat and individual AI chat
- **Leaderboard**: Track study time, completed tasks, and earn badges

## Running the Application

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Client Setup
```
cd client
npm install
npm run dev
```

### Server Setup
```
cd server
npm install
npm start
```

## Testing Across Multiple Systems

To test the group study functionality across multiple systems:

1. **Deploy the server**:
   - Ensure the server is running on a machine accessible to all participants
   - Update the `VITE_SIGNALING_SERVER` in the client's `.env` file to point to the server's IP/hostname

2. **Connect from multiple clients**:
   - Each participant should run the client application
   - Create a study room on one client and share the room code
   - Other participants can join using the room code
