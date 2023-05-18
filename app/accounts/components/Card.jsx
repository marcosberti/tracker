import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import CardOptions from "./CardOptions";
import Icon from "@/app/components/Icon";

export default function Item({ account, isPending, onEdit, onDelete }) {
  const canDelete = !account.balance && account.latest_movement === null;

  return (
    <div className="group relative w-[250px] cursor-pointer opacity-70 transition-all hover:opacity-100">
      <Link href={`/accounts/${account.id}`}>
        <div
          className={`drop-shadow-2xl" rounded-lg p-4 shadow-lg group-hover:shadow-${account.color}-100`}
        >
          <p className="text-sm font-light">{account.name}</p>
          <p className="text-xl font-semibold">
            {formatCurrency(account.balance, account.currencies.code)}
          </p>
          <p className="mt-2 text-xs font-light">
            Latest activity: {formatDate(account.latest_movement)}
          </p>
          <div
            className={`absolute right-4 top-4 bg-${account.color}-300/[.4] rounded-full p-3`}
          >
            <Icon icon={account.icon} className={`text-${account.color}-700`} />
          </div>
        </div>
      </Link>
      <CardOptions
        isPending={isPending}
        canDelete={canDelete}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
