import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQxWLEDQ2zy944WA0Mm4c5vXAhauB5emc",
  authDomain: "rideshare-43068.firebaseapp.com",
  projectId: "rideshare-43068",
  storageBucket: "rideshare-43068.firebasestorage.app",
  messagingSenderId: "429567978613",
  appId: "1:429567978613:web:9e07cb9cc04e4320595c3c",

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup };
