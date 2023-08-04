import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { authRoute } from '@/lib/utils';

export default authRoute(async (req, res) => {
	if (req.method === 'POST') {
		return createMovement(req, res);
	} else if (req.method === 'PATCH') {
		return updateMovement(req, res);
	} else if (req.method === 'DELETE') {
		return deleteMovement(req, res);
	}
});

const createMovement = async (req, res) => {
	const supabase = createServerSupabaseClient({ req, res });
	const {
		accountId,
		categoryId,
		title,
		description,
		amount,
		currencyId,
		exchangeRate,
		scheduledId,
		installmentId,
		parentMovementId,
	} = req.body;

	const [
		{ data: account, error: accountError },
		{ data: category, error: categoryError },
	] = await Promise.all([
		supabase.from('accounts').select('balance').eq('id', accountId).single(),
		supabase
			.from('categories')
			.select('movement_types(id,type)')
			.eq('id', categoryId)
			.single(),
	]);

	if (accountError || categoryError) {
		res.status(400).json(accountError || categoryError);
		return;
	}

	const isIncome = category.movement_types.type === 'income';
	const newBalance = account.balance + (isIncome ? amount : amount * -1);

	const rpc = {
		name: 'create_movement',
		data: {
			accountid: accountId,
			newbalance: newBalance,
			latestmovement: new Date().toISOString(),
			title: title,
			description: description,
			amount: amount,
			currencyid: currencyId,
			exchangerate: exchangeRate || null,
			categoryid: categoryId,
			scheduledid: scheduledId || null,
			parentmovementid: parentMovementId || null,
		},
	};

	if (installmentId) {
		const { data: installment, error } = await supabase
			.from('installments_expenses')
			.select('installments,paid_installments')
			.eq('id', installmentId)
			.single();

		if (error) {
			res.status(400).json(error);
			return;
		}

		const paidInstallments = installment.paid_installments + 1;
		rpc.data.installmentid = installmentId;
		rpc.data.paidinstallments = paidInstallments;
		rpc.data.activeinstallment = installment.installments >= paidInstallments;

		rpc.name = 'create_installment_movement';
	}

	const { error } = await supabase.rpc(rpc.name, rpc.data);

	if (error) {
		res.status(500).json(error);
		return;
	}

	return res.status(201).json({ message: 'Created' });
};

const updateMovement = async (req, res) => {
	const supabase = createServerSupabaseClient({ req, res });
	const {
		accountId,
		movementId,
		categoryId,
		title,
		description,
		amount,
		currencyId,
		exchangeRate,
	} = req.body;

	const [{ data: account }, { data: movement }] = await Promise.all([
		supabase.from('accounts').select('balance').eq('id', accountId).single(),
		supabase.from('movements').select('amount').eq('id', movementId).single(),
	]);

	const rpc = {
		name: 'update_movement',
		data: {
			accountid: accountId,
			movementid: movementId,
			newbalance: account.balance - movement.amount + amount,
			newtitle: title,
			newdescription: description,
			newamount: amount,
			currencyid: currencyId,
			exchangerate: exchangeRate || 0,
			categoryid: categoryId,
		},
	};

	const { error } = await supabase.rpc(rpc.name, rpc.data);

	if (error) {
		res.status(400).json(error);
		return;
	}

	return res.status(200).json({ message: 'Updated!' });
};

const deleteMovement = async (req, res) => {
	const supabase = createServerSupabaseClient({ req, res });

	const { accountId, movementId } = req.query;

	const [{ data: account }, { data: movement }] = await Promise.all([
		supabase.from('accounts').select('id,balance').eq('id', accountId).single(),
		supabase
			.from('movements')
			.select('id,amount,categories(movement_types(type)),installment_id')
			.eq('id', movementId)
			.single(),
	]);

	const isIncome = movement.categories.movement_types.type === 'income';
	const amount = isIncome ? movement.amount * -1 : movement.amount;

	const rpc = {
		name: 'delete_movement',
		data: {
			accountid: account.id,
			movementid: movement.id,
			newbalance: account.balance + amount,
		},
	};

	if (movement.installment_id) {
		const { data: installment, error: installmentError } = await supabase
			.from('installments_expenses')
			.select('installments,paid_installments,active')
			.eq('id', movement.installment_id)
			.single();

		if (installmentError) {
			res.status(400).json(installmentError);
			return;
		}

		rpc.name = 'delete_installment_movement';
		rpc.data.installmentid = movement.installment_id;
		rpc.data.paidinstallments = installment.paid_installments - 1;
		rpc.data.activeinstallment =
			installment.installments >= installment.paid_installments;
	}

	const { error } = await supabase.rpc(rpc.name, rpc.data);

	if (error) {
		res.status(400).json({ error, data: rpc.data });
		return;
	}

	res.status(200).json({ message: 'Deleted' });
};
