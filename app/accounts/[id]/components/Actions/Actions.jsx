'use client';
import { useSearchParams } from 'next/navigation';
import MonthPicker from './MonthPicker';
import CreateExpenses from './CreateExpenses';
import CreatePayment from './CreatePayment';
import SwitchFilter from '@/app/components/SwitchFilter';

export default async function Actions({ account, currencies, categories }) {
	const searchParams = useSearchParams();
	const isInCurrentMonth = !Boolean(searchParams.get('month'));

	return (
		<div className="flex justify-end gap-2">
			{isInCurrentMonth ? (
				<SwitchFilter label="only pending payments" paramKey="onlyPending" />
			) : null}
			<MonthPicker />
			<CreateExpenses
				account={account}
				currencies={currencies}
				categories={categories}
			/>
			<CreatePayment
				account={account}
				currencies={currencies}
				categories={categories}
			/>
		</div>
	);
}
