'use client';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Accordion,
	AccordionContent,
	AccordionItem as RadixAccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {
	AlertTriangle,
	Edit2,
	Layers,
	MoreHorizontal,
	Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/app/components/icon';
import DropdownItemDialog from '@/app/components/dropdown-item-dialog';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, getTotalized } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

const WIDTHS = {
	CHECK: 'basis-[5%]',
	TITLE: 'basis-[44%]',
	PAID_ON: 'basis-[29%]',
	AMOUNT: 'basis-[22%]',
	ACTIONS: 'basis-[10%]',
};

function ItemContent({ shouldGrow, item, accountCurrency }) {
	const isSameCurrency = item.currencies.id === accountCurrency.id;
	let amount = !Number.isNaN(item.amount) ? item.amount : null;
	let expenseType;

	if (!isSameCurrency && amount) {
		amount *= item.exchange_rate;
	}

	if (item.isInstallment) expenseType = 'installment';
	if (item.isScheduled) expenseType = 'scheduled';

	let showWarning = false;
	let totalItems = null;
	if (item.subItems?.length) {
		const filteredItems = item.subItems.filter(
			i =>
				i.categories.movement_types.type ===
				item.categories.movement_types.type,
		);
		totalItems = getTotalized(accountCurrency, filteredItems);
		showWarning = totalItems !== amount;
	}

	return (
		<>
			<div
				className={`${WIDTHS.TITLE} text-xs lg:text-sm text-start ${
					shouldGrow ? 'grow' : ''
				}`}
			>
				<div className="flex items-center gap-2 ">
					<Icon
						icon={item.categories.icon}
						className={`hidden lg:block text-${item.categories.color}-700`}
					/>
					<div>
						{item.title}{' '}
						{item.isInstallment ? (
							<small>
								({item.paid_installments + 1}/{item.installments})
							</small>
						) : null}
						<div className="flex flex-col gap-2">
							{expenseType ? (
								<Badge variant="secondary">{expenseType}</Badge>
							) : null}
							{item.isPaymentPending ? (
								<Badge variant="outline">pending</Badge>
							) : null}
						</div>
						{item.description ? <small>{item.description}</small> : null}
						<div className="lg:hidden text-start">
							{item.created_at ? formatDate(item.created_at.slice(0, 19)) : ''}
						</div>
					</div>
				</div>
			</div>
			<p className={`${WIDTHS.PAID_ON} text-start hidden lg:block`}>
				{item.created_at ? formatDate(item.created_at.slice(0, 19)) : ''}
			</p>
			<div className={`flex flex-col ${WIDTHS.AMOUNT} text-end`}>
				{!amount ? '-' : null}
				{amount && isSameCurrency ? (
					<div className="flex items-center justify-end  gap-2">
						{showWarning ? (
							<AlertTriangle className="h-4 w-4 text-yellow-600" />
						) : null}
						{formatCurrency(amount, item.currencies.code)}
					</div>
				) : null}
				{amount && !isSameCurrency ? (
					<>
						{formatCurrency(amount, accountCurrency.code)}{' '}
						<small className="text-xs">
							{formatCurrency(item.amount, item.currencies.code)}
						</small>{' '}
					</>
				) : null}
				{showWarning ? (
					<small className="text-xs font-light">
						sum of subitems: {formatCurrency(totalItems, accountCurrency.code)}
					</small>
				) : null}
			</div>
		</>
	);
}

