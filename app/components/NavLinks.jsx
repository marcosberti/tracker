"use client";
import { BarChart2, Banknote } from "lucide-react";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";

const ROUTES = [
  { path: "/", icon: BarChart2, title: "Dashboard" },
  {
    path: "/accounts",
    icon: Banknote,
    title: "Accounts",
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const segment = useSelectedLayoutSegment();

  return (
    <div className="w-full">
      {ROUTES.map(({ path, icon: Icon, title }) => (
        <div
          key={path}
          className="group relative w-full text-gray-700 transition-all hover:bg-green-100"
        >
          <Link
            href={path}
            className="flex w-full justify-center py-3"
            title={title}
          >
            <Icon className="group-active:translate-y-[1px]" />
          </Link>
          <div
            className={`absolute -right-[2px] top-0 h-full w-[2px] transition-all group-hover:bg-green-700 ${
              path === pathname || path === `/${segment}`
                ? "bg-green-700"
                : "bg-transparent"
            }`}
          />
        </div>
      ))}
    </div>
  );
}
