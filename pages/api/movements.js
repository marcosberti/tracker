import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { authRoute, getPeriod } from '@/lib/utils';

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
	const period = getPeriod();

	const {
		accountId,
		categoryId,
		title,
		description,
		amount,
		date,
		currencyId,
		exchangeRate,
		scheduledId,
		installmentId,
		parentMovementId,
	} = req.body;

	let monthResult = await supabase
		.from('months_balance')
		.select('income,spent')
		.eq('period', period)
		.eq('account_id', accountId);

	if (monthResult.error) {
		res.status(400).json(monthResult.error);
		return;
	}

	if (!monthResult.data.length) {
		monthResult = await supabase
			.from('months_balance')
			.insert({ period, income: 0, spent: 0, account_id: accountId })
			.select();

		if (monthResult.error) {
			res.status(400).json(monthResult.error);
			return;
		}
	}

	let [{ income: monthIncome, spent: monthSpent }] = monthResult.data;

	const [
		{ data: account, error: accountError },
		{ data: category, error: categoryError },
	] = await Promise.all([
		supabase.from('accounts').select('balance').eq('id', accountId).single(),
		supabase
			.from('categories')
			.select('movement_types(type)')
			.eq('id', categoryId)
			.single(),
	]);

	if (accountError || categoryError) {
		res.status(400).json(accountError || categoryError);
		return;
	}

	let newBalance = account.balance;

	if (!parentMovementId) {
		const isIncome = category.movement_types.type === 'income';
		const newAmount = exchangeRate ? exchangeRate * amount : amount;

		if (isIncome) {
			monthIncome += newAmount;
		} else {
			monthSpent += newAmount;
		}

		newBalance = account.balance + (isIncome ? newAmount : newAmount * -1);
	}

	const rpc = {
		name: 'create_movement',
		data: {
			accountid: accountId,
			newbalance: newBalance,
			movementdate: date,
			title: title,
			description: description,
			amount: amount,
			currencyid: currencyId,
			exchangerate: exchangeRate || null,
			categoryid: categoryId,
			scheduledid: scheduledId || null,
			parentmovementid: parentMovementId || null,
			monthincome: monthIncome,
			monthspent: monthSpent,
			monthperiod: period,
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
		date,
		currencyId,
		exchangeRate,
	} = req.body;

	const [{ data: account }, { data: movement }] = await Promise.all([
		supabase.from('accounts').select('balance').eq('id', accountId).single(),
		supabase
			.from('movements')
			.select(
				'amount,exchange_rate,created_at,categories(movement_types(type)),parent_movement_id',
			)
			.eq('id', movementId)
			.single(),
	]);

	const period = getPeriod(movement.created_at);

	const { data: monthBalance } = await supabase
		.from('months_balance')
		.select('income,spent')
		.eq('period', period)
		.eq('account_id', accountId)
		.single();

	let newBalance = account.balance;

	if (!movement.parent_movement_id) {
		const newAmount = exchangeRate ? exchangeRate * amount : amount;
		const oldAmount = movement.exchange_rate
			? movement.exchange_rate * movement.amount
			: movement.amount;

		if (movement.categories.movement_types.type === 'income') {
			monthBalance.income = monthBalance.income - oldAmount + newAmount;
		} else {
			monthBalance.spent = monthBalance.spent - oldAmount + newAmount;
		}

		newBalance = account.balance - oldAmount + newAmount;
	}

	const rpc = {
		name: 'update_movement',
		data: {
			accountid: accountId,
			movementid: movementId,
			newbalance: newBalance,
			newtitle: title,
			newdescription: description,
			newamount: amount,
			newdate: date,
			currencyid: currencyId,
			exchangerate: exchangeRate || 0,
			categoryid: categoryId,
			monthincome: monthBalance.income,
			monthspent: monthBalance.spent,
			monthperiod: period,
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
			.select(
				'id,amount,exchange_rate,categories(movement_types(type)),installment_id,created_at,parent_movement_id',
			)
			.eq('id', movementId)
			.single(),
	]);

	const period = getPeriod(movement.created_at);

	const { data: monthBalance } = await supabase
		.from('months_balance')
		.select('income,spent')
		.eq('period', period)
		.eq('account_id', accountId)
		.single();

	let newBalance = account.balance;

	if (!movement.parent_movement_id) {
		const isIncome = movement.categories.movement_types.type === 'income';
		const amount = movement.exchange_rate
			? movement.exchange_rate * movement.amount
			: movement.amount;

		if (isIncome) {
			monthBalance.income -= amount;
		} else {
			monthBalance.spent -= amount;
		}

		newBalance = account.balance + (isIncome ? amount * -1 : amount);
	}

	const rpc = {
		name: 'delete_movement',
		data: {
			accountid: account.id,
			movementid: movement.id,
			newbalance: newBalance,
			monthincome: monthBalance.income,
			monthspent: monthBalance.spent,
			monthperiod: period,
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
