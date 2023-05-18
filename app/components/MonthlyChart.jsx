"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const options = {
  responsive: true,
};

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function MonthlyChart({ monthsData }) {
  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: labels.map((_, i) => monthsData[i].income || 0),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Spent",
        data: labels.map((_, i) => monthsData[i].spent || 0),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className="flex-1 p-4">
      <Bar options={options} data={data} />
    </div>
  );
}
