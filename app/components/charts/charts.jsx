import { createServerClient } from '@/lib/supabase-server';
import MonthChart from './month-chart';
import MonthlyChart from './monthly-chart';

const getData = async () => {
	const supabase = createServerClient();

	const [{ data: account }, { data: accounts }] = await Promise.all([
		supabase
			.from('accounts')
			.select('id,balance,currencies(code)')
			.eq('main', true)
			.single(),
		supabase
			.from('accounts')
			.select('id,name,color,main')
			.not('latest_movement', 'is', null)
			.order('name', { ascending: true }),
	]);

	const year = new Date().getFullYear();
	const month = new Date().getMonth();

	const { data: balances } = await supabase
		.from('months_balance')
		.select('period,income,spent,account_id')
		.like('period', `${year}-%`);

	const monthsData = accounts.map(account => {
		const accountBalances = [...new Array(12)].map((_, month) => {
			const period = `${year}-${month}`;
			const balance = balances.find(
				b => b.period === period && b.account_id === account.id,
			);

			return {
				period,
				income: balance?.income ?? 0,
				spent: balance?.spent ?? 0,
			};
		});

		return {
			...account,
			data: accountBalances,
		};
	});

	const monthData = monthsData.find(d => d.id === account.id).data[month];

	return {
		account: account ?? {},
		accounts,
		monthsData,
		monthData,
	};
};

export default async function Charts() {
	const { account, accounts, monthData, monthsData } = await getData();

	return (
		<>
			<MonthChart account={account} monthData={monthData} />
			<MonthlyChart accounts={accounts} monthsData={monthsData} />
		</>
	);
}
