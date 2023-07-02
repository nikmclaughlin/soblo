import Image from "next/image";

export default function UserProfile({ user }) {
	return (
		<div className="box-center">
			<Image
				className="card-img-center"
				src={user?.photoURL}
				alt="user's profile pic"
				width={125}
				height={125}
			/>
			<p>
				<i>@{user?.username}</i>
			</p>
			<h1>{user?.displayName}</h1>
		</div>
	);
}
