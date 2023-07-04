import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../lib/context";
import { firestore, auth, serverTimestamp } from "../../lib/firebase";

import { useContext, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useCollection } from "react-firebase-hooks/firestore";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";

export default function AdminPostsPage({}) {
	const [formOpen, setFormOpen] = useState(false);
	return (
		<main>
			<AuthCheck>
				<Link href="#createNewPost">
					<button
						className="bg-gray-400 text-gray-900 py-4 px-8 rounded-md mx-2 hover:brightness-90"
						onClick={() => setFormOpen((state) => !state)}
					>
						{!formOpen ? "Create New Post" : "Hide Form"}
					</button>
				</Link>
				<CreateNewPost open={formOpen} />
				<PostList />
			</AuthCheck>
		</main>
	);
}

function PostList() {
	const ref = firestore
		.collection("users")
		.doc(auth.currentUser.uid)
		.collection("posts");
	const query = ref.orderBy("createdAt");
	const [querySnapshot] = useCollection(query as any);

	const posts = querySnapshot?.docs.map((doc) => doc.data());

	return (
		<>
			<h1 className="text-4xl m-4">Manage your posts</h1>
			<PostFeed posts={posts} admin />
		</>
	);
}
function CreateNewPost(props) {
	const router = useRouter();
	const { username } = useContext(UserContext);
	const [title, setTitle] = useState("");

	const slug = encodeURI(kebabCase(title));

	const isValid = title.length > 3 && title.length < 100;

	// Create the new post in firestore
	const createPost = async (e) => {
		e.preventDefault();
		const uid = auth.currentUser?.uid;
		const ref = firestore
			.collection("users")
			.doc(uid)
			.collection("posts")
			.doc(slug);

		// Assemble the post data
		const data = {
			title: title,
			slug: slug,
			uid: uid,
			username: username,
			published: false,
			content: "🐭⚔️",
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
			heartCount: 0,
		};

		await ref.set(data);

		toast.success("Post created!");
		// redirect to edit page for post writing
		router.push(`/admin/${slug}`);
	};

	if (props.open) {
		return (
			<form
				onSubmit={createPost}
				id="createNewPost"
				className="bg-gray-300 p-3 rounded-lg"
			>
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="rounded-lg"
					placeholder="New Post Title"
				/>
				<p className="font-bold mt-2">Slug: {slug}</p>
				<button
					type="submit"
					disabled={!isValid}
					className="bg-green-500 text-white py-4 px-8 rounded-md mx-2 hover:brightness-90 disabled:brightness-75 disabled:cursor-not-allowed"
				>
					Create New Post
				</button>
			</form>
		);
	}
}
