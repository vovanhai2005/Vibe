import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        fullName: {
            type: String,
            default: "",
        },
        dob: {
            type: String,
            default: "",
        },
        bio: {
            type: String,
            default: "",
            maxlength: 250
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String,
            default: "",
        },
        friends: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        friendRequests: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Friend"
        }]
    },
    {timestamps: true}
);
const User = mongoose.model("User", userSchema);

export default User;