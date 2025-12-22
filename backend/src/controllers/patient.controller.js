const Patient = require("../models/Patient.model");
const User = require("../models/User.model");
const MedicalRecord = require("../models/MedicalRecord.model");
const generateMedicalHistoryPDF = require("../utils/pdfGenerator"); 

// @desc Create a patient
// @route POST /api/patients
// @access Admin / Doctor
const createPatient = async (req, res) => {
    try {
        const { userId, dob, gender, contactNumber, address, assignedDoctor } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const patient = await Patient.create({
            user: userId,
            dob,
            gender,
            contactNumber,
            address,
            assignedDoctor
        });

        res.status(201).json({ success: true, patient });
    } catch (error) {
        console.error("CREATE PATIENT ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Get all patients (with search & filter)
// @route GET /api/patients
// @access Admin / Doctor / Nurse
const getPatients = async (req, res) => {
    try {
        const { name, doctor, gender } = req.query;
        let filter = {};

        if (name) filter['user.name'] = { $regex: name, $options: 'i' };
        if (doctor) filter.assignedDoctor = doctor;
        if (gender) filter.gender = gender;

        const patients = await Patient.find(filter)
            .populate("user", "name email role")
            .populate("assignedDoctor", "name email");

        res.json({ success: true, patients });
    } catch (error) {
        console.error("GET PATIENTS ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Get single patient
// @route GET /api/patients/:id
// @access Admin / Doctor / Nurse / Patient (self)
const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id)
            .populate("user", "name email role")
            .populate("assignedDoctor", "name email");

        if (!patient) return res.status(404).json({ message: "Patient not found" });

        res.json({ success: true, patient });
    } catch (error) {
        console.error("GET PATIENT BY ID ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Export medical history PDF
// @route GET /api/patients/:id/export
// @access Patient (self) / Doctor / Admin
const exportMedicalHistory = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate("user");
    if (!patient)
      return res.status(404).json({ success: false, message: "Patient not found" });

    const records = await MedicalRecord.find({ patient: patient._id });

    generateMedicalHistoryPDF(patient, records, res);
  } catch (error) {
    console.error("Upload Medical History PDF ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createPatient, getPatients, getPatientById, exportMedicalHistory };