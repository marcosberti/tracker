import { createServerClient } from '@/lib/supabase-server';
import Account from './components/account';
import Actions from './components/actions';

async function getData() {
	const supabase = createServerClient();

	const [{ data: accounts }, { data: currencies }] = await Promise.all([
		supabase
			.from('accounts')
			.select(
				'id,name,color,icon,balance,currencies(id,code),latest_movement,main',
			)
			.order('name', { ascending: true }),
		supabase
			.from('currencies')
			.select('id,name,code')
			.order('name', { ascending: true }),
	]);

	return { accounts, currencies };
}

export default async function Accounts() {
	const { accounts, currencies } = await getData();

	return (
		<>
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-bold">Accounts</h2>
				<Actions currencies={currencies} />
			</div>
			<div className="bg-pur mt-4 flex flex-wrap gap-4">
				{accounts.map(account => (
					<Account key={account.id} account={account} currencies={currencies} />
				))}
			</div>
			{!accounts.length ? (
				<div className="mt-10 flex justify-center">
					<p>You have no accounts yet</p>
				</div>
			) : null}
		</>
	);
}
