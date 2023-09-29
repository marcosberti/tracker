import Link from 'next/link';

export default function Logo() {
	return (
		<Link href="/">
			<div className="lg:mt-8 flex h-10 w-10 lg:h-16 lg:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-300">
				<div className="select-none text-3xl lg:text-5xl font-bold text-gray-700">
					t
				</div>
			</div>
		</Link>
	);
}
