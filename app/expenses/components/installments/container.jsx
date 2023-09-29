import { createServerClient } from '@/lib/supabase-server';
import Installments from './installments';

const PAGE_SIZE = 5;

async function getInstallments({
	installmentsPage,
	showInactiveInstallments = false,
} = {}) {
	const supabase = createServerClient();

	const from = (installmentsPage - 1) * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	const countQuery = supabase
		.from('installments_expenses')
		.select('*', { count: 'exact', head: true });

	const installmentsQuery = supabase
		.from('installments_expenses')
		.select(
			'id,title,description,amount,first_payment_date,installments,paid_installments,active,categories(id,icon,color,name),accounts(id,name,currencies(code))',
		)
		.order('title', { ascending: true })
		.range(from, to);

	if (!showInactiveInstallments) {
		countQuery.eq('active', true);
		installmentsQuery.eq('active', true);
	}

	const [{ count }, { data: installments }] = await Promise.all([
		countQuery,
		installmentsQuery,
	]);

	return {
		count,
		installments: installments ?? [],
	};
}

export default async function Container({
	accounts,
	categories,
	installmentsPage,
	showInactiveInstallments,
}) {
	const { installments, count } = await getInstallments({
		installmentsPage,
		showInactiveInstallments,
	});

	return (
		<Installments
			accounts={accounts}
			categories={categories}
			count={count}
			page={installmentsPage}
			size={PAGE_SIZE}
			installments={installments}
		/>
	);
}
