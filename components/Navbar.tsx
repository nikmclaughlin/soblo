import Image from "next/image";
import Link from "next/link";

export default function Navbar({}) {
	const user = null;
	const username = null;
	return (
		<nav className="navbar">
			<ul>
				<li>
					<Link href="/">
						<button className="btn-logo">SoBlo</button>
					</Link>
				</li>
				{/* signed in user nav */}
				{username && (
					<>
						<li className="push-left">
							<Link href="/admin">
								<button className="btn-blue">Write Posts</button>
							</Link>
						</li>
						<li>
							<Link href={`/${username}`}>
								<Image src={user?.photoURL} alt="Your profile pic!" />
							</Link>
						</li>
					</>
				)}
				{/* end signed in user nav */}
				{/* guest user nav */}
				{!username && (
					<Link href="/enter">
						<button className="btn-blue">Log in</button>
					</Link>
				)}
				{/* end guest user nav */}
			</ul>
		</nav>
	);
}
