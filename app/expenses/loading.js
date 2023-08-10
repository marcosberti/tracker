import { Skeleton } from '@/components/ui/skeleton';

function TableLoader() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<Skeleton className="h-4 w-32" />
				<div className="flex gap-2">
					<div className="flex items-center gap-2">
						<Skeleton className="h-3 w-24" />
						<Skeleton className="h-[24px] w-[44px] rounded-full" />
					</div>
					<Skeleton className="h-10 w-12" />
				</div>
			</div>
			<Skeleton className="h-[250px] w-full" />
		</div>
	);
}

export default function Loading() {
	return (
		<div className="flex flex-col gap-8">
			<TableLoader />
			<TableLoader />
		</div>
	);
}
