// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
      apiKey: "AIzaSyBdgXo2GDlzUEJUD_N_u9UAi416j5wqVUo",
      authDomain: "e-commerce-703cb.firebaseapp.com",
      projectId: "e-commerce-703cb",
      storageBucket: "e-commerce-703cb.appspot.com",
      messagingSenderId: "770681012079",
      appId: "1:770681012079:web:8857b7bc384f19b6b1b29a",
      measurementId: "G-X428TDTL7D"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


export const auth = getAuth(app)
export const db = getFirestore(app)