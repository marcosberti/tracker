"use client";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

export default function MonthChart({ account, monthData }) {
  const chartData = {
    labels: ["income", "spent", "available"],
    datasets: [
      {
        label: "total",
        data: [monthData.income, monthData.spent, account.balance],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const hasMovements =
    monthData.income === null &&
    monthData.spent === null &&
    account.balance === null;

  return (
    <div className="flex min-w-[300px] basis-1/4 flex-col items-center">
      <p className="text-lg font-bold">Balance</p>
      {hasMovements ? (
        <Doughnut data={chartData} />
      ) : (
        <p className="mt-4 text-sm">No movements in your main account yet</p>
      )}
    </div>
  );
}
