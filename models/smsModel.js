const mongoose = require('mongoose');

const { Schema } = mongoose;

const smsSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  sendAt: {
    type: Date,
    default: new Date(),
  },
});

const Sms = mongoose.model('Sms', smsSchema);

module.exports = Sms;
