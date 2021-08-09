const express = require('express');
const PushNotificationController = require('../controllers/PushNotificationController');

const router = express.Router();

// Send Push Notification to one user Route
router.route('/single').post(PushNotificationController.sendPushNotificationToOneUser);

// Send Push Notification to one user Route
router.route('/group').post(PushNotificationController.sendPushNotificationToGroup);

module.exports = router;
