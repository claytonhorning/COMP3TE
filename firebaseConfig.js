import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWhhLyfg-EPAAEmeD6aQl3lBD50O2zgBw",
  authDomain: "comp3te-28087.firebaseapp.com",
  projectId: "comp3te-28087",
  storageBucket: "comp3te-28087.appspot.com",
  messagingSenderId: "808146854897",
  appId: "1:808146854897:web:7828bccc2b16988ab61a50",
  measurementId: "G-2XS1SZJ268",
};

export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
