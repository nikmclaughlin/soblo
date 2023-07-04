import Link from "next/link";
import { deleteFirebasePost } from "../lib/hooks";

// type Post = {
// 	content: string;
// 	title: string;
// 	heartCount: number;
// 	username: string;
// 	slug: string;
// };

export default function PostFeed({ posts, admin }) {
	return posts
		? posts.map((post) => (
				<PostItem post={post} key={post.slug} admin={admin} />
		  ))
		: null;
}

function PostItem({ post, admin = false }) {
	const wordCount = post?.content.trim().split(/\s+/g).length;
	const minutesToRead = (wordCount / 100 + 1).toFixed(0);

	return (
		<div className="p-8 ml-4 bg-white border-[1px] border-solid border-gray-600 rounded-lg">
			<Link href={`/${post.username}/${post.slug}`}>
				<h2 className="text-2xl font-bold my-3">{post.title}</h2>
			</Link>

			<Link href={`/${post.username}`}>
				<p className="text-md font-semibold">By @{post.username}</p>
			</Link>
			<footer className="flex">
				<span>
					{wordCount} words // {minutesToRead} min read //
				</span>
				<span> 💖 {post.heartCount} Hearts</span>
			</footer>

			{admin && (
				<div className="flex">
					<Link href={`/admin/${post.slug}`}>
						<button className="bg-indigo-600 text-white py-4 px-8 rounded-md mx-2 hover:brightness-90">
							Edit
						</button>
					</Link>

					<button
						className="bg-red-500 text-white py-4 px-8 rounded-md mx-2 hover:brightness-90"
						onClick={(e) => {
							e.preventDefault();
							if (window.confirm(`Really delete ${post.title}?`)) {
								deleteFirebasePost(post);
							}
						}}
					>
						Delete
					</button>

					{post.published ? (
						<p className="text-green-400 font-semibold self-center">Live</p>
					) : (
						<p className="text-gray-400 font-semibold self-center">Draft</p>
					)}
				</div>
			)}
		</div>
	);
}
