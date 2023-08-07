import { createServerClient } from '@/lib/supabase-server';
import { getMonthsDates } from '@/lib/utils';
import MonthChart from './month-chart';
import MonthlyChart from './monthly-chart';

const getData = async () => {
	const supabase = createServerClient();

	const { data: account } = await supabase
		.from('accounts')
		.select('id,balance,currencies(code)')
		.eq('main', true)
		.single();

	const dates = getMonthsDates();

	// TODO monthly data no sirve por si hay pagos en !== currency, hay que hacerlo a manopla
	// const monthsData = await Promise.all(
	//   dates.map((month) =>
	//     supabase.rpc("get_monthly_data", {
	//       accountid: account.id,
	//       datefrom: month.start,
	//       dateto: month.end,
	//     })
	//   )
	// );

	const monthsData = [];

	const currentMonth = new Date().getMonth();
	return {
		account: account ?? {},
		monthsData: monthsData.map(res => res.data[0]),
		monthData: {}, //monthsData[currentMonth].data[0],
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
