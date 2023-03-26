import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBzB4CLcPU86RnpLCk05mPcBkv16jQGkHo",
    authDomain: "auth-example-94976.firebaseapp.com",
    projectId: "auth-example-94976",
    storageBucket: "auth-example-94976.appspot.com",
    messagingSenderId: "1005185497693",
    appId: "1:1005185497693:web:6617fcc850f5b3e0f1ebb4",
    measurementId: "G-T4KR58YGEG"
}
// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const storage = getStorage()
export const db = getFirestore()