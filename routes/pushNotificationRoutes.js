const express = require('express');
const PushNotificationController = require('../controllers/PushNotificationController');

const router = express.Router();

// Send Push Notification to one user Route
router.route('/single/').post();

// Send Push Notification to group of users
router.route('/group').post();

module.exports = router;
