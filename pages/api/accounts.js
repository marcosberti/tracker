import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { authRoute } from '@/lib/utils';

export default authRoute(async (req, res) => {
	if (req.method === 'POST') {
		return createAccount(req, res);
	} else if (req.method === 'PATCH') {
		return updateAccount(req, res);
	} else if (req.method === 'DELETE') {
		return deleteAccount(req, res);
	}
});

async function createAccount(req, res) {
  const supabase = createServerSupabaseClient({ req, res });
  const { currencyId, ...account } = req.body
  account.currency_id = currencyId;
  account.balance = 0;

  const { count } = await supabase.from('accounts').select('*', { count: 'exact' });
  if (!count && !account.main) {
    account.main = true;
  }

	const { error } = await supabase
		.from('accounts')
		.insert(account);

	if (error) {
		res.status(500).json(error);
		return;
	}

	return res.status(201).json({ message: 'Created' });
}

async function updateAccount(req, res) {
	const supabase = createServerSupabaseClient({ req, res });
  const { accountId, currencyId, ...account } = req.body
  account.currency_id = currencyId;

  const queries = [];
  const { data: mainAccount } = await supabase.from('accounts').select('*').eq('main', true);

  queries.push(
    supabase.from('accounts').update(account).eq('id', accountId),
  )

  if (account.main && accountId !== mainAccount.id) {
    queries.push(
      supabase.from('accounts').update({ main: false }).eq('id', mainAccount.id),
    )
  }

  const [{ error: accountError }, { error: mainError} = {}] = await Promise.all(queries);
  if (accountError || mainError) {
		res.status(500).json(accountError || mainError);
		return;
  }

	return res.status(200).json({ message: 'Updated' });
}

async function deleteAccount(req, res) {
  const supabase = createServerSupabaseClient({ req, res });
  const { accountId } = req.query;
  
  const { data: account } = await supabase.from('accounts').select('*').eq('id', accountId);
  if (account.latest_movement) {
    res.status(500).json({ message: 'Cannot delete an account that already has movements' })
    return
  }

  const {error} = await supabase.from('accounts')
		.delete()
		.eq('id', accountId);

	if (error) {
		res.status(500).json(error);
		return;
	}

	return res.status(200).json({ message: 'Deleted' });

}

