const Notification = require("../models/Notification.model");

const createNotification = async (userId, message) => {
    await Notification.create({
        user: userId,
        message
    });
};

module.exports = createNotification;