import firebase from "@firebase/app"
import "@firebase/auth"
import "@firebase/database"
import "@firebase/storage"

var firebaseConfig = {
  apiKey: "AIzaSyADrgFD7IfZNoNK6LvUnT2V4wCTuj4ABxo",
  authDomain: "react-chat-7a25d.firebaseapp.com",
  projectId: "react-chat-7a25d",
  storageBucket: "react-chat-7a25d.appspot.com",
  messagingSenderId: "684453234261",
  appId: "1:684453234261:web:f2f2220af23d93cc4bf6dc",
  measurementId: "G-TH63DCWBM3",
  databaseURL: "https://react-chat-7a25d-default-rtdb.firebaseio.com/"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase