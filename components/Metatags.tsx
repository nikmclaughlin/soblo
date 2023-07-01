import Head from "next/head";
import Router from "next/router";

export default function MetaTags({
	title = "A SoBlo Post",
	description = "Come read on SoBlo!",
	image = "/favicon.ico",
	path = "/",
}) {
	return (
		<Head>
			<title>{title}</title>
			<meta name="twitter:card" content="summary" />
			<meta name="twitter:site" content="@soblo" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={image} />

			<meta property="og:title" content={title} />
			<meta property="og:type" content="article" />
			<meta property="og:image" content={image} />
			<meta property="og:url" content={`https://www.soblo.com${path}`} />
			<meta property="og:site_name" content="Soblo" />
			<meta property="og:description" content={description} />
		</Head>
	);
}
