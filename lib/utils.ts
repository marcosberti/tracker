import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const COLORS = [
	'stone',
	'red',
	'orange',
	'amber',
	'yellow',
	'lime',
	'green',
	'emerald',
	'teal',
	'cyan',
	'sky',
	'blue',
	'indigo',
	'violet',
	'purple',
	'fuchsia',
	'pink',
	'rose',
];

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function blobToBase64(blob: Blob) {
	const reader = new FileReader();
	return new Promise(resolve => {
		reader.readAsDataURL(blob);
		reader.onloadend = () => {
			resolve(reader.result);
		};
	});
}

export async function toDataURL(blob: Blob) {
	let buffer = Buffer.from(await blob.arrayBuffer());
	return 'data:' + blob.type + ';base64,' + buffer.toString('base64');
}

export function getStartOfMonth(date = new Date()) {
	const start = new Date(date.getFullYear(), date.getMonth(), 1);
	start.setUTCHours(0, 0, 0, 0);

	return start.toISOString();
}

export function getEndOfMonth(date = new Date()) {
	const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	end.setUTCHours(23, 59, 59, 999);

	return end.toISOString();
}

export function getMonthsDates() {
	const year = new Date().getFullYear();

	return [...new Array(12)].map((_, i) => ({
		start: getStartOfMonth(new Date(year, i, 1)),
		end: getEndOfMonth(new Date(year, i + 1, 0)),
	}));
}

export const formatCurrency = (value: number, currency: string) => {
	return new Intl.NumberFormat('es-AR', {
		currency,
		style: 'currency',
		maximumFractionDigits: currency === 'BTC' ? 20 : 2,
	}).format(value);
};

const getNewDate = (date: string) => {
	return date.length > 10 ? new Date(date) : new Date(`${date}T00:00:00`);
};

type Options = {
	dateStyle: 'medium' | 'full' | 'long' | 'short';
};

export const formatDate = (
	date: string | Date,
	options: Options = { dateStyle: 'medium' },
) => {
	const dateIns = date instanceof Date ? date : getNewDate(date);
	return new Intl.DateTimeFormat('es-AR', {
		...options,
	}).format(dateIns);
};

export const getMonthDates = (
	year: number | undefined,
	month: number | undefined,
) => {
	const tempDate = new Date();
	const y = year ?? tempDate.getFullYear();
	const m = month ?? tempDate.getMonth();

	const date = new Date(y, m, 1);
	return {
		start: getStartOfMonth(date),
		end: getEndOfMonth(date),
	};
};

export const authRoute = (handler: Function) => {
	return async (req, res) => {
		const supabase = createServerSupabaseClient({ req, res });
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session) {
			return res.status(401).json({
				error: 'not_authenticated',
				description:
					'The user does not have an active session or is not authenticated',
			});
		}

		handler(req, res);
	};
};

export function timeout(ms: number = 5000) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve('go');
		}, ms);
	});
}

export function getTotalized(
	account,
	movements,
	movementType: 'income' | 'spent',
) {
	const expenseMovs = movements.filter(
		m => m.categories.movement_types.type === movementType,
	);

	const income = expenseMovs.reduce((acc, movement) => {
		let amount;
		if (movement.subItems?.length) {
			amount = getTotalized(account, movement.subItems, movementType);
		} else {
			amount =
				movement.currencies.id === account.currencies.id
					? movement.amount
					: movement.amount * movement.exchange_rate;
		}

		return acc + amount;
	}, 0);

	return income;
}
