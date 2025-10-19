import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.js';
import { io , getReceiverSocketId } from '../lib/socket.js';
import Friend from '../models/friend.model.js';

export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;

        const friends = await Friend.find({
            $or: [
                { requester: userId, status: 'accepted' },
                { recipient: userId, status: 'accepted' }
            ]
        })
        .populate('requester', 'username fullName profilePicture')
        .populate('recipient', 'username fullName profilePicture');

        const friendsList = friends.map(friend => {
            const isRequester = friend.requester._id.toString() !== userId.toString();
            return isRequester ? friend.requester : friend.recipient;
        });

        const friendsWithLastMessage = await Promise.all(friendsList.map(async (friend) => {
            const lastMessage = await Message.findOne({
                $or: [
                    { senderId: userId, receiverId: friend._id},
                    { senderId: friend._id, receiverId: userId}
                ]
            })
            .sort({ createdAt: -1 })
            
            const unReadCount = await Message.coundDocuments({
                senderId: friend._id,
                receiverId: userId,
                read: false
            });

            return {
                ...user._doc,
                lastMessage,
                unReadCount,
                lastACtivity: lastMessage ? lastMessage.createdAt : new Date(0)
            };
        }));

        friendsWithLastMessage.sort((a, b) => b.lastACtivity - a.lastACtivity);

        res.status(200).json(friendsWithLastMessage);    
    } catch (error) {
        console.error("Error fetching users for sidebar:", error);
        res.status(500).json({ message: "Failed to fetch users for sidebar"});
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }
        
        // Find users matching the query in username or fullName
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { fullName: { $regex: query, $options: "i" } }
            ]
        }).select("username fullName profilePicture");
        
        res.status(200).json(users);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ],
        }).sort({ createdAt: 1 }); // Add sorting by creation time

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;

        const senderId = req.user._id;

        let imageUrl = null;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        const { friendId } = req.params;

        await Message.updateMany(
            { senderId: friendId, receiverId: userId, read: false},
            { read : true } 
        );

        res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({ message: "Failed to mark message as read" });
    }
};