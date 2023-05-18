import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const { authRoute } = require("@/lib/utils");

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

  console.log(">>>", {
    accountId,
    categoryId,
    title,
    description,
    amount,
    currencyId,
    exchangeRate,
    scheduledId,
    installmentId,
  });

  // const [
  //   { data: balance, error: accountError },
  //   { data: movementType, error: movementTypeError },
  // ] = await Promise.all([
  //   supabase.from("accounts").select("balance").eq("id", accountId).single(),
  //   supabase
  //     .from("categories")
  //     .select("movement_types(id,type)")
  //     .eq("id", categoryId)
  //     .single(),
  // ]);

  // if (accountError || movementTypeError) {
  //   res.status(400).json(accountError || movementTypeError);
  //   return;
  // }

  // const isIncome = movementType.type === "income";
  // const newBalance =
  //   balance + (isIncome ? movement.amount : movement.amount * -1);

  // let rpcName = "create_movement";
  // const rpcData = {
  //   accountid: accountId,
  //   newbalance: newBalance,
  //   latestmovement: new Date().toISOString(),
  //   title: title,
  //   description: description,
  //   amount: amount,
  //   currencyid: currencyId,
  //   exchangerate: exchangeRate || 0,
  //   categoryid: categoryId,
  //   scheduledid: scheduledId || null,
  // };

  // if (installmentId) {
  //   const { data: installment, error } = await supabase
  //     .from("installments_expenses")
  //     .select("installments,paid_installments")
  //     .eq("id", installmentId)
  //     .single();

  //   if (error) {
  //     res.status(400).json(error);
  //     return;
  //   }

  //   const paidInstallments = installment.paid_installments + 1;
  //   rpcData.installmentid = installmentId;
  //   rpcData.paidinstallments = paidInstallments;
  //   rpcData.activeinstallment = installment.installments > paidInstallments;

  //   rpcName = "create_installment_movement";
  // }

  // const { error } = await supabase.rpc(rpcName, rpcData);

  // if (error) {
  //   res.status(400).json(error);
  //   return;
  // }

  return res.status(201).json({ message: "Created" });
};
