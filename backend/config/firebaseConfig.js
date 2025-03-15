const admin = require('firebase-admin');
const serviceAccount = require('./stock-simulator-9daa1-firebase-adminsdk-fbsvc-a4d5b38b95.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { db, admin };