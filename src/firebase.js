import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyByR5OESyKcvlTOW4X10GWUDURUhdc5Z4Q",
  authDomain: "blog-21e9b.firebaseapp.com",
  projectId: "blog-21e9b",
  storageBucket: "blog-21e9b.appspot.com",
  messagingSenderId: "643756417520",
  appId: "1:643756417520:web:4b92186249912a1dd63d35",
  measurementId: "G-XQXLJBC8BP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
export { db, storage };
// Initialize Firebase Authentication and export it
export const auth = getAuth(app);

// Observer for changes to the user's sign-in state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is signed in:', user);
  } else {
    console.log('No user is signed in.');
  }
});

// Function to sign out the user
export const handleLogout = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    alert('You have been logged out.');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};