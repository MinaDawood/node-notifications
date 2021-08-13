const admin = require('firebase-admin');

// The APP SDK credentials
const serviceAccount = require('../swvl-a2db2-firebase-adminsdk-8x4is-255011a701.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const PushNotificationModel = require('../models/pushNotificationModel');

// Send push notification to single user | FCM
exports.pushNotificationToSingleUser = (req, res) => {
  const { message, deviceToken } = req.body;

  // Handle errors if empty data passes
  if (!message || !deviceToken || message.length === 0 || deviceToken === 0) {
    res.status(400).json({
      status: 'failed',
      message: "message and device token can't be empty",
    });
    return;
  }

  // This registration token comes from the client FCM SDKs.
  const registrationToken = deviceToken;

  // Full notifiction that will send to user
  const fullNotification = {
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
  const PushNotificationToSave = new PushNotificationModel({
    title: message.title,
    body: message.body,
    deviceToken,
  });

  // Send a message to the device corresponding to the provided registration token.
  admin
    .messaging()
    .send(fullNotification)
    .then(async (response) => {
      // Save the notification into the database
      await PushNotificationToSave.save()
        .then((doc) => {
          res.status(200).json({
            status: 'success',
            notification: response,
            docSaved: doc,
          });
        })
        .catch((databaseErr) => {
          res.status(500).json({
            status: 'failed',
            message: 'something went wrong with database',
            error: databaseErr,
          });
        });
    })
    .catch((error) => {
      res.status(400).json({
        status: 'failed',
        message: error,
      });
    });
};

// Send push notification to group of users | FCM
exports.pushNotificationToGroupOfUsers = (req, res) => {
  const { message, tokens } = req.body;

  // handle errors if empty data passes
  if (!message || !tokens || message.length === 0 || tokens.length === 0) {
    res.status(400).json({
      status: 'failed',
      message: "message and tokens can't be empty",
    });
    return;
  }

  const mainResponse = {};

  // Loop throw tokens to send every notification to every token
  tokens.forEach((tok) => {
    // This registration token comes from the client FCM SDKs.
    const registrationToken = tok;

    // Full notifiction that will send to user
    const fullNotification = {
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
    const PushNotificationToSave = new PushNotificationModel({
      title: message.title,
      body: message.body,
      registrationToken,
    });

    // Notifiction Send a message to the device corresponding to the provided registration token.
    admin
      .messaging()
      .send(fullNotification)
      .then(async (response) => {
        // Save the notification into the database
        await PushNotificationToSave.save()
          .then((doc) => {
            mainResponse[registrationToken] = {
              status: 'success',
              notification: response,
              docSaved: doc,
            };
          })
          .catch((databaseErr) => {
            mainResponse[registrationToken] = {
              status: 'failed',
              message: 'something went wrong with database',
              error: databaseErr,
            };
          });
      })
      .catch((error) => {
        mainResponse[registrationToken] = {
          status: 'failed',
          message: 'something went wrong with database',
          error,
        };
      });
  });
};

// Note: I made this endpoint for testing purpose.
// This endpoint will return JSON notification object.
// The frontend dev should implement a custom service to listen for this endpoint.
// Send push notification to single user without FCM
exports.pushNotificationToSingleUserWithoutFCM = async (req, res) => {
  const { title, body, deviceId } = req.body;

  if (!title || !body || !deviceId || title.length === 0 || body.length === 0 || deviceId === 0) {
    res.status(400).json({
      status: 'failed',
      message: "title, body and deviceId can't be empty",
    });
    return;
  }
  // Initalize push notification model to save into the DB
  const notificationToSave = new PushNotificationModel({
    title,
    body,
    deviceToken: deviceId,
  });

  const message = {
    priority: 'high',
    token: deviceId,
    notification: {
      title,
      body,
    },
    android: {
      ttl: '86400s',
      notification: {
        click_action: 'OPEN_ACTIVITY_1',
      },
    },
    apns: {
      headers: {
        'apns-priority': '5',
      },
      payload: {
        aps: {
          category: 'NEW_MESSAGE_CATEGORY',
        },
      },
    },
    webpush: {
      headers: {
        TTL: '86400',
      },
    },
  };

  // Save To database
  await notificationToSave
    .save()
    .then((doc) => {
      res.status(200).json({
        status: 'success',
        docSaved: doc,
        message,
      });
    })
    .catch((databaseErr) => {
      res.status(500).json({
        status: 'failed',
        error: databaseErr,
      });
    });
};
