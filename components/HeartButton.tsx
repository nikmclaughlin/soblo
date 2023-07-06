import { firestore, auth, increment } from "../lib/firebase";
import { useDocument } from "react-firebase-hooks/firestore";

export default function HeartButton({ postRef }) {
	const heartRef = postRef.collection("hearts").doc(auth.currentUser.uid);
	const [heartDoc] = useDocument(heartRef);

	const addHeart = async () => {
		const uid = auth.currentUser.uid;
		const batch = firestore.batch();

		batch.update(postRef, { heartCount: increment(1) });
		batch.set(heartRef, { uid });

		await batch.commit();
	};

	const removeHeart = async () => {
		const batch = firestore.batch();

		batch.update(postRef, { heartCount: increment(-1) });
		batch.delete(heartRef);

		await batch.commit();
	};

	return heartDoc?.exists() ? (
		<button
			onClick={removeHeart}
			className="py-4 px-6 rounded-md mx-2 hover:brightness-90"
		>
			✨ Unheart
		</button>
	) : (
		<button
			onClick={addHeart}
			className="py-4 px-8 rounded-md mx-2 hover:brightness-90"
		>
			💖 Heart
		</button>
	);
}
