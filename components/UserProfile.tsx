import Image from "next/image";

export default function UserProfile({ user }) {
	return (
		<div className="flex flex-col content-center text-center">
			<Image
				className="m-auto rounded-full"
				src={user?.photoURL}
				alt="user's profile pic"
				width={125}
				height={125}
			/>
			<p>
				<i>@{user?.username}</i>
			</p>
			<h1 className="text-4xl m-4">{user?.displayName}</h1>
		</div>
	);
}
