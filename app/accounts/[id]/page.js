import Actions from './components/Actions';
import Breadcrumb from './components/Breadcrumb';
import Overview from './components/Overview';
import SummarizedCategories from './components/SummarizedCategories';
import Movements from './components/Movements';
import { createServerClient } from '@/lib/supabase-server';
import { getMonthDates, getTotalized } from '@/lib/utils';

function getSummarized(account, movements, initialState = {}) {
	const summarized = movements.reduce((acc, movement) => {
		if (movement.subItems?.length) {
			getSummarized(account, movement.subItems, acc);
		} else {
			if (!acc[movement.categories.id]) {
				acc[movement.categories.id] = {
					...movement.categories,
					amount: 0,
					currencies: account.currencies,
				};
			}
			const category = acc[movement.categories.id];
			const amount =
				movement.currencies.id === account.currencies.id
					? movement.amount
					: movement.amount * movement.exchange_rate;
			category.amount += amount;
		}

		return acc;
	}, initialState);

	return Object.values(summarized).sort((a, b) => (a.name > b.name ? 1 : -1));
}

async function getAccount(id, month, year) {
	const supabase = createServerClient();
	const { start: dateFrom, end: dateTo } = getMonthDates(year, month);

	const [
		{ data: account },
		{ data: currencies },
		{ data: categories },
		{ data: allMovements },
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
		supabase
			.from('movements')
			.select(
				'id,title,description,amount,exchange_rate,created_at,currencies(id,code),categories(id,name,icon,color,movement_types(type)),installment_id,scheduled_id,parent_movement_id',
			)
			.eq('account_id', id)
			.order('created_at', { ascending: false })
			.gte('created_at', dateFrom)
			.lte('created_at', dateTo),
	]);

	const parentMovements = allMovements.filter(m => !m.parent_movement_id);
	const childMovements = allMovements.filter(m => m.parent_movement_id);
	const movements = parentMovements.map(m => ({
		...m,
		subItems: childMovements.filter(c => c.parent_movement_id === m.id),
	}));

	const income = getTotalized(account, movements, 'income');
	const spent = getTotalized(account, movements, 'spent');
	const summarized = getSummarized(account, movements);

	return {
		account,
		currencies,
		categories,
		movements,
		income,
		spent,
		summarized,
	};
}

export default async function Account({
	params: { id },
	searchParams: { month, year, onlyPending },
}) {
	const {
		account,
		currencies,
		categories,
		movements,
		income,
		spent,
		summarized,
	} = await getAccount(id, month, year);
	const isInCurrentMonth = !month;

	return (
		<div className="flex flex-col gap-4">
			<Breadcrumb account={account} />
			<div className="flex gap-8">
				<Overview account={account} income={income} spent={spent} />
				<SummarizedCategories account={account} summarized={summarized} />
			</div>
			<div>
				<Actions
					isInCurrentMonth={isInCurrentMonth}
					account={account}
					movements={movements}
					currencies={currencies}
					categories={categories}
				/>
			</div>
			<div>
				<Movements
					isInCurrentMonth={isInCurrentMonth}
					onlyPending={onlyPending}
					movements={movements}
					account={account}
					currencies={currencies}
					categories={categories}
				/>
			</div>
		</div>
	);
}
