const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true, // ✅ fixed
    },
    password: {
        type: String,
        required: true, // ✅ make password required too
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("user", userSchema);
