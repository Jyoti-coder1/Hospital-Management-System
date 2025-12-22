const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        comments: {
            type: String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);