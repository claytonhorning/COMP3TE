const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// let timer = 10;

// exports.checkActiveQuiz = functions.firestore
//   .document("Quizzes/{quizId}")
//   .onWrite((snap, context) => {
//     const intervalId = setInterval(() => {
//       if (timer > 0) {
//         timer = timer - 1;
//         db.doc(`Quizzes/${context.params.quizId}`).update({
//           timer: timer,
//         });
//         clearInterval(intervalId);
//       }
//     }, 1000);
//   });
