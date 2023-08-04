'use client';
import MonthPicker from './MonthPicker';
import CreatePayment from './CreatePayment';
import SwitchFilter from '@/app/components/SwitchFilter';

export default async function Actions({
	isInCurrentMonth,
	account,
	movements,
	currencies,
	categories,
}) {
	return (
		<div className="flex justify-end gap-2">
			{isInCurrentMonth ? (
				<SwitchFilter label="only pending payments" paramKey="onlyPending" />
			) : null}
			<MonthPicker />
			<CreatePayment
				account={account}
				movements={movements}
				currencies={currencies}
				categories={categories}
			/>
		</div>
	);
}
