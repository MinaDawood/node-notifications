const express = require("express");
const Vonage = require("@vonage/server-sdk");
const Sms = require("../models/smsModel");

const router = express.Router();

// Initlaize SMS service provider
const vonage = new Vonage({
  apiKey: "9ed44fb1",
  apiSecret: "8iPQBrnUzApIPDYs",
});

// Send SMS to single user
router.post("/single", async (req, res) => {
  const { message, phoneNumber } = req.body;

  if (
    !message ||
    !phoneNumber ||
    message.length === 0 ||
    phoneNumber.length === 0
  ) {
    res.status(400).json({
      status: "failed",
      message: "Must provide the message and the phone number",
    });
    return;
  }

  // SMS data
  const from = "SWVL-Egypt";
  const to = phoneNumber;
  const text = message;

  // Initalize sms model to save into the DB
  const theSms = new Sms({
    id: 1,
    message: text,
    phoneNumber: to,
    sendAt: new Date(),
  });

  // Send The SMS
  vonage.message.sendSms(from, to, text, async (err, responseData) => {
    if (err) {
      console.log(err);
    } else {
      if (responseData.messages[0]["status"] === "0") {
        // Save the SMS notification into MongoDB
        await theSms
          .save()
          .then((doc) => {})
          .catch((err) => {
            console.log(err);
          });
        res.status(200).json({
          status: "success",
          message: `Message sent successfully to ${to}. and saved into the database`,
        });
      } else {
        const msgError = `Message failed with error: ${responseData.messages[0]["error-text"]}`;
        res.status(400).json({
          status: "failed",
          message: msgError,
        });
        return;
      }
    }
  });
});

// Send SMS to group of users
router.post("/group", (req, res) => {
  const { message, phoneNumbers } = req.body;

  // Handle errors when empty data passes
  if (!message && !phoneNumbers) {
    res.status(400).json({
      status: false,
      message: "must provide the message and the phone numbers",
    });
    return;
  } else if (message.length === 0 || phoneNumbers.length === 0) {
    res.status(400).json({
      status: false,
      message: "must provide the message and the phone numbers",
    });
    return;
  }

  // SMS data
  const from = "SWVL-Egypt";
  const text = message;

  // Map throw phone numbers and send the SMS to every number
  phoneNumbers.map((num) => {
    const to = Number(num);

    // Send The SMS
    vonage.message.sendSms(from, to, text, (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        if (responseData.messages[0]["status"] === "0") {
          console.log("Message sent successfully.");
        } else {
          const msgError = `Message failed with error: ${responseData.messages[0]["error-text"]}`;
          res.status(400).json({
            status: false,
            message: msgError,
          });
        }
      }
    });
  });
});

module.exports = router;
