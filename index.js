require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Routes
// const smsRoutes = require('./routes/smsRoutes');
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

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

// Handle sending sms
app.use('/api/v1/sms', require('./routes/smsRoutes'));

// Handle sending push notification
app.use('/api/v1/push-notification', pushNotificationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
