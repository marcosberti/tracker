import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/utils";
import { HelpCircle } from "lucide-react";

export default function Overview({ account, income, spent }) {
  return (
    <div className="flex w-[250px] flex-col gap-2 rounded-lg border-[1px] p-4">
      <div className="flex items-center gap-2">
        <span className="font-semibold">Overview</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Calculated to the selected month</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Separator />
      <div>
        <div className="flex justify-between text-sm">
          <span>Income</span>
          <span>{formatCurrency(income || 0, account.currencies.code)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Spent</span>
          <span>{formatCurrency(spent || 0, account.currencies.code)}</span>
        </div>
      </div>
      <Separator />
      <div className="flex justify-between text-sm">
        <span>Balance</span>
        <span>
          {formatCurrency(account.balance || 0, account.currencies.code)}
        </span>
      </div>
    </div>
  );
}
