const Feedback = require("../models/Feedback.model");
const createNotification = require("../utils/createNotification");

// @desc Submit feedback
// @route POST /api/feedback
// @access Patient
const submitFeedback = async (req, res) => {
    try {
        const { patient, doctor, rating, comments } = req.body;

        const feedback = await Feedback.create({
            patient,
            doctor,
            rating,
            comments
        });

        await createNotification(
            doctor,
            "New feedback received"
        );
        res.status(201).json({ success: true, feedback });
    } catch (error) {
        console.error("SUBMIT FEEDBACK ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Get all feedback for a doctor
// @route GET /api/feedback/:doctorId
// @access Doctor / Admin
const getFeedbackForDoctor = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ doctor: req.params.doctorId })
            .populate("patient", "user")
            .sort({ createdAt: -1 });

        res.json({ success: true, feedbacks });
    } catch (error) {
        console.error("GET FEEDBACK FOR DOCTOR ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Get feedback submitted by a patient
// @route GET /api/feedback/patient/:patientId
// @access Patient
const getFeedbackByPatient = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ patient: req.params.patientId })
            .populate("doctor", "name email role")
            .sort({ createdAt: -1 });

        res.json({ success: true, feedbacks });
    } catch (error) {
        console.error("GET FEEDBACK BY PATIENT ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    submitFeedback,
    getFeedbackForDoctor,
    getFeedbackByPatient
};