'use client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import useMutation from '@/hooks/useMutation';
import { formatCurrency } from '@/lib/utils';
import { Check, HelpCircle, Loader2, RefreshCw, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Overview({ account, income, spent }) {
	const router = useRouter();
	const { toast } = useToast();
	const { mutate, isPending } = useMutation('balance', 'PATCH');

	const handleResyncBalance = () => {
		const data = {
			accountId: account.id,
		};
		mutate({
			data,
			onSuccess: () => {
				toast({
					title: (
						<div className="border-se flex items-center gap-2">
							<Check className="h-4 w-4" />
							Resync completed
						</div>
					),
					variant: 'success',
				});
				router.refresh();
			},
			onError: e => {
				toast({
					title: (
						<div className="border-se flex items-center gap-2">
							<X className="h-4 w-4" />
							Oops, there's been an error!
						</div>
					),
					variant: 'error',
				});
			},
		});
	};

	return (
		<div className="flex min-w-[250px] w-full lg:w-auto flex-col justify-between gap-2 rounded-lg border-[1px] p-4">
			<div className="flex items-center justify-between">
				<div className="flex gap-2">
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
				<div>
					<Button
						className=""
						variant="ghost"
						disabled={isPending}
						title="Resync your balance"
						onClick={handleResyncBalance}
					>
						{isPending ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<RefreshCw className="h-4 w-4" />
						)}
					</Button>
				</div>
			</div>
			<div className="w-full">
				<Separator />
			</div>
			<div className="">
				<div className="flex justify-between text-sm">
					<span>Income</span>
					<span>{formatCurrency(income || 0, account.currencies.code)}</span>
				</div>
				<div className="flex justify-between text-sm">
					<span>Spent</span>
					<span>{formatCurrency(spent || 0, account.currencies.code)}</span>
				</div>
			</div>
			<div className="w-full">
				<Separator />
			</div>
			<div className="flex justify-between text-sm">
				<span>Balance</span>
				<span>
					{formatCurrency(account.balance || 0, account.currencies.code)}
				</span>
			</div>
		</div>
	);
}
