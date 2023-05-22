import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import Icon from '@/app/components/Icon';
import DropdownItemDialog from '@/app/components/DropdownItemDialog';

const columns = [
	{
		id: 'icon',
		accessorFn: row => row.categories.icon,
		header: '',
		cell: ({ row }) => {
			const {
				categories: { name, color },
			} = row.original;
			return (
				<div className="flex justify-center">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<Icon
									icon={row.getValue('icon')}
									className={`text-${color}-700`}
								/>
							</TooltipTrigger>
							<TooltipContent className="capitalize">{name}</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			);
		},
	},
	{
		accessorKey: 'title',
		header: 'Title',
		cell: ({ row }) => {
			const { title, description } = row.original;

			return (
				<div>
					<p>{title}</p>
					<small>{description}</small>
				</div>
			);
		},
	},
	{
		accessorKey: 'created_at',
		header: 'Date',
		cell: ({ row }) => {
			const date = row.getValue('created_at');
			return formatDate(date);
		},
	},
	{
		accessorKey: 'amount',
		header: () => <div className="text-right">Amount</div>,
		cell: ({ row }) => {
			const currencyCode = row.original.currencies.code;
			const amount = parseFloat(row.getValue('amount'));
			const formatted = formatCurrency(amount, currencyCode);

			return <div className="text-right font-medium">{formatted}</div>;
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const { isPending, handleEdit, handleDelete, ...movement } = row.original;

			return (
				<div className="flex justify-center">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem onSelect={() => handleEdit(movement)}>
								<Edit2 className="h-4 w-4" />
								<span className="ml-2">Edit</span>
							</DropdownMenuItem>
							<DropdownItemDialog
								// isPending={isPending}
								onConfirm={() => handleDelete(movement)}
								title="Title"
								description="Are you sure you want to delete this movement?"
							>
								<Trash2 className="h-4 w-4" />
								<span className="ml-2">Delete</span>
							</DropdownItemDialog>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
];

export default function MovementsList({ data }) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<Table>
			<TableHeader>
				{table.getHeaderGroups().map(headerGroup => (
					<TableRow key={headerGroup.id}>
						{headerGroup.headers.map(header => {
							return (
								<TableHead key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
										  )}
								</TableHead>
							);
						})}
					</TableRow>
				))}
			</TableHeader>
			<TableBody>
				{table.getRowModel().rows?.length ? (
					table.getRowModel().rows.map(row => (
						<TableRow
							key={row.id}
							data-state={row.getIsSelected() && 'selected'}
						>
							{row.getVisibleCells().map(cell => (
								<TableCell key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell colSpan={columns.length} className="h-24 text-center">
							No results.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
