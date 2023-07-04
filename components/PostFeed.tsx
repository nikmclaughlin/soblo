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
		<div className="card">
			<Link href={`/${post.username}`}>
				<strong>By @{post.username}</strong>
			</Link>

			<Link href={`/${post.username}/${post.slug}`}>
				<h2>{post.title}</h2>
			</Link>

			<footer>
				<span>
					{wordCount} words. {minutesToRead} min read
				</span>
				<span>💖 {post.heartCount} Hearts</span>
			</footer>

			{admin && (
				<>
					<Link href={`/admin/${post.slug}`}>
						<h3>
							<button className="btn-blue">Edit</button>
						</h3>
					</Link>

					<button
						className="btn-red"
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
						<p className="text-success">Live</p>
					) : (
						<p className="text-danger">Draft</p>
					)}
				</>
			)}
		</div>
	);
}
