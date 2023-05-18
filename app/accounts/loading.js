import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <Skeleton className="h-4 w-24" />
      <div className="mt-4 flex flex-wrap gap-4">
        <Skeleton className="h-[104px] w-[250px]" />
        <Skeleton className="h-[104px] w-[250px]" />
        <Skeleton className="h-[104px] w-[250px]" />
      </div>
    </>
  );
}
