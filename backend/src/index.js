import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import path from 'path';

import { connectDB } from './lib/db.js';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import friendRoutes from './routes/friend.route.js';
import userRoutes from './routes/user.route.js';
import { app, server}  from './lib/socket.js';

dotenv.config();

const PORT = process.env.PORT
const __dirname = path.resolve();

// Increase the body size limit to handle larger image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/users", userRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
    console.log('Server is running on PORT:' + PORT);
    connectDB();
});