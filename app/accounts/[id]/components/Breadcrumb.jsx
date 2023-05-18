import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Breadcrumb({ account }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="group relative text-blue-400 transition-all hover:text-blue-600">
        <Link href="/accounts">Accounts</Link>
        <div className="absolute h-[2px] w-full bg-transparent  transition-all group-hover:bg-blue-600" />
      </span>
      <span>
        <ChevronRight className="h-4 w-4" />
      </span>
      <span>{account.name}</span>
    </div>
  );
}