function Actions({ isPending, item, onPayment, onEdit, onDelete }) {
	return (
		<div className={`flex justify-center ${WIDTHS.ACTIONS}`}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					{item.isPaymentPending ? (
						<DropdownMenuItem onSelect={() => onPayment(item)}>
							<Edit2 className="h-4 w-4" />
							<span className="ml-2">Pay</span>
						</DropdownMenuItem>
					) : (
						<>
							<DropdownMenuItem onSelect={() => onEdit(item)}>
								<Edit2 className="h-4 w-4" />
								<span className="ml-2">Edit</span>
							</DropdownMenuItem>
							<DropdownItemDialog
								title="Title"
								description="Are you sure you want to delete this movement?"
								isPending={isPending}
								onConfirm={() => onDelete(item)}
							>
								<Trash2 className="h-4 w-4" />
								<span className="ml-2">Delete</span>
							</DropdownItemDialog>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

function Item({
	isPending,
	isSelected,
	item,
	accountCurrency,
	onPayment,
	onEdit,
	onDelete,
	onSelected,
}) {
	return (
		<>
			<div className={`${WIDTHS.CHECK} flex justify-center mr-4 lg:m-0`}>
				<Checkbox
					checked={isSelected}
					onCheckedChange={() => onSelected(item)}
				/>
			</div>
			<div
				className={`flex flex-1 items-center justify-between lg:justify-normal ${
					item.isPaymentPending ? 'opacity-50' : null
				}`}
			>
				<ItemContent item={item} accountCurrency={accountCurrency} />
			</div>
			<Actions
				isPending={isPending}
				item={item}
				onPayment={onPayment}
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		</>
	);
}

function AccordionItem({
	isPending,
	selected,
	item,
	accountCurrency,
	onPayment,
	onEdit,
	onDelete,
	onSelected,
}) {
	return (
		<Accordion type="single" collapsible className="w-full">
			<RadixAccordionItem className="flex-1 border-0" value={`item-${item.id}`}>
				<div className="flex items-center">
					<div className={`${WIDTHS.CHECK} flex justify-center mr-4 lg:m-0`}>
						<Checkbox
							checked={selected.has(item.id)}
							onCheckedChange={() => onSelected(item)}
						/>
					</div>
					<div className="grow">
						<AccordionTrigger
							className="p-0 hover:no-underline w-full"
							disabled={!item.subItems?.length}
						>
							<div className="flex basis-[90%] items-center">
								<ItemContent item={item} accountCurrency={accountCurrency} />
							</div>
						</AccordionTrigger>
					</div>
					<div />
				</div>
				<AccordionContent className="mt-4 bg-gray-100">
					<div className="rounded-full lg:px-12 pt-2 lg:pt-4">
						{item.subItems?.map(subItem => (
							<div key={subItem.id} className="flex items-center px-4 py-2">
								<ItemContent
									shouldGrow
									item={subItem}
									accountCurrency={accountCurrency}
								/>
								<Actions
									isPending={isPending}
									item={subItem}
									onPayment={onPayment}
									onEdit={onEdit}
									onDelete={onDelete}
								/>
							</div>
						))}
					</div>
				</AccordionContent>
			</RadixAccordionItem>
		</Accordion>
	);
}

function getSelectedTotalized(selected, items, accountCurrency) {
	const selectedItems = items
		.filter(
			i => selected.has(i.id) || i.subItems?.some(si => selected.has(si.id)),
		)
		.map(i => {
			if (!i.categories.is_group_item) return i;

			const isParentItemSelected = selected.has(i.id);

			if (isParentItemSelected) {
				const {
					categories: { is_group_item, ...categories },
					subItems,
					...item
				} = i;
				return { ...item, categories };
			}

			const subItems = i.subItems.filter(si => selected.has(si.id));
			return {
				...i,
				subItems,
			};
		});

	return getTotalized(accountCurrency, selectedItems);
}

export default function List({
	isPending,
	data,
	accountCurrency,
	onPayment,
	onEdit,
	onDelete,
}) {
	const [selected, setSelected] = useState(new Set());
	const total = selected.size
		? getSelectedTotalized(selected, data, accountCurrency)
		: null;

	const handleSelectedItem = item => {
		setSelected(old => {
			const setlected = new Set(old);
			const isSelected = !!setlected.has(item.id);
			const method = isSelected ? 'delete' : 'add';
			setlected[method](item.id);

			return setlected;
		});
	};

	const handleSelectAll = () => {
		if (data.length === selected.size) {
			setSelected(new Set());
		} else {
			const ids = data.map(i => i.id);
			setSelected(new Set(ids));
		}
	};

	return (
		<div className="relative flex flex-col rounded-md border-x-[1px]">
			<div className="hidden lg:flex sticky top-0 z-[1] justify-between items-center rounded-t-md border-b-[1px] border-t-[1px] bg-white p-4">
				<div className={`${WIDTHS.CHECK} flex justify-center`}>
					<Checkbox
						checked={data.length === selected.size}
						onCheckedChange={handleSelectAll}
					/>
				</div>
				<div className="flex flex-1 items-center font-semibold">
					<p className={WIDTHS.TITLE}>Title</p>
					<p className={WIDTHS.PAID_ON}>Paid on</p>
					<p className={`${WIDTHS.AMOUNT} text-end`}>Amount</p>
				</div>
				<div className={WIDTHS.ACTIONS} />
			</div>
			<div className="sticky top-0 z-[1] lg:hidden h-[5px] rounded-t-md border-t-[1px]" />
			{data.map(item => (
				<div
					key={item.id}
					className="flex items-center  border-b-[1px] p-4 last-of-type:rounded-b-md"
				>
					{item.subItems?.length ? (
						<AccordionItem
							isPending={isPending}
							selected={selected}
							item={item}
							accountCurrency={accountCurrency}
							onPayment={onPayment}
							onEdit={onEdit}
							onDelete={onDelete}
							onSelected={handleSelectedItem}
						/>
					) : (
						<Item
							isPending={isPending}
							isSelected={selected.has(item.id)}
							item={item}
							accountCurrency={accountCurrency}
							onPayment={onPayment}
							onEdit={onEdit}
							onDelete={onDelete}
							onSelected={handleSelectedItem}
						/>
					)}
				</div>
			))}
			{total ? (
				<div className="sticky bottom-0 flex flex-1 rounded-b-md border-y-[1px] bg-gray-50 p-4">
					<div className="flex flex-1 items-end justify-end gap-2">
						<small className="font-light">total:</small>
						<p className="font-semibold">
							{formatCurrency(total, accountCurrency.code)}
						</p>
					</div>
					<div className="basis-[10%]" />
				</div>
			) : null}
			{!data.length ? (
				<div className="flex justify-center py-6">
					<p>No movements on this month</p>
				</div>
			) : null}
		</div>
	);
}
