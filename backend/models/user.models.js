import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            trim: true,
            minlength: [3, 'Username must be at least 3 characters long'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
        },
        // Required to store the token generated during login
        refreshToken: {
            type: String,
        }
    },
    { timestamps: true }
);

// HOOKS
userSchema.pre("save", async function (next) {
    // If the password field hasn't been updated, exit the function early
    if (!this.isModified("password")) return 

    // Safely hash the incoming raw string password using 10 salt rounds
    this.password = await bcrypt.hash(this.password, 10);
});

// METHODS
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password); // Explicit async resolution
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET || "aiReviewerSuperSecretAccessTokenKey2026", // Fallback string
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" // Fallback expiry
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET || "aiReviewerSuperSecretRefreshTokenKey2026", // Fallback string
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d" // Fallback expiry
        }
    );
};

const User = mongoose.model("User", userSchema);
export default User;