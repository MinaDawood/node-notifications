const admin = require('firebase-admin');

// The APP SDK credentials
const serviceAccount = require('../swvl-a2db2-firebase-adminsdk-8x4is-255011a701.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const PushNotificationModel = require('../models/pushNotificationModel');

// Send push notification to single user
exports.pushNotificationToSingleUser = (req, res) => {
  // const { message, deviceToken } = req.body;

  // // Handle errors if empty data passes
  // if (!message || !deviceToken || message.length === 0 || deviceToken === 0) {
  //   res.status(400).json({
  //     status: 'failed',
  //     message: "message and device token can't be empty",
  //   });
  //   return;
  // }

  // This registration token comes from the client FCM SDKs.
  // const registrationToken = deviceToken;

  // This registration token comes from the client FCM SDKs.
  const registrationToken =
    'AAAA_kUu4KU:APA91bHWvue4cqWkiZGM-GVXG-TyP-NXezGGmoZPwshj1uQFEGztKsHTElbZkONhp0iz-mFH6BHYoVh-ou0nAHLto-TxkqlMpvCM3sv63r37TNayHwhaB1FlooCsaIpdCk0RlT3pz_0n';

  const message = {
    data: {
      score: '850',
      time: '2:45',
    },
    token: registrationToken,
  };

  // Send a message to the device corresponding to the provided
  // registration token.
  admin
    .messaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });

  // const fullNotification = {
  //   notification: message,
  //   android: {
  //     notification: {
  //       icon: 'stock_ticker_update',
  //       color: '#7e55c3',
  //     },
  //   },
  //   token: registrationToken,
  // };

  // Initalize push notification model to save into the DB
  // const thePushNotification = new PushNotificationModel({
  //   title: message.title,
  //   body: message.body,
  //   deviceToken,
  // });

  // Send a message to the device corresponding to the provided
  // registration token.
  // admin
  //   .messaging()
  //   .send(FullNotification)
  //   .then(async (response) => {
  //     // Save the notification into the database
  //     await thePushNotification
  //       .save()
  //       .then((doc) => {
  //         res.status(200).json({
  //           status: 'success',
  //           notification: response,
  //           docSaved: doc,
  //         });
  //       })
  //       .catch((databaseErr) => {
  //         res.status(500).json({
  //           status: 'failed',
  //           message: 'something went wrong with database',
  //           error: databaseErr,
  //         });
  //       });
  //   })
  //   .catch((error) => {
  //     res.status(400).json({
  //       status: 'failed',
  //       message: error,
  //     });
  //   });
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

// Note: I made this endpoint for testing purpos.
// This endpoint will return json notification object.
// The frontend dev should implement a custom service to listen for this endpoint.
// Send push notification to single user withour FCM
exports.pushNotificationToSingleUserWithoutFCM = async (req, res) => {
  const { title, body, deviceId } = req.body;

  if (!title || title.length === 0 || !body || body.length === 0) {
    res.status(400).json({
      status: 'failed',
      message: "message and title can't be empty",
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
