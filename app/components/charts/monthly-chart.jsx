'use client';
import { Button } from '@/components/ui/button';
import { COLORS, getHueColor } from '@/lib/utils';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
} from 'chart.js';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
);

const options = {
	responsive: true,
};

const labels = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

function getButtonClasses(color, isSelected) {
	const bgClass = isSelected ? 'bg-color-300' : 'bg-color-100';

	return `${bgClass} text-color-600 hover:bg-color-400`.replace(
		/color/g,
		color,
	);
}

function AccountButton({ account, selected, onClick }) {
	const isSelected = selected.has(account.id);
	const background = getButtonClasses(account.color, isSelected);
	return (
		<Button className={background} onClick={() => onClick(account)}>
			{account.name}
		</Button>
	);
}

function LineChart({ selected, monthsData }) {
	const datasets = monthsData
		.filter(a => selected.has(a.id))
		.reduce((acc, account) => {
			const accountColor = getHueColor(account.color);

			const income = {
				label: `${account.name} Income`,
				data: account.data.map(d => d.income),
				fill: false,
				borderColor: `hsl(${accountColor}deg 60% 50%)`,
				backgroundColor: `hsl(${accountColor}deg 60% 50%)`,
				pointBorderColor: `hsl(${accountColor}deg 60% 50%)`,
				pointBackgroundColor: `hsl(${accountColor}deg 60% 50%)`,
				tension: 0.1,
			};
			const spent = {
				label: `${account.name} Spent`,
				data: account.data.map(d => d.spent),
				fill: false,
				borderColor: `hsl(${accountColor}deg 30% 50%)`,
				backgroundColor: `hsl(${accountColor}deg 30% 50%)`,
				pointBorderColor: `hsl(${accountColor}deg 30% 50%)`,
				pointBackgroundColor: `hsl(${accountColor}deg 30% 50%)`,
				tension: 0.1,
			};

			acc.push(income);
			acc.push(spent);

			return acc;
		}, []);

	const data = {
		labels,
		datasets,
	};

	return <Line options={options} data={data} redraw />;
}

export default function MonthlyChart({ accounts, monthsData }) {
	const [selected, setSelected] = useState(() => {
		const main = accounts.find(a => a.main);
		const set = new Set();
		set.add(main.id);

		return set;
	});

	const handleSelected = account => {
		setSelected(old => {
			const setlected = new Set(old);
			const isSelected = !!setlected.has(account.id);
			const method = isSelected ? 'delete' : 'add';
			setlected[method](account.id);

			return setlected;
		});
	};

	return (
		<div className="flex-1 p-4 hidden lg:block max-w-[65vw]">
			<div className="mb-4 flex gap-2">
				{accounts.map(account => (
					<AccountButton
						key={account.id}
						account={account}
						selected={selected}
						onClick={handleSelected}
					/>
				))}
			</div>
			<LineChart selected={selected} monthsData={monthsData} />
		</div>
	);
}
