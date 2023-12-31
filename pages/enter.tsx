import Image from "next/image";
import debounce from "lodash.debounce";
import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import Loader from "../components/Loader";
import MetaTags from "../components/Metatags";

export default function EnterPage({}) {
	const { user, username } = useContext(UserContext);

	/**
	 * Three posible states here:
	 * 1: user is signed out - display SignInButton
	 * 2: user is signed in but hasn't setup username - display UsernameForm
	 * 3: user is signed in with username - display SIgnOutButton
	 */
	return (
		<main className="py-4 px-[10vw] w-screen flex justify-center">
			<MetaTags
				title="SoBlo login"
				description="Sign in to SoBlo"
				path="/enter"
			/>
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
		<button
			className="bg-white text-gray-900 py-4 px-8 rounded-md mx-2 hover:brightness-90"
			onClick={signInWithGoogle}
		>
			<Image
				src="/google.png"
				alt="Google Logo"
				width={32}
				height={32}
				className="mr-2"
			/>{" "}
			Sign in with Google
		</button>
	);
}

function SignOutButton() {
	return (
		<button
			onClick={() => auth.signOut()}
			className="py-4 px-8 rounded-md mx-2 hover:brightness-90"
		>
			Sign Out
		</button>
	);
}

function UsernameForm() {
	const [formValue, setFormValue] = useState("");
	const [isValid, setIsValid] = useState(false);
	const [loading, setLoading] = useState(false);

	const { user, username } = useContext(UserContext);

	useEffect(() => {
		checkUsername(formValue);
	}, [formValue]);

	const onChange = (e) => {
		// force formatting on entered value
		const val = e.target.value.toLowerCase();
		const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

		if (val.length < 3) {
			setFormValue(val);
			setLoading(false);
			setIsValid(false);
		}

		if (re.test(val)) {
			setFormValue(val);
			setLoading(true);
			setIsValid(false);
		}
	};

	const checkUsername = useCallback(
		debounce(async (username: string) => {
			if (username.length >= 3) {
				const ref = firestore.doc(`usernames/${username}`);
				const { exists } = await ref.get();
				// console.log("Firestore read executed!");
				setIsValid(!exists);
				setLoading(false);
			}
		}, 500),
		[]
	);

	const onSubmit = async (e) => {
		e.preventDefault();

		const userDoc = firestore.doc(`users/${user.uid}`);
		const usernameDoc = firestore.doc(`usernames/${formValue}`);

		const batch = firestore.batch();
		batch.set(userDoc, {
			username: formValue,
			photoURL: user.photoURL,
			displayName: user.displayName,
		});
		batch.set(usernameDoc, { uid: user.uid });

		await batch.commit();
	};

	return (
		!username && (
			<section className="p-6 my-4 bg-white border-[1px] border-solid border-gray-400 rounded-lg">
				<h3 className="text-xl">Choose Username</h3>
				<form onSubmit={onSubmit} className="flex flex-col">
					<input
						name="username"
						placeholder="my name"
						value={formValue}
						onChange={onChange}
						className="inline-block bg-gray-100 text-xl w-full py-2 px-3"
					/>

					<div className="self-center">
						<UsernameMessage
							username={formValue}
							isValid={isValid}
							loading={loading}
						/>
					</div>

					<button
						type="submit"
						className="bg-green-500 text-white py-4 px-8 rounded-md mx-2 hover:brightness-90 disabled:brightness-75 disabled:cursor-not-allowed"
						disabled={!isValid}
					>
						Choose
					</button>

					{/* <h3>Debug</h3>
					<div>
						Username: {formValue}
						<br />
						Loading: {loading.toString()}
						<br />
						Valid: {isValid.toString()}
					</div> */}
				</form>
			</section>
		)
	);

	function UsernameMessage({ username, isValid, loading }) {
		if (loading) {
			return <Loader show={loading} />;
		} else if (isValid) {
			return (
				<p className="font-bold text-green-500">{username} is available!</p>
			);
		} else if (username && !isValid) {
			return (
				<p className="font-bold text-red-500">
					That username is already taken!
				</p>
			);
		} else {
			return <p></p>;
		}
	}
}
