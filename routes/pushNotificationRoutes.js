const express = require('express');
const PushNotificationController = require('../controllers/PushNotificationController');

const router = express.Router();

// Send Push Notification to one user
router.route('/single').post(PushNotificationController.pushNotificationToSingleUser);

// Send Push Notification to group of users
router.route('/group').post(PushNotificationController.pushNotificationToGroupOfUsers);

// Send Push Notification to one user without fcm
router.route('/single/v2').post(PushNotificationController.pushNotificationToSingleUserWithoutFCM);

module.exports = router;
