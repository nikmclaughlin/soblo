import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA78g3G29qRBdwPrVKJHQxEwIu2_x7xDIM",
  authDomain: "soblo-33696.firebaseapp.com",
  projectId: "soblo-33696",
  storageBucket: "soblo-33696.appspot.com",
  messagingSenderId: "956323545844",
  appId: "1:956323545844:web:a5d870c24e9966b2c894a1"
};

// Initialize Firebase
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const increment = firebase.firestore.FieldValue.increment;

export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

/**
 * Gets a users/{uid}document with username
 * @param {string} username
 */
export async function getUserWithUsername(username: string){
	const usersRef = firestore.collection('users');
	const query = usersRef.where('username', '==', username).limit(1);
	const userDoc = (await query.get()).docs[0];

	return userDoc;
}

/**
 * Converts a firestore document to JSON
 * @param {DocumentSnapshot} doc
 */
export function postToJSON(doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>){
	const data = doc.data();
	return{
		...data,
		createdAt: data.createdAt.toMillis(),
		updatedAt: data.updatedAt.toMillis(),
	}
}