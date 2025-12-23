const express = require("express");
const router = express.Router();

const {
    submitFeedback,
    getFeedbackForDoctor,
    getFeedbackByPatient
} = require("../controllers/feedback.controller");

const protect = require("../middleware/auth.middleware");
const permit = require("../middleware/rbac.middleware");

// Patient submits feedback
router.post("/", protect, permit("patient"), submitFeedback);

// Get feedback submitted by patient
router.get("/patient/:patientId", protect, permit("patient"), getFeedbackByPatient);

// Get all feedback for a doctor
router.get("/:doctorId", protect, permit("doctor", "admin"), getFeedbackForDoctor);

module.exports = router;