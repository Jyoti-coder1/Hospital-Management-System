const express = require("express");
const router = express.Router();
const { createPatient, getPatients, getPatientById, exportMedicalHistory } = require("../controllers/patient.controller");
const protect = require("../middleware/auth.middleware");
const permit = require("../middleware/rbac.middleware");

// Admin or Doctor can create patients
router.post("/", protect, permit("admin", "doctor"), createPatient);

// Admin/Doctor/Nurse can list all patients with search/filter
router.get("/", protect, permit("admin", "doctor", "nurse"), getPatients);

// Admin/Doctor/Nurse/Patient can get single patient
router.get("/:id", protect, getPatientById);

router.get("/:id/export", protect, permit("admin", "doctor", "patient"), exportMedicalHistory);

module.exports = router;