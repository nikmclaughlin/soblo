export default function Loader({ show }) {
	return show ? (
		<div className="border-8 border-solid border-gray-100 border-t-indigo-600 rounded-full w-12 h-12 animate-spin"></div>
	) : null;
}
