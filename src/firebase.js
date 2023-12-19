import { initializeApp } from 'firebase/app'
import { getFirestore,collection } from 'firebase/firestore'
// ... other firebase imports

export const firebaseApp = initializeApp({
    apiKey: "AIzaSyCVkj0iuh7UNy_TUoO_QHZO3E_IjsXqlFU",
  authDomain: "hive-1ba97.firebaseapp.com",
  projectId: "hive-1ba97",
  storageBucket: "hive-1ba97.appspot.com",
  messagingSenderId: "804817664975",
  appId: "1:804817664975:web:8258646dda3551724ff0ba",
  measurementId: "G-1ZTXZQTHYC"
})


// used for the firestore refs
export const fireDb = getFirestore(firebaseApp)




