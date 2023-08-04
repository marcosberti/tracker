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
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, getTotalized } from '@/lib/utils';
import Icon from '@/app/components/Icon';
import DropdownItemDialog from '@/app/components/DropdownItemDialog';
import { Badge } from '@/components/ui/badge';

function getItemAmount(item, accountCurrency) {
	const isSameCurrency = item.currencies.id === accountCurrency.id;
	let amount = !Number.isNaN(item.amount) ? item.amount : null;

	if (!isSameCurrency && amount) {
		amount *= item.exchange_rate;
	}

	return amount;
}

function Item({ item, accountCurrency }) {
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
		totalItems = getTotalized(
			{ currencies: accountCurrency },
			item.subItems,
			item.categories.movement_types.type,
		);
		showWarning = totalItems !== amount;
	}

	return (
		<>
			<div className={`flex basis-[${WIDTHS.ICON}] justify-center`}>
				{item.subItems?.length ? (
					<Layers />
				) : (
					<Icon
						icon={item.categories.icon}
						className={`text-${item.categories.color}-700`}
					/>
				)}
			</div>
			<p className={`basis-[${WIDTHS.TITLE}] text-start`}>
				{item.title}{' '}
				{expenseType ? <Badge variant="secondary">{expenseType}</Badge> : null}
				{item.isPaymentPending ? (
					<Badge variant="outline">pending payment</Badge>
				) : null}
				{item.description ? <small>{item.description}</small> : null}
			</p>
			<p className={`basis-[${WIDTHS.PAID_ON}] text-start`}>
				{item.created_at ? formatDate(item.created_at) : '-'}
			</p>
			<div className={`flex flex-col basis-[${WIDTHS.AMOUNT}] text-end`}>
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
		<div className={`flex justify-center basis-[${WIDTHS.ACTIONS}]`}>
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

function AccordionItem({
	item,
	accountCurrency,
	isPending,
	onPayment,
	onEdit,
	onDelete,
}) {
	return (
		<Accordion type="single" collapsible className="w-full">
			<RadixAccordionItem
				className="flex-1 border-0 "
				value={`item-${item.id}`}
			>
				<AccordionTrigger
					className="p-0 hover:no-underline"
					disabled={!item.subItems?.length}
				>
					<div className="flex basis-[90%]">
						<Item item={item} accountCurrency={accountCurrency} />
					</div>
				</AccordionTrigger>
				<AccordionContent className="mt-4 bg-gray-100">
					<div className="rounded-full px-4 pt-4">
						{item.subItems?.map(subItem => (
							<div className="flex items-center py-2">
								<Item
									key={subItem.id}
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

const WIDTHS = {
	ICON: '10%',
	TITLE: '39%',
	PAID_ON: '29%',
	AMOUNT: '22%',
	ACTIONS: '10%',
};

export default function List({
	isPending,
	data,
	accountCurrency,
	onPayment,
	onEdit,
	onDelete,
}) {
	return (
		<div className="flex flex-col rounded-md border">
			<div className="flex justify-between border-b-2 p-4">
				<div className="flex flex-1 font-semibold">
					<div className={`basis-[${WIDTHS.ICON}]`} />
					<p className={`basis-[${WIDTHS.TITLE}]`}>Title</p>
					<p className={`basis-[${WIDTHS.PAID_ON}]`}>Paid on</p>
					<p className={`basis-[${WIDTHS.AMOUNT}] text-end`}>Amount</p>
				</div>
				<div className={`basis-[${WIDTHS.ACTIONS}]`} />
			</div>
			{data.map(item => (
				<div
					key={item.id}
					className="flex items-center border-b-[1px] px-4 py-6"
				>
					{item.subItems?.length ? (
						<AccordionItem
							isPending={isPending}
							item={item}
							accountCurrency={accountCurrency}
							onPayment={onPayment}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					) : (
						<>
							<div
								className={`flex flex-1 items-center ${
									item.isPaymentPending ? 'opacity-50' : null
								}`}
							>
								<Item item={item} accountCurrency={accountCurrency} />
							</div>
							<Actions
								isPending={isPending}
								item={item}
								onPayment={onPayment}
								onEdit={onEdit}
								onDelete={onDelete}
							/>
						</>
					)}
				</div>
			))}
			{!data.length ? (
				<div className="flex justify-center py-6">
					<p>No movements on this month</p>
				</div>
			) : null}
		</div>
	);
}
