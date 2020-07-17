import * as firebase from 'firebase';


const firebaseConfig = {
    // Removed
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
