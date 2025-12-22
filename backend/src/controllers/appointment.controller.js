const Appointment = require("../models/Appointment.model");
const createNotification = require("../utils/createNotification");

// @desc Book appointment
// @route POST /api/appointments
// @access Patient
const bookAppointment = async (req, res) => {
    try {
        const { patient, doctor, appointmentDate, timeSlot, reason } = req.body;

        // Prevent double booking
        const existingAppointment = await Appointment.findOne({
            doctor,
            appointmentDate,
            timeSlot,
            status: { $ne: "cancelled" }
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: "Doctor already booked for this time slot"
            });
        }

        const appointment = await Appointment.create({
            patient,
            doctor,
            appointmentDate,
            timeSlot,
            reason
        });

        await createNotification(
            doctor,
            "New appointment booked"
        );

        res.status(201).json({
            success: true,
            appointment
        });

    } catch (error) {
        console.error("BOOK APPOINTMENT ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc Get appointments
// @route GET /api/appointments
// @access Admin / Doctor / Patient
const getAppointments = async (req, res) => {
    try {
        let filter = {};

        if (req.user.role === "doctor") {
            filter.doctor = req.user._id;
        }

        if (req.user.role === "patient") {
            filter.patient = req.query.patientId;
        }

        const appointments = await Appointment.find(filter)
            .populate("patient")
            .populate("doctor", "name email role")
            .sort({ appointmentDate: 1 });

        res.json({
            success: true,
            appointments
        });

    } catch (error) {
        console.error("GET APPOINTMENTS ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc Update appointment status
// @route PUT /api/appointments/:id
// @access Doctor / Admin
const updateAppointmentStatus = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        appointment.status = req.body.status;
        await appointment.save();

        await createNotification(
            appointment.patient,
            `Your appointment has been ${appointment.status}`
        );

        res.json({
            success: true,
            appointment
        });

    } catch (error) {
        console.error("UPDATE APPOINTMENT ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc Cancel appointment
// @route DELETE /api/appointments/:id
// @access Patient / Admin
const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        appointment.status = "cancelled";
        await appointment.save();

        await createNotification(
            appointment.doctor,
            "An appointment has been cancelled"
        );

        res.json({
            success: true,
            message: "Appointment cancelled successfully"
        });

    } catch (error) {
        console.error("CANCEL APPOINTMENT ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    bookAppointment,
    getAppointments,
    updateAppointmentStatus,
    cancelAppointment
};