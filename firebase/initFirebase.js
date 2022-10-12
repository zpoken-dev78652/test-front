import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

//TODO add to env
const clientcredentials = {
  apiKey: "AIzaSyAC5lVeg-oJuZWZZ3czc35iJ3zgfAj0KZg",
  authDomain: "nft-chronicle.firebaseapp.com",
  projectId: "nft-chronicle",
  storageBucket: "nft-chronicle.appspot.com",
  messagingSenderId: "844694442268",
  appId: "1:844694442268:web:0fe756d121d81609572ad9",
  measurementId: "G-HMDCBHMJGX",
};

export default function initFirebase() {
  if (firebase && !firebase.apps.length) {
    firebase.initializeApp(clientcredentials);
    console.log("Firebase was succesfully init.");
  }
}
