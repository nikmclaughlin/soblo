import styles from "../../styles/Post.module.css";

import {
	firestore,
	getUserWithUsername,
	postToJSON,
	auth,
} from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import PostContent from "../../components/PostContent";
import MetaTags from "../../components/Metatags";
import HeartButton from "../../components/HeartButton";
import AuthCheck from "../../components/AuthCheck";
import Link from "next/link";

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
	const postRef = firestore.doc(props.path);
	const [realtimePost] = useDocumentData(postRef as any);

	const post = realtimePost || props.post;

	return (
		<main className="min-h-screen flex py-4 px-[10vw]">
			<MetaTags title={post?.title} path={`/${post.username}/${post.slug}`} />
			<section className="w-4/5 mr-4">
				<PostContent post={post} />
			</section>

			<aside className="items-center flex flex-col w-1/5 min-w-[225px] p-8 my-4 bg-white border-[1px] border-solid border-gray-400 rounded-lg text-center sticky top-20 h-0 min-h-[250px]">
				<p className="font-bold">{post.heartCount || 0} 💖</p>

				<AuthCheck
					fallback={
						<Link href="/enter">
							<button className="py-4 px-8 rounded-md mx-2 hover:brightness-90">
								💖 Sign in
							</button>
						</Link>
					}
				>
					<HeartButton postRef={postRef} />
					{auth.currentUser?.uid == post.uid && (
						<Link href={`/admin/${post.slug}`}>
							<h3 className="text-xl">
								<button className="bg-indigo-500 text-white py-4 px-8 rounded-md mx-2 hover:brightness-90">
									Edit
								</button>
							</h3>
						</Link>
					)}
				</AuthCheck>
			</aside>
		</main>
	);
}
