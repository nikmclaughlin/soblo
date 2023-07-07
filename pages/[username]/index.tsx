import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import { getUserWithUsername, postToJSON } from "../../lib/firebase";
import MetaTags from "../../components/Metatags";

export async function getServerSideProps({ query }) {
	const { username } = query;
	const userDoc = await getUserWithUsername(username);

	// 404 if user not found
	if (!userDoc) {
		return {
			notFound: true,
		};
	}

	let user = null;
	let posts = null;

	if (userDoc) {
		user = userDoc.data();
		const postsQuery = userDoc.ref
			.collection("posts")
			.where("published", "==", true)
			.orderBy("createdAt", "desc")
			.limit(5);

		posts = (await postsQuery.get()).docs.map(postToJSON);
	}

	return {
		props: { user, posts },
	};
}

export default function UserProfilePage({ user, posts }) {
	return (
		<main className="py-4 px-[10vw]">
			<MetaTags
				title={`${user.username}'s Profile`}
				description={`SoBlo profile for ${user.username}`}
				image={user.photoURL}
				path={`/${user.username}`}
			/>
			<UserProfile user={user} />
			<PostFeed posts={posts} admin={false} />
		</main>
	);
}
