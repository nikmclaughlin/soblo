import Link from "next/link";
import Image from "next/image";

export default function SoBlo404() {
	return (
		<main>
			<h1> 404: Oops! Page not found. </h1>
			<Image src="/travolta-lost.gif" width={249} height={240} alt=""></Image>
			<Link href={"/"}>
				<button className="btn-blue">Take me home</button>
			</Link>
		</main>
	);
}
