import Image from "next/image";
import { auth, googleAuthProvider } from "../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function EnterPage({}) {
	const { user, username } = useContext(UserContext);

	/**
	 * Three posible states here:
	 * 1: user is signed out - display SignInButton
	 * 2: user is signed in but hasn't setup username - display UsernameForm
	 * 3: user is signed in with username - display SIgnOutButton
	 */
	return (
		<main>
			{user ? (
				!username ? (
					<UsernameForm />
				) : (
					<SignOutButton />
				)
			) : (
				<SignInButton />
			)}
		</main>
	);
}

function SignInButton() {
	const signInWithGoogle = async () => {
		await auth.signInWithPopup(googleAuthProvider);
	};
	return (
		<button className="btn-google" onClick={signInWithGoogle}>
			<Image src="/google.png" alt="Google Logo" width={100} height={30} /> Sign
			in with Google
		</button>
	);
}

function SignOutButton() {
	return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm() {
	return <h2>Username Form</h2>;
}
