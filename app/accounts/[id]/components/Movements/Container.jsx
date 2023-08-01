import { createServerClient } from '@/lib/supabase-server';
import { getMonthDates } from '@/lib/utils';
import Movements from './Movements';

const getData = async (year, month, account, onlyPending) => {
	const supabase = createServerClient();
	const { start: dateFrom, end: dateTo } = getMonthDates(year, month);

	const { data: movements } = await supabase
		.from('movements')
		.select(
			'id,title,description,amount,exchange_rate,created_at,currencies(id,code),categories(id,name,icon,color,movement_types(type)),installment_id,scheduled_id',
		)
		.eq('account_id', account.id)
		.order('created_at', { ascending: false })
		.lte('created_at', dateTo)
		.gte('created_at', dateFrom);

	const paidInstallments = movements.map(m => m.installment_id).filter(Boolean);
	const paidScheduled = movements.map(m => m.scheduled_id).filter(Boolean);

	let [{ data: installments }, { data: scheduled }] = await Promise.all([
		supabase
			.from('installments_expenses')
			.select(
				'id,title,description,amount,installments,paid_installments,categories(name,icon,color)',
			)
			.eq('account_id', account.id)
			.eq('active', true)
			.not('id', 'in', `(${paidInstallments.join()})`),
		supabase
			.from('scheduled_expenses')
			.select('id,title,description,amount,categories(name,icon,color)')
			.eq('account_id', account.id)
			.not('id', 'in', `(${paidScheduled.join()})`),
	]);

	if (month) {
		return movements;
	}

	installments = installments
		? installments.map(i => ({
				...i,
				isPaymentPending: true,
				currencies: account.currencies,
		  }))
		: [];

	scheduled = scheduled
		? scheduled.map(s => ({
				...s,
				isPaymentPending: true,
				currencies: account.currencies,
		  }))
		: [];

	// only show pending payments in current month
	return onlyPending
		? [...installments, ...scheduled]
		: [...movements, ...installments, ...scheduled];
};

export default async function Container({
	onlyPending,
	month,
	year,
	account,
	currencies,
	categories,
}) {
	const movements = await getData(year, month, account, onlyPending);

	return (
		<Movements
			data={movements}
			account={account}
			currencies={currencies}
			categories={categories}
		/>
	);
}
