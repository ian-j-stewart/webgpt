import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyAO2dOWVMfBLzaiZnkMOe_mulkJHVFrv10",
    authDomain: "excgpt-10904.firebaseapp.com",
    projectId: "excgpt-10904",
    storageBucket: "excgpt-10904.appspot.com",
    messagingSenderId: "669284492913",
    appId: "1:669284492913:web:e7a7107b2e2ae1d61d5dd0",
    measurementId: "G-GTNQPVN0LJ"
};




// Get a reference to the authentication service




export const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);