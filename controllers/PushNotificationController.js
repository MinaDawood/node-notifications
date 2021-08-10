const admin = require('firebase-admin');

// The APP SDK credentials
const serviceAccount = require('../swvl-a2db2-firebase-adminsdk-8x4is-255011a701.json');

const PushNotificationModel = require('../models/pushNotificationModel');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Send push notification to single user
exports.pushNotificationToSingleUser = (req, res) => {
  let dataSaved = {};
  const { message, deviceToken } = req.body;
  // This registration token comes from the client FCM SDKs.
  const registrationToken = deviceToken;

  const FullNotification = {
    notification: message,
    android: {
      notification: {
        icon: 'stock_ticker_update',
        color: '#7e55c3',
      },
    },
    token: registrationToken,
  };

  // Initalize push notification model to save into the DB
  const thePushNotification = new PushNotificationModel({
    title: message.title,
    body: message.body,
    deviceToken,
  });

  // Send a message to the device corresponding to the provided
  // registration token.
  admin
    .messaging()
    .send(FullNotification)
    .then(async (response) => {
      // Save the notification into the database
      await thePushNotification
        .save()
        .then((doc) => {
          dataSaved = doc;
        })
        .catch((databaseErr) => {
          res.status(500).json({
            status: 'failed',
            message: 'something went wrong with database',
            error: databaseErr,
          });
        });
      // Response is a message ID string.
      res.status(200).json({
        status: 'success',
        response,
        data: dataSaved,
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: 'failed',
        message: error,
      });
    });
};

// Send push notification to group of users
exports.pushNotificationToGroupOfUsers = (req, res) => {
  const { message, deviceTokens } = req.body;

  // This registration token comes from the client FCM SDKs.
  const registrationTokens = deviceTokens;

  const FullNotification = {
    notification: message,
    android: {
      notification: {
        icon: 'stock_ticker_update',
        color: '#7e55c3',
      },
    },
    token: registrationToken,
  };

  // Initalize push notification model to save into the DB
  const thePushNotification = new PushNotificationModel({
    title: message.title,
    body: message.body,
    deviceToken,
  });
};
