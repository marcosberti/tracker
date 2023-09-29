'use client';
import MonthPicker from './month-picker';
import CreatePayment from './create-payment';
import SwitchFilter from '@/app/components/switch-filter';

export default async function Actions({
	isInCurrentMonth,
	account,
	movements,
	currencies,
	categories,
}) {
	return (
		<div className="flex items-center justify-end gap-2">
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
