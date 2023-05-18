import { createServerClient } from "@/lib/supabase-server";
import { getMonthDates } from "@/lib/utils";
import Actions from "./components/Actions";
import Breadcrumb from "./components/Breadcrumb";
import Overview from "./components/Overview";
import SummarizedCategories from "./components/SummarizedCategories";
import Movements from "./components/Movements";

async function getAccount(id, month, year) {
  const supabase = createServerClient();
  const { start: dateFrom, end: dateTo } = getMonthDates(year, month);

  const [
    { data: account },
    { data: movements },
    { data: income },
    { data: spent },
    { data: summarized },
  ] = await Promise.all([
    supabase
      .from("accounts")
      .select("id,name,balance,currencies(id,code)")
      .eq("id", id)
      .limit(1)
      .single(),
    supabase
      .from("movements")
      .select(
        "id,title,description,amount,exchange_rate,created_at,currencies(code),categories(name,icon,color,movement_types(type)),installment_id,scheduled_id"
      )
      .eq("account_id", id)
      .order("created_at", { ascending: false })
      .lte("created_at", dateTo)
      .gte("created_at", dateFrom),
    supabase.rpc("get_monthly_income", {
      accountid: id,
      datefrom: dateFrom,
      dateto: dateTo,
    }),
    supabase.rpc("get_monthly_spent", {
      accountid: id,
      datefrom: dateFrom,
      dateto: dateTo,
    }),
    supabase.rpc("get_summarized_categories", {
      accountid: id,
      datefrom: dateFrom,
      dateto: dateTo,
    }),
  ]);

  return {
    account,
    movements,
    income,
    spent,
    summarized,
  };
}

export default async function Account({
  params: { id },
  searchParams: { month, year },
}) {
  const { account, income, spent, movements, summarized } = await getAccount(
    id,
    month,
    year
  );

  return (
    <>
      <Breadcrumb account={account} />
      <div className="mt-4">
        <Overview account={account} income={income} spent={spent} />
      </div>
      <div className="mt-4">
        <Actions account={account} />
      </div>
      <div className="mt-4">
        <SummarizedCategories account={account} summarized={summarized} />
      </div>
      <div className="mt-4">
        <Movements movements={movements} />
      </div>
    </>
  );
}
