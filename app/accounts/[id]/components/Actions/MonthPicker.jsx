'use client';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
	Calendar as CalendarIcon,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const MONTHS = [...new Array(12)].map((_, i) => {
	const date = new Date(2023, i, 1);
	return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
});

export default function MonthPicker() {
	const ref = useRef();
	const date = new Date();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	const [year, setYear] = useState(
		+(searchParams.get('year') || date.getFullYear()),
	);
	const month = +(searchParams.get('month') || date.getMonth());

	const handleNextYear = () => {
		setYear(old => old + 1);
	};

	const handlePreviousYear = () => {
		setYear(old => old - 1);
	};

	const handleMonth = _month => {
		router.push(`${pathname}?year=${year}&month=${_month}`);
		ref.current.click();
	};

	const handleCurrentMonth = () => {
		const year = date.getFullYear();
		setYear(() => {
			router.push(pathname);
			ref.current.click();
			return year;
		});
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					ref={ref}
					variant={'outline'}
					className={cn(
						'relative justify-start border-gray-300 text-left font-normal',
						month === null && 'text-muted-foreground',
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{month === null ? <span>Pick a month</span> : MONTHS[month]}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<MonthsCalendar
					year={year}
					month={month}
					onPreviousYear={handlePreviousYear}
					onNextYear={handleNextYear}
					onMonthChange={handleMonth}
					onSetCurrentMonth={handleCurrentMonth}
				/>
			</PopoverContent>
		</Popover>
	);
}

const MonthsCalendar = ({
	year,
	month,
	onPreviousYear,
	onNextYear,
	onMonthChange,
	onSetCurrentMonth,
}) => (
	<div className="w-[250px] rounded-lg  p-2">
		<div className="flex items-center justify-between">
			<Button
				variant="outline"
				className="h-6 w-6 p-0"
				onClick={onPreviousYear}
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>
			<span className="text-sm font-semibold">{year}</span>
			<Button variant="outline" className="h-6 w-6 p-0" onClick={onNextYear}>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
		<div className="mt-4 flex gap-2">
			{MONTHS.slice(0, 3).map((label, _month) => (
				<Button
					key={label}
					variant="ghost"
					className={`basis-1/3 text-gray-600 ${
						month === _month ? 'bg-gray-100' : ''
					}`}
					onClick={() => onMonthChange(_month)}
				>
					{label}
				</Button>
			))}
		</div>
		<div className="flex gap-2">
			{MONTHS.slice(3, 6).map((label, _month) => (
				<Button
					key={label}
					variant="ghost"
					className={`basis-1/3 text-gray-600 ${
						month === _month + 3 ? 'bg-gray-100' : ''
					}`}
					onClick={() => onMonthChange(_month + 3)}
				>
					{label}
				</Button>
			))}
		</div>
		<div className="flex gap-2">
			{MONTHS.slice(6, 9).map((label, _month) => (
				<Button
					key={label}
					variant="ghost"
					className={`basis-1/3 text-gray-600 ${
						month === _month + 6 ? 'bg-gray-100' : ''
					}`}
					onClick={() => onMonthChange(_month + 6)}
				>
					{label}
				</Button>
			))}
		</div>
		<div className="flex gap-2">
			{MONTHS.slice(9).map((label, _month) => (
				<Button
					key={label}
					variant="ghost"
					className={`basis-1/3 text-gray-600 ${
						month === _month + 9 ? 'bg-gray-100' : ''
					}`}
					onClick={() => onMonthChange(_month + 9)}
				>
					{label}
				</Button>
			))}
		</div>
		<div className="flex justify-end">
			<Button
				variant="link"
				className="p-2 text-xs text-blue-400 hover:text-blue-600"
				onClick={onSetCurrentMonth}
			>
				This month
			</Button>
		</div>
	</div>
);
