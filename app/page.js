import Charts from "@/app/components/Charts";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

function ChartsLoader() {
  return (
    <>
      <div className="flex basis-1/4 flex-col items-center p-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-4 h-[250px] w-[250px] rounded-full" />
      </div>
      <div className="flex-1">
        <Skeleton className="h-full w-full" />
      </div>
    </>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="flex grow">
        <Suspense fallback={<ChartsLoader />}>
          <Charts />
        </Suspense>
      </div>
      <div className="basis-[40%]">mov</div>
    </div>
  );
}
