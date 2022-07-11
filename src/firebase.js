import firebase from 'firebase';


const firebaseConfig = {
   apiKey: "AIzaSyALZJ8JR0JPWvfrUJzm43tF6DHCe9MA4n4",
  authDomain: "swapntop-7b24d.firebaseapp.com",
  projectId: "swapntop-7b24d",
  storageBucket: "swapntop-7b24d.appspot.com",
  messagingSenderId: "1008400007145",
  appId: "1:1008400007145:web:5850e547cc38ca2f115578",
  measurementId: "G-XJB24GJWCD"
  };


export const Firebase = firebase.initializeApp(firebaseConfig);
const db = Firebase.firestore();
const auth = firebase.auth();
const firebasestorage = Firebase.storage();
const analytics = Firebase.analytics();

export {firebasestorage};
export { auth };
export default db;
