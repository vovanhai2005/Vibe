import User from "../models/user.model.js"
import bcrypt from 'bcryptjs';
import { generateToken } from "../lib/utils.js";
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {  
    const { username, email, password } = req.body;
    try {
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }

        // Check if user already exists
        const user = await User.findOne({email})
        if (user) return res.status(400).json({ message: "User already exists." });
        
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Generate token and save user
        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                message: "User created successfully",
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePicture: newUser.profilePicture, 
            });
        }
        else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in signup controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const {username, password} = req.body;
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token
        generateToken(user._id , res);
        res.status(200).json({
            message: "Login successful",
            id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
        });

    } catch (error) {
        console.log("Error in login controller:", error.message);
        res.status(500).json({ messsage: "Internal server error"});
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log("Error in logout controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const {username, fullName, dob, bio, profilePicture} = req.body;
        const userId = req.user._id

        const updateData = {};
        if (username) updateData.username = username;
        if (fullName != undefined) updateData.fullName = fullName;
        if (dob != undefined) updateData.dob = dob;
        if (bio != undefined) updateData.bio = bio;
        if (profilePicture && profilePicture.startsWith("data:")) {
            const uploadResponse = await cloudinary.uploader.upload(profilePicture)
            updateData.profilePicture = uploadResponse.secure_url;
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in updateProfile controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};