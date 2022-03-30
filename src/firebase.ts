import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBinn_C1haVBb2bZlPicJwfWYCTn5j2A-Q",
  authDomain: "utak-ddc50.firebaseapp.com",
  databaseURL:
    "https://utak-ddc50-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "utak-ddc50",
  storageBucket: "utak-ddc50.appspot.com",
  messagingSenderId: "675574917579",
  appId: "1:675574917579:web:3ffed3ac7964783ebc2e4e",
};

export const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
