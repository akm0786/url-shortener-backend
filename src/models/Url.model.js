import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
        trim: true
    },
    shortCode: {
        type: String,
        required: true,
        unique: true,
        index: true //to speed up queries
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, //It tells Mongoose to expect a unique 24-character ID (like 65a123bc456...) that MongoDB automatically generates for every document.
        ref: "User",
        required: true,
        index: true 
    },
    clicks: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Url = mongoose.model("Url", urlSchema);
export default Url;