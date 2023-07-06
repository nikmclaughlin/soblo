import { useState } from "react";
import { auth, storage, STATE_CHANGED } from "../lib/firebase";
import Loader from "./Loader";

export default function ImageUploader() {
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [downloadURL, setDownloadURL] = useState(null);

	const uploadFile = async (e) => {
		const file = Array.from(e.target.files)[0] as File;
		const extension = file.type.split("/")[1];

		// make a reference to the file location in firestore
		const ref = storage.ref(
			`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
		);
		setUploading(true);

		// start the firestore upload
		const task = ref.put(file);

		// update progress during upload
		task.on(STATE_CHANGED, (snapshot) => {
			const pct = Number(
				((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
			);
			setProgress(pct);

			// handle completed upload
			task
				.then((d) => ref.getDownloadURL())
				.then((url) => {
					setDownloadURL(url);
					setUploading(false);
				});
		});
	};

	return (
		<div className="flex justify-between">
			<Loader show={uploading} />
			{uploading && <h3 className="text-xl">{progress}%</h3>}

			{!uploading && (
				<>
					<label className="py-4 px-8 rounded-md mx-2 hover:brightness-90 bg-gray-400 font-bold cursor-pointer">
						🖼️ Add a pic
						<input
							type="file"
							onChange={uploadFile}
							className="hidden"
							accept="image/x-png, image/gif, image/jpeg, image/webp, image/avif, image/apng"
						/>
					</label>
				</>
			)}

			{downloadURL && (
				<code className="w-3/4 ml-auto bg-white overflow-x-scroll p-1 my-1">{`![alt](${downloadURL})`}</code>
			)}
		</div>
	);
}
