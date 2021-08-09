const express = require('express');
const smsController = require('../controllers/smsController');

const router = express.Router();

// Send to one user route
router.route('/single').post(smsController.sendSmsToOneUser);

// Send to group of users route
router.route('/group').post(smsController.sendSmsToGroup);

module.exports = router;
