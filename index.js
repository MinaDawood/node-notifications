require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

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

// To check the server is working
app.get('/', (req, res) => res.send('Swvl Notification API!! --'));

// Handle sending sms
app.use('/api/v1/sms', smsRoutes);

// Handle sending push notification
app.use('/api/v1/push-notification', pushNotificationRoutes);

// Send Notification SMS to one user
app.post('/api/v1/notification/single/:userId', (req, res) => {
  const { userId } = req.params;
  const { phoneNumber, message } = req.body;
});

app.post('/api/v1/push-notification/:deviceToken', (req, res) => {
  const { userId } = req.params; // This will identify a spiecifc user
  const { message } = req.body;

  // {
  // "icon": "link to icon",
  // "title":"some title",
  // "body": "some body"
  // }

  try {
    // Save the notification into the DB

    // After saving it will send it as a json format to the frontend
    res.status(200).json({
      status: true,
      notification: {
        message,
      },
    });
  } catch (err) {}
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
