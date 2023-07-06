import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function PostContent({ post }) {
	const createdAt =
		typeof post?.createdAt === "number"
			? new Date(post.createdAt)
			: post.createdAt.toDate();

	return (
		<div className="p-8 my-4 bg-white border-[1px] border-solid border-gray-400 rounded-lg">
			<h1 className="text-4xl m-4">{post?.title}</h1>
			<span className="text-sm">
				Written by{" "}
				<Link href={`/${post.username}`} className="text-info">
					@{post.username}
				</Link>{" "}
				on {createdAt.toISOString()}
			</span>

			<ReactMarkdown>{post?.content}</ReactMarkdown>
		</div>
	);
}
