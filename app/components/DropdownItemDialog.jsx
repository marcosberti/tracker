import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export default function DropdownItemDialog({
	disabled,
	title,
	description,
	isPending,
	onConfirm,
	children,
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<DropdownMenuItem
					disabled={disabled}
					onSelect={e => e.preventDefault()}
				>
					{children}
				</DropdownMenuItem>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						className="bg-green-600 hover:bg-green-600/90"
						disabled={isPending}
						onClick={onConfirm}
					>
						{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Confirm
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
