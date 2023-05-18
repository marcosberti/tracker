import Icon from "@/app/components/Icon";
import { formatCurrency } from "@/lib/utils";

export default function SummarizedCategories({ account, summarized }) {
  return (
    <div>
      {summarized.map((category) => (
        <div
          className={`flex w-36 flex-col items-center gap-8 rounded-lg bg-${category.color}-50 p-4`}
        >
          <div className={`rounded-full bg-${category.color}-300/[.4] p-4`}>
            <Icon className="h-10 w-10" icon={category.icon} />
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xs capitalize">{category.name}</p>
            <p className="whitespace-pre text-sm font-semibold">
              {formatCurrency(category.amount, account.currencies.code)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
