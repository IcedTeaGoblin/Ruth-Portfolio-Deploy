
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  apiKey: "AIzaSyCHx6gI3_tpzgjWC-eP0TGGZNgNFrEfNiQ",

  authDomain: "ruth-portfolio-91153.firebaseapp.com",

  databaseURL: "https://ruth-portfolio-91153-default-rtdb.firebaseio.com",

  projectId: "ruth-portfolio-91153",

  storageBucket: "ruth-portfolio-91153.appspot.com",

  messagingSenderId: "740153829590",

  appId: "1:740153829590:web:fb7dc4094757a10a0c4177",

  measurementId: "G-KC4QBT4D9E"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);
