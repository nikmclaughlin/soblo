import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../lib/firebase";
import toast from "react-hot-toast";

export function useUserData(){

	const [user] = useAuthState(auth as any);
	const [username, setUsername] = useState(null);

	useEffect(() => {
		// disable firebase realtime subscription
		let unsubscribe;

		if (user) {
			const ref = firestore.collection("users").doc(user.uid);
			unsubscribe = ref.onSnapshot((doc) => {
				setUsername(doc.data()?.username);
			});
		} else {
			setUsername(null);
		}

		return unsubscribe;
	}, [user]);

	return { user, username };
}

export async function deleteFirebasePost( post ){
	const ref = firestore
		.collection("users")
		.doc(post.uid)
		.collection("posts")
		.doc(post.slug);

	await ref.delete().then(() => {
		toast.success("Post deleted!");
	});

}