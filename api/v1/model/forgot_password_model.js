const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
    { 
        email: String,
        otp: String,
        expireAt: {
            type: Date,
            expires: 300
        }
    }, 
    {
        timestamps: true
    }
);

const forgotPassword = mongoose.model("forgotPassword", forgotPasswordSchema, "forgot_password");

module.exports = forgotPassword;