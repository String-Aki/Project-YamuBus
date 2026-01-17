import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCVO56_S1JVwFOrt_cjOisAe9QaIhK3YFU",
  authDomain: "computing-project-922d7.firebaseapp.com",
  projectId: "computing-project-922d7",
  storageBucket: "computing-project-922d7.firebasestorage.app",
  messagingSenderId: "797783508971",
  appId: "1:797783508971:web:0c7c16b93531757bc73bae",
  measurementId: "G-DPV96CT1FT",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
