/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

// Routes
const smsRoutes = require('./routes/smsRoutes');
const pushNotificationRoutes = require('./routes/pushNotificationRoutes');

// Init the app
const app = express();

mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected To MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

// Middleware
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// You can use this main endpoint to test it from your browser to check if server is running
app.get('/', (req, res) => {
  res.send('Hello');
});
// Handle sending sms
app.use('/api/v1/sms', apiLimiter, smsRoutes);

// Handle sending push notification
app.use('/api/v1/push-notification', apiLimiter, pushNotificationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
