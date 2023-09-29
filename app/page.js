import Charts from '@/app/components/charts';

export default function Home() {
	return (
		<div className="flex flex-col">
			<Charts />
			<div className="hidden lg:block basis-[40%]">mov</div>
		</div>
	);
}
