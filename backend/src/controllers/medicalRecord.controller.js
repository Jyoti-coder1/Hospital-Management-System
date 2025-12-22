const MedicalRecord = require("../models/MedicalRecord.model");

// @desc Create medical record
// @route POST /api/medical-records
// @access Doctor
const createRecord = async (req, res) => {
    try {
        const { patient, diagnosis, treatmentPlan, medications, notes, labReports } = req.body;

        const record = await MedicalRecord.create({
            patient,
            diagnosis,
            treatmentPlan,
            medications,
            notes,
            labReports
        });

        res.status(201).json({ success: true, record });
    } catch (error) {
        console.error("CREATE RECORD ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Get all records for a patient
// @route GET /api/medical-records/:patientId
// @access Doctor / Nurse / Patient (self)
const getRecordsByPatient = async (req, res) => {
    try {
        const records = await MedicalRecord.find({ patient: req.params.patientId });
        res.json({ success: true, records });
    } catch (error) {
        console.error("GET RECORD ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Update a medical record
// @route PUT /api/medical-records/:id
// @access Doctor
const updateRecord = async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id);
        if (!record) return res.status(404).json({ success: false, message: "Record not found" });

        Object.assign(record, req.body);
        await record.save();

        res.json({ success: true, record });
    } catch (error) {
        console.error("UPDATE RECORD ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Upload medical document
// @route POST /api/medical-records/:id/upload
// @access Doctor / Nurse
const uploadMedicalDocument = async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id);
        if (!record) return res.status(404).json({ message: "Record not found" });

        record.labReports.push(`/uploads/${req.file.filename}`);
        await record.save();

        res.json({
            message: "File uploaded successfully",
            file: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        console.error("UPLOAD MEDICAL DOCUMENT ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createRecord, getRecordsByPatient, updateRecord, uploadMedicalDocument };