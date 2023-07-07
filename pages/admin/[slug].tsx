import styles from "../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import ImageUploader from "../../components/ImageUploader";
import { firestore, auth, serverTimestamp } from "../../lib/firebase";

import { useState } from "react";
import { useRouter } from "next/router";

import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm, useFormState } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { DocumentReference } from "firebase/firestore";

export default function AdminPostEdit({}) {
	return (
		<main className="py-4 px-[10vw]">
			<AuthCheck>
				<PostManager />
			</AuthCheck>
		</main>
	);
}

function PostManager() {
	const [preview, setPreview] = useState(false);

	const router = useRouter();
	const { slug } = router.query;

	const postRef = firestore
		.collection("users")
		.doc(auth.currentUser.uid)
		.collection("posts")
		.doc(slug.toString());
	const [post] = useDocumentDataOnce(postRef as any);

	return (
		<main className="py-4 px-[10vw] flex min-h-screen">
			{post && (
				<>
					<section className="w-[60vw] mr-4">
						<h1 className="text-4xl my-4">{post.title}</h1>
						<p>ID: {post.slug}</p>

						<PostForm
							postRef={postRef}
							defaultValues={post}
							preview={preview}
						/>
					</section>

					<aside className="flex flex-col w-1/5 min-w-[250px] h-0 min-h-[200px] text-center sticky top-20 ">
						<h3 className="text-xl">Tools</h3>
						<button
							onClick={() => setPreview(!preview)}
							className="py-4 px-8 rounded-md mx-2 hover:brightness-90"
						>
							{preview ? "Edit" : "Preview"}
						</button>
						<Link href={`/${post.username}/${post.slug}`}>
							<button className="bg-indigo-500 text-white py-4 px-8 rounded-md mx-2 hover:brightness-90 ">
								Live view
							</button>
						</Link>
						<ImageUploader />
					</aside>
				</>
			)}
		</main>
	);
}

function PostForm({ defaultValues, postRef, preview }) {
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
		control,
	} = useForm({
		defaultValues,
		mode: "onChange",
	});

	const { isValid, isDirty } = useFormState({ control });

	const updatePost = async ({ content, published }) => {
		await postRef.update({
			content,
			published,
			updatedAt: serverTimestamp(),
		});

		reset({ content, published });

		toast.success("Post updated!");
	};

	return (
		<form onSubmit={handleSubmit(updatePost)}>
			{preview && (
				<div className="p-8 my-4 bg-white border-[1px] border-solid border-gray-400 rounded-lg">
					<ReactMarkdown>{watch("content")}</ReactMarkdown>
				</div>
			)}

			<div className={preview ? "hidden" : "flex flex-col"}>
				<fieldset className="border-none py-4 text-lg">
					<input
						className="inline outline-none border-none text-2xl w-auto py-2 px-3"
						type="checkbox"
						{...register("published")}
					/>
					<label> Published</label>
				</fieldset>

				<textarea
					className="h-[60vh] border-none outline-none p-2 text-lg rounded-md"
					{...register("content", {
						maxLength: { value: 20000, message: "content is too long" },
						minLength: { value: 10, message: "content is too short" },
						required: { value: true, message: "content is required" },
					})}
				></textarea>
				<div className="flex space-x-1">
					<Image
						src="/markdown.svg"
						alt="markdown logo"
						height={32}
						width={32}
					/>
					<span>
						<strong>
							{" "}
							via{" "}
							<Link
								href="https://commonmark.org/help/"
								target="_blank"
								className="text-info"
							>
								CommonMark
							</Link>
						</strong>
					</span>
				</div>

				{errors.content && (
					<p className="font-bold text-red-500">
						{errors.content.message.toString()}
					</p>
				)}

				<button
					type="submit"
					className="bg-green-500 text-white py-4 px-8 rounded-md mx-2 hover:brightness-90 disabled:brightness-75 disabled:cursor-not-allowed"
					disabled={!isDirty || !isValid}
				>
					Save Changes
				</button>
			</div>
		</form>
	);
}
