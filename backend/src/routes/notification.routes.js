const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const { getNotifications } = require("../controllers/notification.controller");

router.get("/", protect, getNotifications);

module.exports = router;