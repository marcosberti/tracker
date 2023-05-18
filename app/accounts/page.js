import { createServerClient } from "@/lib/supabase-server";
import Account from "./components/Account";

async function getAccounts() {
  const supabase = createServerClient();

  const { data: accounts } = await supabase
    .from("accounts")
    .select("id,name,color,icon,balance,currencies(id,code),latest_movement")
    .order("name", { ascending: true });

  return accounts;
}

export default async function Accounts() {
  const data = await getAccounts();

  return (
    <>
      <h1 className="text-lg font-bold">Accounts</h1>
      <div className="bg-pur mt-4 flex flex-wrap gap-4">
        {data.map((account) => (
          <Account key={account.id} account={account} />
        ))}
      </div>
    </>
  );
}
