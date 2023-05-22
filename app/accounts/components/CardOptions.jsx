import { Edit2, MoreVertical, Trash2 } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DropdownItemDialog from '@/app/components/DropdownItemDialog';

export default function CardOptions({
	isPending,
	canDelete,
	onEdit,
	onDelete,
}) {
	return (
		<div className="absolute right-2 top-2 hidden group-hover:block">
			<DropdownMenu>
				<DropdownMenuTrigger>
					<MoreVertical className="h-4 w-4" />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onSelect={onEdit}>
						<Edit2 className="mr-2 h-4 w-4" />
						<span>Edit</span>
					</DropdownMenuItem>
					<DropdownItemDialog
						isPending={isPending}
						disabled={!canDelete}
						onConfirm={onDelete}
						title="Title"
						description="Are you sure you want to delete this account?"
					>
						<Trash2 className="mr-2 h-4 w-4" />
						<span>Delete</span>
					</DropdownItemDialog>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
