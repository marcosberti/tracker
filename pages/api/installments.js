import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { authRoute } from '@/lib/utils';

export default authRoute(async (req, res) => {
	if (req.method === 'POST') {
		return createInstallment(req, res);
	} else if (req.method === 'PATCH') {
		return updateInstallment(req, res);
	} else if (req.method === 'DELETE') {
		return deleteInstallment(req, res);
	}
});

const createInstallment = async (req, res) => {
	const supabase = createServerSupabaseClient({ req, res });
	const installment = req.body;
	installment.paid_installments = 0;
	installment.active = true;

	const { error } = await supabase
		.from('installments_expenses')
		.insert(installment);

	if (error) {
		res.status(500).json(error);
		return;
	}

	return res.status(201).json({ message: 'Created' });
};

const updateInstallment = async (req, res) => {
	const supabase = createServerSupabaseClient({ req, res });
	const { installmentId, ...installment } = req.body;

	const {
		data: { paid_installments, account_id },
	} = await supabase
		.from('installments_expenses')
		.select('paid_installments,account_id')
		.eq('id', installmentId)
		.single();

	if (paid_installments && account_id !== installment.account_id) {
		res.status(400).json({
			message: 'Cannot change the account once a payment has been done',
		});
	}

	const { error } = await supabase
		.from('installments_expenses')
		.update(installment)
		.eq('id', installmentId);

	if (error) {
		res.status(500).json(error);
		return;
	}

	return res.status(200).json({ message: 'Updated' });
};

const deleteInstallment = async (req, res) => {
	const supabase = createServerSupabaseClient({ req, res });
	const { installmentId } = req.query;

	const {
		data: { paid_installments },
	} = await supabase
		.from('installments_expenses')
		.select('paid_installments')
		.eq('id', installmentId)
		.single();

	if (paid_installments > 0) {
		res
			.status(500)
			.json({ message: 'installments already paid, cannot delete' });
		return;
	}

	const { error } = await supabase
		.from('installments_expenses')
		.delete()
		.eq('id', installmentId);

	if (error) {
		res.status(500).json(error);
		return;
	}

	return res.status(200).json({ message: 'Deleted' });
};
