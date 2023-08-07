import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { authRoute } from '@/lib/utils';

export default authRoute(async (req, res) => {
	if (req.method === 'POST') {
		return createScheduled(req, res);
	} else if (req.method === 'PATCH') {
		return updateScheduled(req, res);
	} else if (req.method === 'DELETE') {
		return deleteScheduled(req, res);
	}
});

const createScheduled = async (req, res) => {
	const supabase = createServerSupabaseClient({ req, res });
	const scheduled = req.body;
	scheduled.active = true;

	const { error } = await supabase.from('scheduled_expenses').insert(scheduled);

	if (error) {
		res.status(500).json(error);
		return;
	}

	return res.status(201).json({ message: 'Created' });
};

const updateScheduled = async (req, res) => {
	const supabase = createServerSupabaseClient({ req, res });
	const { scheduledId, ...scheduled } = req.body;

	const { data } = await supabase
		.from('movements')
		.select('account_id')
		.eq('scheduled_id', scheduledId)
		.single();

	if (data?.account_id && data?.account_id !== scheduled.account_id) {
		res.status(400).json({
			message: 'Cannot change the account once a payment has been done',
		});
	}

	const { error } = await supabase
		.from('scheduled_expenses')
		.update(scheduled)
		.eq('id', scheduledId);

	if (error) {
		res.status(500).json(error);
		return;
	}

	return res.status(200).json({ message: 'Updated' });
};

const deleteScheduled = async (req, res) => {
	const supabase = createServerSupabaseClient({ req, res });
	const { scheduledId } = req.query;

	const { count } = await supabase
		.from('movements')
		.select('*', { count: 'exact' })
		.eq('scheduled_id', scheduledId);

	if (count) {
		res.status(500).json({ message: 'scheduled already paid, cannot delete' });
		return;
	}

	const { error } = await supabase
		.from('scheduled_expenses')
		.delete()
		.eq('id', scheduledId);

	if (error) {
		res.status(500).json(error);
		return;
	}

	return res.status(200).json({ message: 'Deleted' });
};
