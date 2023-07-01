import styles from "../../styles/Post.module.css";

import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";

export async function getStaticProps({ params }) {
	const { username, slug } = params;
	const userDoc = await getUserWithUsername(username);

	let post;
	let path;

	if (userDoc) {
		const postRef = userDoc.ref.collection("posts").doc(slug);
		post = postToJSON(await postRef.get());

		path = postRef.path;
	}

	return {
		props: { post, path },
		revalidate: 5000,
	};
}

export async function getStaticPaths() {
	const snapshot = await firestore.collectionGroup("posts").get();

	const paths = snapshot.docs.map((doc) => {
		const { slug, username } = doc.data();
		return {
			params: { username, slug },
		};
	});

	return {
		paths,
		fallback: "blocking",
	};
}

export default function PostPage(props) {
	return (
		<main>
			<h2>POST PAGE</h2>
		</main>
	);
}
