const express = require('express');
const webpush = require('web-push');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

const router = express.Router();

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
const subscription = [];

webpush.setVapidDetails(
  'mailto:mansour.m02@htlwienwest.at',
  publicVapidKey,
  privateVapidKey,
);

router.post(
  '/subscribe',
  asyncHandler(async (req, res) => {
    subscription.push(req.body);
    res.status(201).end();
  }),
);
router.post('/notify', (req, res) => {
  const payload = JSON.stringify({ title: 'Weather', body: req.body });
  for (const sub of subscription) {
    try {
      webpush.sendNotification(sub, payload);
    } catch (error) {
      console.error(error);
    }
  }
  res.end();
});

module.exports = router;
