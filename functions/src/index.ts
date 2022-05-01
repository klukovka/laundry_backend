import * as functions from 'firebase-functions';
import admin = require('firebase-admin');

admin.initializeApp();

export const androidPushNotifications = functions.firestore
  .document('Notifications/{docId}')
  .onCreate(
    (
      snapshot: functions.firestore.QueryDocumentSnapshot,
      context: functions.EventContext
    ) => {
      admin
        .firestore()
        .collection('DeviceTokens')
        .get()
        .then((result) => {
          var registrationTokens = Array<string>();
          result.docs.forEach((tokenDocument) => {
            registrationTokens.push(tokenDocument.data().token.toString());
          });
          admin.messaging().sendMulticast({
            tokens: registrationTokens,
            notification: {
              title: snapshot.data().title,
              body: snapshot.data().body,
            },
          });
        });
    }
  );
