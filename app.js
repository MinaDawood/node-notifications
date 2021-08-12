const express = require('express');

const app = express();
const router = require('./routes/smsRoutes')(app);

module.exports = router;
