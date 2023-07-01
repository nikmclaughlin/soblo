import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

export default function Home() {
	return (
		<div className={styles.container}>
			<Loader show />
			<h1>HOME PAGE</h1>
			<button onClick={() => toast.success("Success!")}>Toast me!</button>
		</div>
	);
}
