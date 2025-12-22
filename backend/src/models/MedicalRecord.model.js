const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    diagnosis: { type: String, required: true },
    treatmentPlan: { type: String, required: true },
    medications: [{ type: String }],
    notes: { type: String },
    labReports: [{ type: String }] // URLs of uploaded files
}, { timestamps: true });

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);