import * as firebase from "firebase/app";
import "firebase/auth"
import config from '../firebaseConfig.json'

const firebaseConfig = config;
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
