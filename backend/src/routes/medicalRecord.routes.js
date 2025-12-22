const express = require("express");
const router = express.Router();
const { createRecord, getRecordsByPatient, updateRecord, uploadMedicalDocument } = require("../controllers/medicalRecord.controller");
const protect = require("../middleware/auth.middleware");
const permit = require("../middleware/rbac.middleware");
const upload = require("../utils/fileUpload");

// Doctor creates record
router.post("/", protect, permit("doctor"), createRecord);

// Get records for a patient
router.get("/:patientId", protect, permit("doctor", "nurse", "patient"), getRecordsByPatient);

// Update record
router.put("/:id", protect, permit("doctor"), updateRecord);

// Upload medical File
router.post("/:id/upload", protect, permit("doctor", "nurse"), upload.single("file"), uploadMedicalDocument);

module.exports = router;