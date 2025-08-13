// functions/index.js  (starter test)
const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');

admin.initializeApp();

exports.ping = onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(204).send('');
  res.status(200).send('OK from Firebase Functions');
});
