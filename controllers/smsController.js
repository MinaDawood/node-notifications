const Vonage = require('@vonage/server-sdk');
const SmsModel = require('../models/smsModel');

// Initlaize SMS service provider
const vonage = new Vonage({
  apiKey: '9ed44fb1',
  apiSecret: '8iPQBrnUzApIPDYs',
});

// Send SMS to single user
exports.sendSmsToOneUser = async (req, res) => {
  let dataSaved = {};
  const { message, phoneNumber } = req.body;

  // Handle errors when empty data passes
  if (!message || !phoneNumber || message.length === 0 || phoneNumber.length === 0) {
    res.status(400).json({
      status: 'failed',
      message: 'Must provide the message and the phone number',
    });
    return;
  }

  // SMS data
  const from = 'SWVL-Egypt';
  const to = phoneNumber;
  const text = message;

  // Initalize sms model to save into the DB
  const theSms = new SmsModel({
    message: text,
    phoneNumber: to,
    sendAt: new Date(),
  });

  // Send The SMS
  vonage.message.sendSms(from, to, text, async (err, responseData) => {
    if (err) {
      res.status(500).json({
        status: 'failed',
        message: err,
      });
    } else if (responseData.messages[0].status === '0') {
      // Save the SMS notification into MongoDB
      await theSms
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
      res.status(200).json({
        status: 'success',
        message: `Message sent successfully to ${to}. and saved into the database`,
        data: dataSaved,
      });
    } else {
      const msgError = `Message failed with error: ${responseData.messages[0]['error-text']}`;
      res.status(400).json({
        status: 'failed',
        message: msgError,
      });
    }
  });
};

// Send SMS to group of users
exports.sendSmsToGroup = async (req, res) => {
  let dataSaved = {};
  const { message, phoneNumbers } = req.body;

  // Handle errors when empty data passes
  if (!message || !phoneNumbers || message.length === 0 || phoneNumbers.length === 0) {
    res.status(400).json({
      status: 'failed',
      message: 'Must provide the message and the phone numbers',
    });
    return;
  }

  // SMS data
  const from = 'SWVL-Egypt';
  const text = message;

  // Map throw phone numbers and send the SMS to every number
  phoneNumbers.forEach((num) => {
    const to = Number(num);

    // Initalize sms model to save into the DB
    const theSms = new SmsModel({
      message: text,
      phoneNumber: to,
      sendAt: new Date(),
    });

    // Send The SMS
    vonage.message.sendSms(from, to, text, async (err, responseData) => {
      if (err) {
        res.status(500).json({
          status: 'failed',
          message: err,
        });
      } else if (responseData.messages[0].status === '0') {
        // Save the SMS notification into MongoDB
        await theSms
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
        res.status(200).json({
          status: 'success',
          message: `Message sent successfully to ${to}. and saved into the database`,
          data: dataSaved,
        });
      } else {
        const msgError = `Message failed with error: ${responseData.messages[0]['error-text']}`;
        res.status(400).json({
          status: 'failed',
          message: msgError,
        });
      }
    });
  });
};
