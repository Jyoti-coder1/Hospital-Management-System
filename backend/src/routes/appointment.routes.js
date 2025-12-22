const express = require("express");
const router = express.Router();

const {
    bookAppointment,
    getAppointments,
    updateAppointmentStatus,
    cancelAppointment
} = require("../controllers/appointment.controller");

const protect = require("../middleware/auth.middleware");
const permit = require("../middleware/rbac.middleware");

// Patient books appointment
router.post("/", protect, permit("patient"), bookAppointment);

// Get appointments
router.get("/", protect, permit("admin", "doctor", "patient"), getAppointments);

// Doctor/Admin update status
router.put("/:id", protect, permit("doctor", "admin"), updateAppointmentStatus);

// Patient/Admin cancel appointment
router.delete("/:id", protect, permit("patient", "admin"), cancelAppointment);

module.exports = router;