import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="flex flex-col gap-4">
			<Skeleton className="h-5 w-32" />
			<div className="flex gap-8">
				<Skeleton className="h-[172px] min-w-[250px]" />
				<div className="flex gap-2">
					<Skeleton className="h-[172px] min-w-[9rem]" />
					<Skeleton className="h-[172px] min-w-[9rem]" />
					<Skeleton className="h-[172px] min-w-[9rem]" />
				</div>
			</div>
			<div>
				<div className="flex items-center justify-end gap-2">
					<div className="flex items-center gap-2">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-[24px] w-[44px] rounded-full" />
					</div>
					<Skeleton className="h-10 w-20" />
					<Skeleton className="h-10 w-12" />
				</div>
			</div>
			<div>
				<Skeleton className="h-[500px] w-full" />
			</div>
		</div>
	);
}
