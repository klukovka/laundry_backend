// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC6vJJV5cci0iV5gZs-i5wmZpGSkdSuXaY',
  authDomain: 'clean-digital.firebaseapp.com',
  projectId: 'clean-digital',
  storageBucket: 'clean-digital.appspot.com',
  messagingSenderId: '300391850941',
  appId: '1:300391850941:web:2e0709927f79bb56dca8d4',
  measurementId: '${config.measurementId}',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;
