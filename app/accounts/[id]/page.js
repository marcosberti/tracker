import { createServerClient } from '@/lib/supabase-server';
import { getMonthDates } from '@/lib/utils';
import Actions from './components/Actions';
import Breadcrumb from './components/Breadcrumb';
import Overview from './components/Overview';
import SummarizedCategories from './components/SummarizedCategories';
import Movements from './components/Movements';

async function getAccount(id, month, year) {
	const supabase = createServerClient();
	const { start: dateFrom, end: dateTo } = getMonthDates(year, month);

	const [
		{ data: account },
		{ data: currencies },
		{ data: categories },
		{ data: income },
		{ data: spent },
		{ data: summarized },
	] = await Promise.all([
		supabase
			.from('accounts')
			.select('id,name,balance,currencies(id,code)')
			.eq('id', id)
			.limit(1)
			.single(),
		supabase
			.from('currencies')
			.select('id,name,code')
			.order('name', { ascending: true }),
		supabase
			.from('categories')
			.select('id,name,movement_types(type)')
			.order('name', { ascending: true }),
		supabase.rpc('get_monthly_income', {
			accountid: id,
			datefrom: dateFrom,
			dateto: dateTo,
		}),
		supabase.rpc('get_monthly_spent', {
			accountid: id,
			datefrom: dateFrom,
			dateto: dateTo,
		}),
		supabase.rpc('get_summarized_categories', {
			accountid: id,
			datefrom: dateFrom,
			dateto: dateTo,
		}),
	]);

	return {
		account,
		currencies,
		categories,
		income,
		spent,
		summarized,
	};
}

export default async function Account({
	params: { id },
	searchParams: { month, year, onlyPending },
}) {
	const { account, currencies, categories, income, spent, summarized } =
		await getAccount(id, month, year);

	return (
		<>
			<Breadcrumb account={account} />
			<div className="mt-4 flex gap-8">
				<Overview account={account} income={income} spent={spent} />
				<SummarizedCategories account={account} summarized={summarized} />
			</div>
			<div className="mt-4">
				<Actions
					account={account}
					currencies={currencies}
					categories={categories}
				/>
			</div>
			<div className="mt-4">
				<Movements
					onlyPending={onlyPending}
					month={month}
					year={year}
					account={account}
					currencies={currencies}
					categories={categories}
				/>
			</div>
		</>
	);
}
