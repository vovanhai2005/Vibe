# Vibe - Real-time Messaging Application

## Introduction

Vibe is a full-stack real-time messaging application that allows users to connect with friends, send messages, and share images. Built with a modern tech stack including React, Node.js, Express, MongoDB, and Socket.io, Vibe provides a seamless and interactive user experience.

## Features

- **User Authentication**
  - Sign up with username, email and password
  - Secure login with JWT tokens
  - Persistent sessions

- **Real-time Messaging**
  - Instant message delivery
  - Online status indicators
  - Image sharing
  - Message history

- **Profile Management**
  - Customizable user profiles
  - Profile picture uploads via Cloudinary
  - Update personal information

- **Friend System**
  - Send friend requests
  - Accept or reject requests
  - View pending friend requests
  - Remove friends

- **User Discovery**
  - Search for users by username or full name
  - View user profiles
  - Add new friends

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Zustand** - State management
- **React Router** - Navigation
- **Socket.io-client** - Real-time communication
- **Axios** - API requests
- **TailwindCSS & DaisyUI** - Styling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage

## Project Structure

```
/
├── frontend/                 # Frontend React application
│   ├── public/               # Static files
│   ├── src/                  # Source code
│   │   ├── components/       # Reusable UI components
│   │   ├── lib/              # Utility functions
│   │   ├── pages/            # Page components
│   │   ├── store/            # Zustand state stores
│   │   ├── App.jsx           # Main application component
│   │   └── main.jsx          # Entry point
│   ├── vite.config.js        # Vite configuration
│   └── tailwind.config.js    # Tailwind CSS configuration
│
├── backend/                  # Backend Express application
│   ├── src/                  # Source code
│   │   ├── controllers/      # Request handlers
│   │   ├── lib/              # Utility functions
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   └── index.js          # Entry point
│   └── .env                  # Environment variables
│
└── package.json              # Root package.json for scripts
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Cloudinary account

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Vibe.git
   cd Vibe
   ```

2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=development
   ```

## Running the Application

### Development Mode

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. In a separate terminal, start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application at http://localhost:5173

### Production Mode

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Log in a user
- `POST /api/auth/logout` - Log out a user
- `GET /api/auth/check` - Check authentication status
- `PUT /api/auth/update-profile` - Update user profile

### Messages
- `GET /api/messages/users` - Get users for chat sidebar
- `GET /api/messages/users/search` - Search users
- `GET /api/messages/:id` - Get messages with a specific user
- `POST /api/messages/send/:id` - Send a message to a user

### Friends
- `POST /api/friends/request/:id` - Send a friend request
- `POST /api/friends/accept/:id` - Accept a friend request
- `POST /api/friends/reject/:id` - Reject a friend request
- `DELETE /api/friends/:id` - Remove a friend
- `GET /api/friends` - Get all friends
- `GET /api/friends/pending` - Get pending friend requests
- `GET /api/friends/search` - Search for potential friends

### Users
- `GET /api/users/:id` - Get a user by ID

## Main Features Implementation

### Real-time Communication
The application uses Socket.io for real-time features such as:
- Message delivery
- Online user status
- Friend request notifications

### State Management
Zustand is used for state management with stores for:
- Authentication (useAuthStore)
- Chat messages (useChatStore) 
- Friend management (useFriendStore)

### Image Handling
Images are stored in Cloudinary:
- Profile pictures
- Message attachments

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the ISC License.

## Contact

Project Link: [https://github.com/vovanhai2005/Vibe](https://github.com/vovanhai2005/Vibe)