const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/error.middleware");
const authRoutes = require("./routes/auth.routes");
const patientRoutes = require("./routes/patient.routes");
const medicalRecordRoutes = require("./routes/medicalRecord.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const path = require("path");
const feedbackRoutes = require("./routes/feedback.routes");
const notificationRoutes = require("./routes/notification.routes");

const app = express();

const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim()) : ["http://localhost:5173"];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like Postman)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

// Health check
app.get("/", (req, res) => {
    res.send("Hospital Management API running");
});

//Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);

// Error middleware
app.use(errorHandler);

module.exports = app;