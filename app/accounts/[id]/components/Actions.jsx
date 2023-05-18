import { createServerClient } from "@/lib/supabase-server";
import MonthPicker from "./MonthPicker";
import MovementSheet from "./MovementSheet";

async function getData() {
  const supabase = createServerClient();

  const [{ data: currencies }, { data: categories }, { data: types }] =
    await Promise.all([
      supabase.from("currencies").select("id,name,code"),
      supabase.from("categories").select("id,name"),
      supabase.from("movement_types").select("id,type"),
    ]);

  return { currencies, categories, types };
}

export default async function Actions({ account }) {
  const { currencies, categories } = await getData();

  return (
    <div className="flex justify-end gap-2">
      <MonthPicker />
      <MovementSheet
        account={account}
        currencies={currencies}
        categories={categories}
      />
    </div>
  );
}
