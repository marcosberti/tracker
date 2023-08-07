import { createServerClient } from '@/lib/supabase-server';
import Scheduled from './scheduled';

const PAGE_SIZE = 4;

async function getScheduled({
	scheduledPage,
	showInactiveScheduled = false,
} = {}) {
	const supabase = createServerClient();

	const from = (scheduledPage - 1) * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	const countQuery = supabase
		.from('scheduled_expenses')
		.select('*', { count: 'exact', head: true });

	const scheduledQuery = supabase
		.from('scheduled_expenses')
		.select(
			'id,title,description,amount,from_date,to_date,categories(id,icon,color,name),accounts(id,name,currencies(code)),active',
		)
		.order('title', { ascending: true })
		.range(from, to);

	if (!showInactiveScheduled) {
		countQuery.eq('active', true);
		scheduledQuery.eq('active', true);
	}

	const [{ count }, { data: schedules }] = await Promise.all([
		countQuery,
		scheduledQuery,
	]);

	return {
		count,
		schedules: schedules ?? [],
	};
}

export default async function Container({
	accounts,
	categories,
	scheduledPage,
	showInactiveScheduled,
}) {
	const { schedules, count } = await getScheduled({
		scheduledPage,
		showInactiveScheduled,
	});

	return (
		<Scheduled
			accounts={accounts}
			categories={categories}
			count={count}
			page={scheduledPage}
			size={PAGE_SIZE}
			schedules={schedules}
		/>
	);
}
