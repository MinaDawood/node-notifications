// Initlaize SMS service provider
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// Database Model
const SmsModel = require('../models/smsModel');

// Send SMS to single user
exports.sendSmsToOneUser = async (req, res) => {
  const { message, phoneNumber } = req.body;

  // Handle errors when empty message passes
  if (!message || !phoneNumber || message.length === 0 || phoneNumber.length === 0) {
    res.status(400).json({
      status: 'failed',
      message: "Message can't be empty",
    });
    return;
  }

  // SMS data
  const from = '+19389999545';
  const to = phoneNumber;
  const body = `${message} - Sent From: Swvl-Egypt`;

  // Initalize sms model to save into the DB
  const SMSToSaved = new SmsModel({
    message: body,
    phoneNumber: to,
  });

  // Send The SMS
  client.messages
    .create({
      body,
      from,
      to,
    })
    .then(async (msg) => {
      // If the SMS sent successfully -> Save the data into the DB and return the response
      await SMSToSaved.save()
        .then((doc) => {
          res.status(200).json({
            status: 'success',
            message: msg,
            docSaved: doc,
          });
        })
        .catch((databaseErr) => {
          res.status(500).json({
            status: 'failed',
            message: databaseErr,
          });
        });
    })
    .catch((err) => {
      res.status(400).json({
        status: 'failed',
        message: "Message can't empty and phone Number not valid number",
        error: err,
      });
    });
};

// Send SMS to group of users
exports.sendSmsToGroup = (req, res) => {
  const { message, phoneNumbers } = req.body;

  // Handle errors when empty message passes
  if (!message || !phoneNumbers || message.length === 0 || phoneNumbers.length === 0) {
    res.status(400).json({
      status: 'failed',
      message: "Message and Phone Numbers can't be empty",
    });
    return;
  }

  // SMS data
  const from = '+19389999545';
  const body = `${message} - Sent From: Swvl-Egypt`;

  const mainResponse = {};

  // Loop throw the phone numbers and send the SMS to every number and send main response for all
  phoneNumbers.forEach((num) => {
    const to = num;
    // Initalize sms model to save into the DB
    const SMSToSaved = new SmsModel({
      message: body,
      phoneNumber: to,
    });

    // Send The SMS
    client.messages
      .create({
        body,
        from,
        to,
      })
      .then(async () => {
        // If the SMS sent successfully -> Save the data into the DB and return the response
        await SMSToSaved.save()
          .then((doc) => {
            mainResponse[to] = {
              status: 'success',
              docSaved: doc,
            };
          })
          .catch((databaseErr) => {
            mainResponse[to] = {
              status: 'failed',
              docSaved: databaseErr,
            };
          });
        if (num === phoneNumbers[phoneNumbers.length - 1]) {
          res.json({
            message: mainResponse,
          });
        }
      })
      .catch((err) => {
        mainResponse[to] = {
          status: 'failed',
          message: err.message,
        };
        if (num === phoneNumbers[phoneNumbers.length - 1]) {
          res.json({
            message: mainResponse,
          });
        }
      });
  });
};
