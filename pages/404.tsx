import Link from "next/link";
import Image from "next/image";
import MetaTags from "../components/Metatags";

export default function SoBlo404() {
	return (
		<main className="py-4 px-[10vw]">
			<MetaTags
				title="SoBlo 404"
				description="Tried to find a different page"
				image="/travolta-lost.gif"
				path="/404"
			/>
			<h1 className="text-4xl m-4"> 404 - Oops! Page not found. </h1>
			<Image src="/travolta-lost.gif" width={249} height={240} alt=""></Image>
			<Link href={"/"}>
				<button className="bg-indigo-600 text-white py-4 px-8 rounded-md mx-2 hover:brightness-90">
					Take me home
				</button>
			</Link>
		</main>
	);
}
