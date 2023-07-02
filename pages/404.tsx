import Link from "next/link";
import Image from "next/image";
import MetaTags from "../components/Metatags";

export default function SoBlo404() {
	return (
		<main>
			<MetaTags
				title="SoBlo 404"
				description="Tried to find a different page"
				image="/travolta-lost.gif"
				path="/404"
			/>
			<h1> 404: Oops! Page not found. </h1>
			<Image src="/travolta-lost.gif" width={249} height={240} alt=""></Image>
			<Link href={"/"}>
				<button className="btn-blue">Take me home</button>
			</Link>
		</main>
	);
}
