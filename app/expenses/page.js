import { createServerClient } from '@/lib/supabase-server';
import Installments from './components/installments';
import Scheduled from './components/scheduled';

async function getData() {
	const supabase = createServerClient();
	const [{ data: accounts }, { data: categories }] = await Promise.all([
		supabase
			.from('accounts')
			.select('id,name,currencies(id,code)')
			.order('name', { ascending: true }),
		supabase.from('categories').select('id,name'),
	]);

	return {
		accounts,
		categories,
	};
}

export default async function Expenses({
	searchParams: {
		scheduledPage = 1,
		installmentsPage = 1,
		showInactiveScheduled,
		showInactiveInstallments,
	},
}) {
	const { accounts, categories } = await getData();

	return (
		<div className="flex flex-col gap-8">
			<h2 className="text-xl font-semibold underline">manage your expenses</h2>
			<Installments
				accounts={accounts}
				categories={categories}
				installmentsPage={installmentsPage}
				showInactiveInstallments={showInactiveInstallments}
			/>
			<Scheduled
				accounts={accounts}
				categories={categories}
				scheduledPage={scheduledPage}
				showInactiveScheduled={showInactiveScheduled}
			/>
		</div>
	);
}
