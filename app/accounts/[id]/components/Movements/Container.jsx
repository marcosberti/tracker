import { createServerClient } from '@/lib/supabase-server';
import Movements from './Movements';

function getPaidExpenses(movements, expenseIdKey) {
	return movements.reduce((acc, movement) => {
		if (movement.subItems?.length) {
			return [...acc, getPaidExpenses(movement.subItems)];
		} else if (movement[expenseIdKey]) {
			acc.push(movement[expenseIdKey]);
		}
		return acc;
	}, []);
}

async function getData({ onlyPending, account, movements, isInCurrentMonth }) {
	const supabase = createServerClient();

	const paidInstallments = getPaidExpenses(movements, 'installment_id');
	const paidScheduled = getPaidExpenses(movements, 'scheduled_id');

	let [{ data: installments }, { data: scheduled }] = await Promise.all([
		supabase
			.from('installments_expenses')
			.select(
				'id,title,description,amount,installments,paid_installments,categories(id,name,icon,color)',
			)
			.eq('account_id', account.id)
			.eq('active', true)
			.not('id', 'in', `(${paidInstallments.join()})`),
		supabase
			.from('scheduled_expenses')
			.select('id,title,description,amount,categories(id,name,icon,color)')
			.eq('account_id', account.id)
			.not('id', 'in', `(${paidScheduled.join()})`),
	]);

	if (!isInCurrentMonth) {
		return movements;
	}

	installments = installments
		? installments.map(i => ({
				...i,
				isInstallment: true,
				isPaymentPending: true,
				currencies: account.currencies,
		  }))
		: [];

	scheduled = scheduled
		? scheduled.map(s => ({
				...s,
				isScheduled: true,
				isPaymentPending: true,
				currencies: account.currencies,
		  }))
		: [];

	// only show pending payments in current month
	return onlyPending
		? [...installments, ...scheduled]
		: [...movements, ...installments, ...scheduled];
}

export default async function Container({
	onlyPending,
	movements,
	account,
	currencies,
	categories,
	isInCurrentMonth,
}) {
	const allMovements = await getData({
		onlyPending,
		account,
		movements,
		isInCurrentMonth,
	});

	return (
		<Movements
			data={allMovements}
			account={account}
			currencies={currencies}
			categories={categories}
		/>
	);
}
