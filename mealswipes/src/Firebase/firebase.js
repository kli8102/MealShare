import * as firebase from 'firebase';


const firebaseConfig = {
    apiKey: "AIzaSyAsp5T1uRCb0Oa4JSmJ7KwkK8lCNjpG5NU",
    authDomain: "meal-swipe-19431.firebaseapp.com",
    databaseURL: "https://meal-swipe-19431.firebaseio.com",
    projectId: "meal-swipe-19431",
    storageBucket: "meal-swipe-19431.appspot.com",
    messagingSenderId: "105276358753",
    appId: "1:105276358753:web:5b78ff407683bebd69ea20",
    measurementId: "G-LBMMF2M23M"
  };


firebase.initializeApp(firebaseConfig);

firebase.auth().useDeviceLanguage();



firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(function() {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    //     return firebase.auth().signInWithPhoneNumber('+18563165972', appVerifier);
    })
        .catch(function(error) {
        // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
    });



export default firebase;
