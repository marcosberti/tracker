import { createServerClient } from "@/lib/supabase-server";
import { getMonthsDates } from "@/lib/utils";
import MonthChart from "./MonthChart";
import MonthlyChart from "./MonthlyChart";

const getData = async () => {
  const supabase = createServerClient();

  const { data: account } = await supabase
    .from("accounts")
    .select("id,balance,currencies(code)")
    .eq("main", true)
    .limit(1)
    .single();

  const dates = getMonthsDates();

  const monthsData = await Promise.all(
    dates.map((month) =>
      supabase.rpc("get_monthly_data", {
        accountid: account.id,
        datefrom: month.start,
        dateto: month.end,
      })
    )
  );

  const currentMonth = new Date().getMonth();
  return {
    account,
    monthsData: monthsData.map((res) => res.data[0]),
    monthData: monthsData[currentMonth],
  };
};

export default async function Charts() {
  const { account, monthData, monthsData } = await getData();

  return (
    <>
      <MonthChart account={account} monthData={monthData} />
      <MonthlyChart monthsData={monthsData} />
    </>
  );
}
