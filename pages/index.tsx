import Head from "next/head";
import Image from "next/image";
import Loader from "../components/Loader";
import PostFeed from "../components/PostFeed";
import { firestore, fromMillis, postToJSON } from "../lib/firebase";

import { useState } from "react";
import MetaTags from "../components/Metatags";

// Maximum number of posts to query per page
const LIMIT = 10;

export async function getServerSideProps(context) {
	const postsQuery = firestore
		.collectionGroup("posts")
		.where("published", "==", true)
		.orderBy("createdAt", "desc")
		.limit(LIMIT);

	const posts = (await postsQuery.get()).docs.map(postToJSON);

	return {
		props: { posts },
	};
}

export default function Home(props) {
	const [posts, setPosts] = useState(props.posts);
	const [loading, setLoading] = useState(false);

	const [postsEnd, setPostsEnd] = useState(false);

	const getMorePosts = async () => {
		setLoading(true);
		const last = posts[posts.length - 1];

		const cursor =
			typeof last.createdAt === "number"
				? fromMillis(last.createdAt)
				: last.createdAt;

		const query = firestore
			.collectionGroup("posts")
			.where("published", "==", true)
			.orderBy("createdAt", "desc")
			.startAfter(cursor)
			.limit(LIMIT);

		const newPosts = (await query.get()).docs.map((doc) => doc.data());

		setPosts(posts.concat(newPosts));
		setLoading(false);

		if (newPosts.length < LIMIT) {
			setPostsEnd(true);
		}
	};

	return (
		<main className="py-4 px-[10vw]">
			<MetaTags
				title="SoBlo Home Page"
				description="The Social Blogging site"
				image="/favicon.ico"
			/>
			<PostFeed posts={posts} admin={false} />
			{!loading && !postsEnd && (
				<button
					className="bg-gray-400 text-gray-900 py-4 px-8 flex font-sans font-bold rounded-md my-2 mr-4"
					onClick={getMorePosts}
				>
					Load more
				</button>
			)}
			<Loader show={loading} />
			{postsEnd && "You've reached the end!"}
		</main>
	);
}
