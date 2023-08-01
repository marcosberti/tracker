import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Icon from '@/app/components/Icon';
import DropdownItemDialog from '@/app/components/DropdownItemDialog';
import { formatCurrency, formatDate } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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
		id: 'account',
		accessorFn: row => row.accounts.name,
		header: 'Account',
		cell: ({ row }) => {
			const {
				accounts: { name },
			} = row.original;

			return name;
		},
	},
	{
		accessorKey: 'first_payment_date',
		header: 'First payment date',
		cell: ({ row }) => {
			const date = row.getValue('first_payment_date');
			return date ? formatDate(date) : '-';
		},
	},
	{
		accessorKey: 'installments',
		header: 'Installments',
		cell: ({ row }) => {
			const { installments, paid_installments } = row.original;

			return `${paid_installments}/${installments}`;
		},
	},
	{
		accessorKey: 'active',
		header: 'Status',
		cell: ({ row }) => {
			const active = row.getValue('active');

			return active ? 'Pending payments' : 'Paid';
		},
	},
	{
		accessorKey: 'amount',
		header: () => (
			<div className="text-right">
				Amount <small>(per inst.)</small>
			</div>
		),
		cell: ({ row }) => {
			const currencyCode = row.original.accounts.currencies.code;
			const amount = parseFloat(row.getValue('amount'));
			const formatted = formatCurrency(amount, currencyCode);

			return <div className="text-right font-medium">{formatted}</div>;
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const {
				isPending,
				active,
				handleEdit,
				handleDelete,
				handlePay,
				...installment
			} = row.original;
			const isDeleteDisabled = installment.paid_installments > 0;

			if (!active) return null;

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
							<DropdownMenuItem onSelect={() => handleEdit(installment)}>
								<Edit2 className="h-4 w-4" />
								<span className="ml-2">Edit</span>
							</DropdownMenuItem>
							<DropdownItemDialog
								title="Title"
								description="Are you sure you want to delete this installment?"
								isPending={isPending}
								disabled={isDeleteDisabled}
								onConfirm={() => handleDelete(installment)}
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

export default function List({ data, count, page, size }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const goToPage = newPage => {
		const params = new URLSearchParams(searchParams);
		params.set('installmentsPage', newPage);

		const urlParams = params.toString();
		let path = `${pathname}?${urlParams}`;
		router.push(path);
	};

	const handlePrevious = () => {
		goToPage(page - 1);
	};

	const handleNext = () => {
		goToPage(+page + 1);
	};

	const from = (page - 1) * size + 1;
	let to = from + size;
	if (to > count) {
		to = count;
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map(headerGroup => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map(header => {
								return (
									<TableHead key={header.id} className="text-gray-600">
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
								className={!row.original.active ? 'opacity-50' : null}
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
			<div className="flex items-center justify-end gap-4 p-4">
				<div className="text-sm font-light">
					{from} - {to} of {count}
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={handlePrevious}
						disabled={+page === 1}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={handleNext}
						disabled={page * size >= count}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
