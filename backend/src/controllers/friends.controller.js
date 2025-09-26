import User from "../models/user.model.js";
import Friend from "../models/friend.model.js";
import { getIO } from '../lib/socket.js';

export const sendFriendRequest = async (req, res) => {
    try {
        const { id: recipientId } = req.params;
        const requesterId = req.user._id;

        // Validate IDs
        if (!recipientId || !requesterId) {
            return res.status(400).json({ message: "Invalid request parameters" });
        }

        if (requesterId.toString() === recipientId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself." });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check for existing request with consistent field names
        const existingRequest = await Friend.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        });
        
        if (existingRequest) {
            if (existingRequest.status === "pending") {
                if (existingRequest.requester.toString() === requesterId.toString()) {
                    return res.status(400).json({ message: "You already sent a request to this user" });
                } else {
                    // If the other user already sent a request, accept it
                    existingRequest.status = "accepted";
                    await existingRequest.save();
                    
                    // Add each user to the other's friends list
                    await User.findByIdAndUpdate(requesterId, { $addToSet: { friends: recipientId } });
                    await User.findByIdAndUpdate(recipientId, { $addToSet: { friends: requesterId } });
                    
                    return res.status(200).json({ message: "Friend request accepted" });
                }
            } else if (existingRequest.status === "accepted") {
                return res.status(400).json({ message: "You are already friends with this user" });
            }
        }

        // Create new friend request
        const newFriendRequest = new Friend({
            requester: requesterId,
            recipient: recipientId,
            status: "pending"
        });
        await newFriendRequest.save();

        // Add friend request to recipient's list
        await User.findByIdAndUpdate(recipientId, { $addToSet: { friendRequests: newFriendRequest._id } });

        // Get requester data to send in notification
        const requesterData = await User.findById(requesterId).select("username fullName profilePicture");
        
        // Send socket notification with proper data
        const io = getIO();
        io.to(recipientId.toString()).emit("friendRequest", {
            requester: requesterData,
            requestId: newFriendRequest._id
        });

        res.status(200).json({ message: "Friend request sent" });

    } catch (error) {
        console.error("Friend request error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const acceptFriendRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params;
        const userId = req.user._id;
        
        const friendRequest = await Friend.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (friendRequest.recipient.toString() != userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to accept this request" });
        }

        if (friendRequest.status !== "pending") {
            return res.status(400).json({ message: "This request is not pending" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        await User.findByIdAndUpdate(userId, { $addToSet: { friends: friendRequest.requester }});
        await User.findByIdAndUpdate(friendRequest.requester, { $addToSet: { friends: userId }});
        
        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const rejectFriendRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params;
        const userId = req.user._id;

        const friendRequest = await Friend.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (friendRequest.recipient.toString() != userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to reject this request" });
        }

        if (friendRequest.status !== "pending") {
            return res.status(400).json({ message: "This request is not pending" });
        }

        // Delete the friend request document instead of updating its status
        await Friend.findByIdAndDelete(requestId);

        // Remove the request from user's friendRequests array
        await User.findByIdAndUpdate(userId, { $pull: { friendRequests: friendRequest._id }});

        res.status(200).json({ message: "Friend request rejected" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const removeFriend = async (req, res) => {
    try {
        const { id: friendId } = req.params;
        const userId = req.user._id;

        await User.findByIdAndUpdate(userId, {$pull: { friends: friendId}});
        await User.findByIdAndUpdate(friendId, {$pull: { friends: userId}});

        await Friend.findOneAndDelete({
            $or: [
                { requester: userId, recipient: friendId, status: "accepted" },
                { requester: friendId, recipient: userId, status: "accepted" }
            ]
        });

        res.status(200).json({ message: "Friend removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getFriends = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).populate({
            path: "friends",
            select: "username fullName profilePicture email"
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.friends);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getPendingRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).populate({
            path: "friendRequests",
            match: { status: "pending" },
            populate: { 
                path: "requester",
                select: "username fullName profilePicture email"
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const incomingRequests = user.friendRequests.filter(req => req.recipient.toString() === userId.toString());

        // Corrected: Return only the incoming friend requests
        res.status(200).json(incomingRequests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
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
    console.error("Search error:", error);
    res.status(500).json({ error: "Server error" });
  }
};