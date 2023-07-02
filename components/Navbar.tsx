import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function Navbar({}) {
	const { user, username } = useContext(UserContext);

	return (
		<nav className="navbar">
			<ul>
				<li>
					<Link href="/" legacyBehavior>
						<button className="btn-logo">SoBlo</button>
					</Link>
				</li>
				{/* signed in user nav */}
				{username && (
					<>
						<li className="push-left">
							<Link href="/admin" legacyBehavior>
								<button className="btn-blue">📝Write</button>
							</Link>
						</li>
						<li>
							<Link href={`/${username}`} legacyBehavior>
								<Image
									src={user?.photoURL}
									alt="Your profile pic!"
									width={50}
									height={50}
								/>
							</Link>
						</li>
					</>
				)}
				{/* end signed in user nav */}
				{/* guest user nav */}
				{!username && (
					<Link href="/enter" legacyBehavior>
						<button className="btn-blue">Log in</button>
					</Link>
				)}
				{/* end guest user nav */}
			</ul>
		</nav>
	);
}
