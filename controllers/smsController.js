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
  if (message.length === 0) {
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
exports.sendSmsToGroup = async (req, res) => {
  const { message, phoneNumbers } = req.body;

  // Handle errors when empty message passes
  if (message.length === 0) {
    res.status(400).json({
      status: 'failed',
      message: "Message can't be empty",
    });
    return;
  }

  // SMS data
  const from = '+19389999545';
  const body = `${message} - Sent From: Swvl-Egypt`;

  let mainResponse = {};

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
      .then(async (msg) => {
        // If the SMS sent successfully -> Save the data into the DB and return the response
        await SMSToSaved.save()
          .then((doc) => {})
          .catch((databaseErr) => {});
      })
      .catch((err) => {});
  });
};

// Send SMS to group of users
// exports.sendSmsToGroup = async (req, res) => {
//   const { message, phoneNumbers } = req.body;

//   // Handle errors when empty data passes
//   if (!message || !phoneNumbers || message.length === 0 || phoneNumbers.length === 0) {
//     res.status(400).json({
//       status: 'failed',
//       message: 'Must provide the message and the phone number',
//     });
//     return;
//   }

//   // SMS data
//   const from = 'SWVL-Egypt';
//   const text = message;

//   const finalResponse = {};

//   phoneNumbers.forEach(async (num) => {
//     console.log('1');
//     const to = num;

//     // Initalize sms model to save into the DB
//     const theSms = new SmsModel({
//       message: text,
//       phoneNumber: to,
//       sendAt: new Date(),
//     });

//     await vonage.message
//       .sendSms(from, to, text,(err, res) => {

//       })
//       .then(() => {
//         console.log('CCC');
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//     // await vonage.message.sendSms(from, to, text, async (err, responseData) => {
//     //   if (err) {
//     //     finalResponse[to] = 'Failed';
//     //   } else if (responseData.messages[0].status === '0') {
//     // Save the SMS notification into MongoDB
//     // await theSms
//     //   .save()
//     //   .then((doc) => {
//     //     const dataSaved = doc;
//     //   })
//     //   .catch((databaseErr) => {
//     //     finalResponse[to] = 'Failed';
//     //   });
//     // finalResponse[to] = 'Success';
//     // } else {
//     //   const msgError = `Message failed with error: ${responseData.messages[0]['error-text']}`;
//     //   finalResponse[to] = msgError;
//     //   console.log(finalResponse);
//     // }
//     // });
//   });

//   console.log('2', finalResponse);
//   await res.status(200).json({
//     status: 'sccuess',
//     message: finalResponse,
//   });
// };
