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
		<main>
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
		<main className={styles.container}>
			{post && (
				<>
					<section>
						<h1>{post.title}</h1>
						<p>ID: {post.slug}</p>

						<PostForm
							postRef={postRef}
							defaultValues={post}
							preview={preview}
						/>
					</section>

					<aside>
						<h3>Tools</h3>
						<button onClick={() => setPreview(!preview)}>
							{preview ? "Edit" : "Preview"}
						</button>
						<Link href={`/${post.username}/${post.slug}`}>
							<button className="btn-blue">Live view</button>
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
				<div className="card">
					<ReactMarkdown>{watch("content")}</ReactMarkdown>
				</div>
			)}

			<div className={preview ? styles.hidden : styles.controls}>
				<fieldset>
					<input
						className={styles.checkbox}
						type="checkbox"
						{...register("published")}
					/>
					<label> Published</label>
				</fieldset>

				<textarea
					{...register("content", {
						maxLength: { value: 20000, message: "content is too long" },
						minLength: { value: 10, message: "content is too short" },
						required: { value: true, message: "content is required" },
					})}
				></textarea>
				<div>
					<Image
						src="/markdown.svg"
						alt="markdown logo"
						height={16}
						width={16}
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
					<p className="text-danger">{errors.content.message.toString()}</p>
				)}

				<button
					type="submit"
					className="btn-green"
					disabled={!isDirty || !isValid}
				>
					Save Changes
				</button>
			</div>
		</form>
	);
}
