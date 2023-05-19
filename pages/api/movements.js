import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { authRoute } from "@/lib/utils";

export default authRoute(async (req, res) => {
  if (req.method === "POST") {
    return createMovement(req, res);
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
  } = req.body;

  const [
    { data: account, error: accountError },
    { data: category, error: categoryError },
  ] = await Promise.all([
    supabase.from("accounts").select("balance").eq("id", accountId).single(),
    supabase
      .from("categories")
      .select("movement_types(id,type)")
      .eq("id", categoryId)
      .single(),
  ]);

  if (accountError || categoryError) {
    res.status(400).json(accountError || categoryError);
    return;
  }

  const isIncome = category.movement_types.type === "income";
  const newBalance = account.balance + (isIncome ? amount : amount * -1);

  let rpcName = "create_movement";
  const rpcData = {
    accountid: accountId,
    newbalance: newBalance,
    latestmovement: new Date().toISOString(),
    title: title,
    description: description,
    amount: amount,
    currencyid: currencyId,
    exchangerate: exchangeRate || 0,
    categoryid: categoryId,
    scheduledid: scheduledId || null,
  };

  if (installmentId) {
    const { data: installment, error } = await supabase
      .from("installments_expenses")
      .select("installments,paid_installments")
      .eq("id", installmentId)
      .single();

    if (error) {
      res.status(400).json(error);
      return;
    }

    const paidInstallments = installment.paid_installments + 1;
    rpcData.installmentid = installmentId;
    rpcData.paidinstallments = paidInstallments;
    rpcData.activeinstallment = installment.installments > paidInstallments;

    rpcName = "create_installment_movement";
  }

  const { error } = await supabase.rpc(rpcName, rpcData);

  if (error) {
    res.status(400).json({ error, rpcData });
    return;
  }

  return res.status(201).json({ message: "Created" });
};
