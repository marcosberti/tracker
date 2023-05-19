import MonthPicker from "./MonthPicker";
import CreateOptions from "./CreateOptions";

export default function Actions({ account, currencies, categories }) {
  return (
    <div className="flex justify-end gap-2">
      <MonthPicker />
      <CreateOptions
        account={account}
        currencies={currencies}
        categories={categories}
      />
    </div>
  );
}
