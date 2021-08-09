const mongoose = require('mongoose');

const { Schema } = mongoose;

const pushNotificationSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  deviceToken: {
    type: String,
    required: true,
  },
  sendAt: {
    type: Date,
    default: new Date(),
  },
  viewed: {
    type: Boolean,
    default: false,
  },
});

const pushNotification = mongoose.model('pushNotification', pushNotificationSchema);

module.exports = pushNotification;
