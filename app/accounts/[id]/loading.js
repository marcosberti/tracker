import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <Skeleton className="h-3 w-32" />
      <div className="mt-4">
        <div className="flex justify-end gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-12" />
        </div>
      </div>
      <div className="mt-4 flex gap-8">
        <Skeleton className="h-[172px] min-w-[250px]" />
        <div className="flex gap-2">
          <Skeleton className="h-[172px] min-w-[9rem]" />
          <Skeleton className="h-[172px] min-w-[9rem]" />
          <Skeleton className="h-[172px] min-w-[9rem]" />
        </div>
      </div>
      <div className="mt-8">
        <Skeleton className="h-[500px] w-full" />
      </div>
    </>
  );
}
