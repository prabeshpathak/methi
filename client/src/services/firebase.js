import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDeDPg9N7gEYYhzKkjhWYBIxdnnUjiA2_E",
  authDomain: "methi-86cb6.firebaseapp.com",
  projectId: "methi-86cb6",
  storageBucket: "methi-86cb6.appspot.com",
  messagingSenderId: "181410743091",
  appId: "1:181410743091:web:014677fdb1c21eba38b446",
  measurementId: "G-8VSEY1RXFD",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
  auth
    .signInWithPopup(googleProvider)
    .then((res) => {
      // user object
      console.log(res.user);
    })
    .catch((error) => {
      console.log(error.message);
    });
};

