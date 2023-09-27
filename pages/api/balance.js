import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { authRoute, getMonthDates, getPeriod } from '@/lib/utils';

export default authRoute(async (req, res) => {
	if (req.method === 'PATCH') {
		return refreshAccountBalance(req, res);
	}
});

function getSummarized(movements, type) {
	return movements
		.filter(m => m.categories.movement_types.type === type)
		.reduce((acc, m) => {
			const amount = m.exchange_rate ? m.exchange_rate * m.amount : m.amount;

			return acc + amount;
		}, 0);
}

async function refreshAccountBalance(req, res) {
	const supabase = createServerSupabaseClient({ req, res });
	const period = getPeriod();
	const { accountId } = req.body;
	const [year, month] = period.split('-');
	const { start, end } = getMonthDates(year, month);

	console.log('>>>', period, start, end);

	const [
		{ data: account, error: accountError },
		{ data: monthBalance, error: monthError },
		{ data: movements, error: movementsError },
	] = await Promise.all([
		supabase.from('accounts').select('balance').eq('id', accountId),
		supabase
			.from('months_balance')
			.select('income,spent')
			.eq('account_id', accountId)
			.eq('period', period),
		supabase
			.from('movements')
			.select(
				'title,amount,exchange_rate,categories(movement_types(type)),parent_movement_id',
			)
			.eq('account_id', accountId)
			.is('parent_movement_id', null)
			.gte('created_at', start)
			.lte('created_at', end),
	]);

	if (accountError || monthError || movementsError) {
		res.status(400).json(accountError || monthError || movementsError);
		return;
	}

	const income = getSummarized(movements, 'income');
	const spent = getSummarized(movements, 'spent');
	const balance =
		account.balance - monthBalance.income + monthBalance.spent + income - spent;

	const [{ error: accountUpdError }, { error: monthBalanceUpdError }] =
		await Promise.all([
			supabase.from('accounts').update({ balance }).eq('id', accountId),
			supabase
				.from('months_balance')
				.update({ income, spent })
				.eq('account_id', accountId)
				.eq('period', period),
		]);

	if (accountUpdError || monthBalanceUpdError) {
		res.status(400).json(accountUpdError || monthBalanceUpdError);
		return;
	}

	return res.status(200).json({ message: 'Sync successfuly', data: movements });
}
