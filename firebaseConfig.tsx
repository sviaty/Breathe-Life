import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConf = {
    apiKey: "AIzaSyDtDQYI2sJN-GT9jCfg4YYDrhaiMbalcMk",
    authDomain: "testing-firebase-ec361.firebaseapp.com",
    databaseURL: "https://testing-firebase-ec361-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "testing-firebase-ec361",
    storageBucket: "testing-firebase-ec361.appspot.com",
    messagingSenderId: "939968442007",
    appId: "1:939968442007:web:2114a3275d29bd3664c3d2",
    measurementId: "G-FEVR7B56CS"
};

export const FIREBASE_APP = initializeApp(firebaseConf);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export default FIREBASE_APP;



